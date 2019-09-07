import AniDB = require('../src');
import chai = require('chai');
import utils = require('./__util__');

const expect = chai.expect;

describe('AniDB module', function() {
  this.timeout(14000);
  const ins = new AniDB({
    username: process.env.UNAME!,
    password: process.env.PASSWD!,
    client: process.env.CLIENT!,
    clientver: parseInt(process.env.CLVER!),
    protover: parseInt(process.env.PVER!),
  });

  before(function() {
    return ins.up;
  });

  after(function() {
    return ins.logout();
  });

  it('logs into AniDB server on creation', function() {
    expect(ins.sid).not.to.be.equal('');
  });

  it('pings AniDB server', function(done) {
    ins.jobs.push({
      req: 'PING',
      callback: (data: string) => {
        expect(data).to.equal('300 PONG\n');
        done();
      }});
  });

  it('fetches anime by id', function() {
    const {AnimeEx} = utils;
    return ins.getAnime(1).then((anime) => {
      for (let i = 0; i < AnimeEx.propNames.length; i++) {
        expect(anime.get(AnimeEx.propNames[i])).to.equal(AnimeEx.propValues[i]);
      }
    });
  });
});
