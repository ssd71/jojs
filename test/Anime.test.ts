import chai = require('chai');
import Anime = require('../src/Anime');
import util = require('./__util__');

const expect = chai.expect;

describe('Anime module', () => {
  const {AnimeEx} = util;
  const {propNames} = AnimeEx;
  const ex = new Anime(AnimeEx.propValuesRaw);
  it('constructs Anime object from array of properties', () => {
    // console.log(ex.props, AnimeEx.props);
    expect(ex.props).to.include(AnimeEx.props);
  });

  it('has getters for all properties', () => {
    for (let i = 0; i < propNames.length; i++) {
      expect(ex.get(propNames[i])).to.equal(AnimeEx.propValues[i]);
    }
  });
});
