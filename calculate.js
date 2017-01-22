function calculate(url) {
  return $.get(url)
    .then((data) => {      
      const communities = groupByCommunity(data);
      const totalFunctioningWaterPoints = getTotalFunctioningWaterPoints(communities);
      const sortedCommunities = Object.keys(communities).sort((a, b) => {
        return (communities[a].broken / communities[a].waterPoints) - (communities[b].broken / communities[b].waterPoints);
      });
      const communitiesWithRank = assignRanks(communities, sortedCommunities);
      return {
        functional: totalFunctioningWaterPoints,
        communities: Object.values(communitiesWithRank)
      };
    })
    .fail((err) => {
      console.error(err);
    });
}

function groupByCommunity(data) {
  return JSON.parse(data).reduce((result, obj) => {
    let functioning = obj.water_functioning === 'no' ? 0 : 1;
    if (!result[obj.communities_villages]) result[obj.communities_villages] = { name: obj.communities_villages, waterPoints: 0, broken: 0 };
    if (!functioning) result[obj.communities_villages].broken++;
    result[obj.communities_villages].waterPoints++;
    return result;
  }, {});
}

function assignRanks(comm, sorted) {
  let result = {};
  let rank = 1;
  sorted.forEach((c, i) => {
    if (i === 0) {
      result[c] = Object.assign(comm[c], { rank });
    } else {
      let prevHasLowerPercentage = comm[sorted[i - 1]].broken / comm[sorted[i - 1]].waterPoints < comm[c].broken / comm[c].waterPoints;
      if (prevHasLowerPercentage) rank++;
      result[c] = Object.assign(comm[c], { rank });
    }
  });
  return result;
}

function getTotalFunctioningWaterPoints(comm) {
  return Object.values(comm).reduce((res, obj) => {
    return res + obj.waterPoints - obj.broken;
  }, 0);
}
