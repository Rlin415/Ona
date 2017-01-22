describe('Calculate', () => {

  let result;

  it('should return an object', (done) => {
    calculate('https://raw.githubusercontent.com/onaio/ona-tech/master/data/water_points.json')
      .then((data) => {
        expect(data).to.be.an('object')
        result = data;
        done();
      });
  });

  it('should calculate number of functional water points', () => {    
    expect(result.functional).to.eql(625);
  });

  it('should calculate number of water points per community', () => {
    result.communities.forEach((c) => {
      if (c.name === 'Zundem') expect(c.waterPoints).to.eql(30);
      if (c.name === 'Jiriwiensa') expect(c.waterPoints).to.eql(8);
      if (c.name === 'Zukpeni') expect(c.waterPoints).to.eql(6);
    });
  });

  it('should rank communities according to their percentage of broken water points', () => {
    result.communities.forEach((c) => {
      if (c.name === 'Zundem') expect(c.rank).to.eql(1);
      if (c.name === 'Tantala') expect(c.rank).to.eql(16);
      if (c.name === 'Zukpeni') expect(c.rank).to.eql(26);
    });
  });

})
