import {main02} from './trab-02/main02'
import { configuration } from '../config/configuration';
import { initSources } from './db/data-source';
import { WsServer } from './server/ws-server';
import MongoDriver from './db/mongo-driver';
import { main04 } from './trab-04/main04';


async function main(){
  try {
    
    const config = configuration.getConfig();
    await initSources(config)
    // const docs = await MongoDriver.findMany('imgchardata', {})
    await (new WsServer().listen())// new Server().listen();
    await main04()
  } catch (error) {
    console.log(error)
  }
  // await main02();
}

main();