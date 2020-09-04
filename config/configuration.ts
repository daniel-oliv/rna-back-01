import * as winston from 'winston';

export class Configuration {

    public config;

    constructor(){
        const env = process.env.NODE_ENV || 'local';
        console.log("Env: ", env)
        if (env == 'local') {
            this.config = require('./config.local');
        } else if (env == 'dev') {
            this.config = require('./config.dev');
        } else {
            this.config = require('./config.prod');
        }

        if (!this.config) {
            console.log("Nao foi possível caregar as informações de configurações.");
            return;
        }
        
        //! winston
        //log levels  error: 0,   warn: 1,   info: 2,   verbose: 3,   debug: 4,   silly: 5 
        configWinstonLogger(this.config.logWinston);

    }

    

    public getConfig() {
        return this.config;
    }
}

function configWinstonLogger(winstonConfig){
    if (winstonConfig) {
        const transpConfig = winstonConfig.transports;
      /// for disable logger comment config.log section inside config file (ex.: config.prod.js)
      let transports = [];
      if(transpConfig.file){ 
          transports.push(new winston.transports.File(transpConfig.file)) 
      }
      if(transpConfig.console){ 
          transports.push(new winston.transports.Console(transpConfig.console))        
      }
      let logger = winston.createLogger({
          transports: transports,
          exitOnError: false, // do not exit on handled exceptions
      });
      winston.add(logger);
    }
    else{
      console.log('No log configuration for winston found it.');
    }
  }

export const configuration = new Configuration();

