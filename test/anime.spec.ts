import Anime = require('../src/anime');

import utils = require('./__util__');

const {propNames} = utils;

// Use example anime to init a new Anime object
// eslint-disable-next-line max-len
const ins: Anime = new Anime('1|13|13|3|817|4526|822|4556|870|12|1999-1999|TV Series|Seikai no Monshou|?????|Crest of the Stars|?????\'Crest of the Stars|CotS\'SnM|Hv?zdn? erb\'?????|Space,Plot Continuity,Future,Space Travel,Sci-Fi,Other Planet,Action,Genetic Modification,Novel,War,Shipboard,Slow When It Comes to Love,Military,Romance,Human Enhancement,Large Breasts,Gunfights,Adventure,Nudity,Small Breasts|915321600|922579200|16|0|224618.jpg'.split('|'));

describe('Anime class', () => {
  test('creation of new Anime Objects', () => {
    expect(ins).toBeTruthy();
  });

  test('getters for all properties', () => {
    // Test getters to return example data
    for (let i = 0; i < propNames.length; i++) {
      const res = ins.get(propNames[i]);
      expect(res).toMatchSnapshot();
    }
  });
});
