import dgram = require('dgram');
import cron = require('node-cron');
import bluebird = require('bluebird');
const {Promise} = bluebird;
import Anime = require('./Anime');


/**
 * Interface for storing AniDB credentials
 */
interface Auth {
  /**
   * AniDB username of the user
   */
  username: string;
  /**
   * The corresponding password
   */
  password: string;
  /**
   * Version of the API to use
   */
  protover: number;
  /**
   * AniDB registered client name
   */
  client: string;
  /**
   * Version of the client in use
   */
  clientver: number;
}

/**
 * Interface to store AniDB connection parameters; see AniDB constructor
 */
interface connOpts {
  url: string;
  port: number;
}

/**
 * A class for interacting with the UDP API of AniDB
 */
class AniDB {
  /**
   * AniDB session id retrieved from server on login
   */
  sid: string = '';
  /**
   * Promise that resolves to `true` on successful login
   */
  up: Promise<boolean>;
  /**
   * Queue of pending requests
   *
   * Example job:
   * ```
   * const job = { req: 'PING', callback: (data) => console.log(data) }
   * ```
   */
  jobs: Array<{ req: string; callback: Function }> = [];
  /**
   * The socket used to make requests and receive data from AniDB
   */
  reqSock: dgram.Socket;
  /**
   * A `node-cron` task that executes requests from `jobs` periodically
   */
  jobber: cron.ScheduledTask;
  /**
   * Optional connection parameters; see constructor
   */
  opt: connOpts;

  /**
   * Create a new AniDB Object and auth to the API
   * @param {Auth} auth Auth object containing AniDB credentials:
   * ```
   * //-- All fields are required --
   * username: String;
   * password: String;
   * protover: number; // Specify version of API to use
   * client: String; // Specify name of your client as registered on AniDB
   * clientver: String; // Specify version of client
   * ```
   * @param {connOpts} opt Optional connections parameters:
   * ```
   * url: String; // API Endpoint, defaults to api.anidb.net
   * port: number; // AniDB API port, defaults to 9000
   * ```
   * Example
   * ```
   * const instance = new AniDB({
   *  username: 'kazumadesu',
   *  password: 'meguminbestgirl',
   *  protover: 3
   *  client: 'perfectlyreasonableclientname',
   *  clientver: 1,
   * });
   * ```
   */
  constructor(auth: Auth, opt?: connOpts) {
    this.makeReq = this.makeReq.bind(this);
    this.getAnime = this.getAnime.bind(this);
    this.logout = this.logout.bind(this);

    this.opt = !opt ?
      {
        port: 9000,
        url: 'api.anidb.net',
      } : {
        port: opt.port || 9000,
        url: opt.url || 'api.anidb.net',
      };

    this.jobber = cron.schedule('*/4 * * * * *', () => {
      const job = this.jobs.shift();
      if (job) {
        console.log('req\'ing', job.req);
        this.makeReq(job.req, job.callback);
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

    this.up = new Promise((resolve: Function, reject: Function) => {
      this.jobs.push({
        req,
        callback: (msg: string) => {
          const r = msg.toString().split(' ');
          console.log(msg.toString());
          const statusCode = r[0];
          if (statusCode === '200') {
            this.sid = r[1];
            resolve(true);
          } else {
            const e = new Error('Auth error check credentials or anidb status');
            reject(e);
          }
        },
      });
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
  getAnime(aid: number): Promise<Anime> {
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
   * @return {Promise<any>} Promise object fulfilled on logout
   */
  logout(): Promise<any> {
    return new Promise((resolve: Function) => {
      this.jobs.push({
        req: `LOGOUT s=${this.sid}`,
        callback: () => {
          this.sid = '';
          console.log('Logged Out');
          this.reqSock.close(() => console.log('Socket closed'));
          resolve();
        },
      });
    });
  }
}

export = AniDB;
