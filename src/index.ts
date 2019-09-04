import dgram = require('dgram');
const {Promise} = require('bluebird');
import cron = require('node-cron')
import Anime = require('./anime');

interface Auth {
  username: string;
  password: string;
  protover: number;
  client: string;
  clientver: number;
}

interface connOpts {
  url: string;
  port: number;
}

/**
 * A class for interacting with the UDP API of AniDB
 */
class anidbInstance {
  sid: string = '';
  jobs: Array<{ req: string; callback: Function }> = [];
  reqSock: dgram.Socket;
  jobber: cron.ScheduledTask;

  /**
   * Create a new anidbInstance Object and auth to the API
   * @param {Auth} auth Auth object containing AniDB credentials:
   * -- All fields are required --
   * username: String;
   * password: String;
   * protover: number; // Specify version of API to use
   * client: String; // Specify name of your client as registered on AniDB
   * clientver: String; // Specify version of client
   * @param {connOpts} opt Optional connections parameters:
   * url: String; // API Endpoint, defaults to api.anidb.net
   * port: number; // AniDB API port, defaults to 9000
   */
  constructor(auth: Auth, public opt: connOpts) {
    this.makeReq = this.makeReq.bind(this);
    this.getAnime = this.getAnime.bind(this);

    this.jobber = cron.schedule('*/2 * * * * *', () => {
      const job = this.jobs.shift();
      if (job) {
        console.log('req\'ing', job.req);
        this.makeReq(job.req, job.callback);
      } else {
        console.log('idling\n');
      }
    });
    this.reqSock = dgram.createSocket('udp4');
    const req = [
      'AUTH ',
      `user=${auth.username}&`,
      `pass=${auth.password}&`,
      `protover=${auth.protover}&`,
      `client=${auth.client}&`,
      `clientver=${auth.clientver}`,
    ].join('');
    console.log('Sent Request: ', req);

    this.reqSock.once('message', (msg) => {
      const r = msg.toString().split(' ');
      console.log(r);
      const statusCode = r[0];
      if (statusCode === '200') {
        this.sid = r[1];
      } else {
        const e = new Error('Auth error check credentials or anidb status');
        throw e;
      }
    });
    this.opt = !opt ?
      {
        port: 9000,
        url: 'api.anidb.net',
      } : {
        port: opt.port || 9000,
        url: opt.url || 'api.anidb.net',
      };
    this.reqSock.send(req, this.opt.port, this.opt.url, (e) => {
      if (e) {
        throw e;
      }
    });
  }

  /**
   * Function to make requests to the AniDB API
   * @param {String} req The request to make
   * @param {function} callback Callback function, called with response as arg
   */
  makeReq(req: string, callback: Function) {
    this.reqSock.once('message', (msg) => {
      const data = msg.toString();
      console.log('Received from server: ', data);
      callback(data, null);
    });
    this.reqSock.send(req, this.opt.port, this.opt.url, (e) => {
      console.log('Sent Request: ', req);
      if (e) {
        callback(null, e);
      }
    });
  }

  /**
   * Gets an anime from AniDB
   * @param {number} aid AniDB Anime ID of the anime to get
   * @return {Promise<Anime>} The retrieved anime object
   */
  getAnime(aid: number): Anime {
    const retval = new Promise((resolve: Function) => {
      this.jobs.push({
        req: `ANIME aid=${aid}&s=${this.sid}`,
        callback: (data: string) => {
          const r = data.split('\n')[1].split('|');
          if (data[0] == '2') {
            const res = new Anime(r);
            resolve(res);
          }
        },
      });
    });
    return retval;
  }


  /**
   * Logs out the current session
   */
  logout() {
    this.jobs.push({
      req: `LOGOUT s=${this.sid}`,
      callback: () => {
        console.log('Logged Out');
      },
    });
  }
}

export = anidbInstance;
