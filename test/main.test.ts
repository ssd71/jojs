import Anidb = require('../src/index');
// import Anime = require('../src/anime');
import utils = require('./__util__');

let c: Anidb;

beforeAll(() => {
  c = new Anidb({
    username: process.env.UNAME!,
    password: process.env.PASSWD!,
    client: process.env.CLIENT!,
    clientver: parseInt(process.env.CLVER!),
    protover: parseInt(process.env.PVER!),
  });
});

describe('AniDB', () => {
  it('pings AniDB server', (done) => {
    c.jobs.push({
      req: 'PING',
      callback: (data: string) => {
        expect(data).toMatchSnapshot();
        done();
      }});
  }, 30000);
  it('logs in on creation', () => {
    expect(c.sid).toBeTruthy();
  }, 30000);
  it('gets anime from anidb', () => {
    c.getAnime(1)
        .then((anime) => {
          const {propNames} = utils;
          for (let i = 0; i < propNames.length; i++) {
            const res = anime.get(propNames[i]);
            expect(res).toMatchSnapshot();
          }
        });
  }, 30000);
});

// afterAll((done) => {
//   c.logout().then(() => {
//     expect(c.sid).toBeFalsy();
//     done();
//   });
// });
