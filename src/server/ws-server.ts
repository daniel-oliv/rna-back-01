import { BaseServer } from "./server";
import * as logger from 'winston';
import * as expressWs from 'express-ws'
import WebSocket = require("../../node_modules/@types/ws")
import {Instance} from 'express-ws'
import {Server} from 'ws'
import { HandlerManager } from "./wsHandlers";
import { WsMsg } from "./wsHandlers/ws-msg";

export class WsServer extends BaseServer {
  private wsServer: Instance;
  public start(){
    super.start();
    logger.debug('[ws-server.ts,12] Configuring WebSocket Server')
    this.wsServer = expressWs(this.app, this.server);
    let wss = this.wsServer.getWss();
    wss.on('close', (serv: Server) => {serv.clients.forEach(d=>d.close());logger.debug(`[ws-server.ts,12]  on close wss`)})
    wss.on('connection', (ws) => {
    console.log('ws connection');
    //   // ws['isAlive'] = true;

      // ws.on("pong",() => {
      //   ws['isAlive'] = true;
      // });
      ws.onopen =  function open() {
        logger.debug('WsServer onopen connection');
        ws.send('opened on the server');
      };
      ws.onclose =  function open() {
        ws.close();
        logger.debug('[ws-server.ts,26] connection close.')
      };
      logger.debug('[ws-server.ts,21] connection received.')
    //   ws.send("connection fired at the seven. ")
    // });

    // setInterval(() => {
    //   wss.clients.forEach((ws) => {
          
    //       if (!ws['isAlive']) return ws.terminate();
          
    //       ws['isAlive'] = false;
    //       ws.ping(null, false, (error)=>{console.log(error)});
    //   });
    // }, 10000);
    // this.app.get('/', function(req, res, next){
    //   console.log('get route', req['testing']);
    //   res.end();
    // });
     
    // (this.app as any).ws('/', function(ws, req) {
    //   ws.on('message', function(msg) {
    //     console.log(msg);
    //   });
    //   console.log('socket', req);
     });
    this.ws('/connect')
  }

  static i = 0
  public ws(url: string): void {
    
      (this.app as any).ws(url, function(ws: WebSocket, req) {
        ws.on('message', async function(msg) {
          try {
          // console.log('raw ', msg);
          // console.log('json parsed', JSON.parse(msg));
          // ws.send(JSON.stringify('aqui' + WsServer.i++))
          // console.log('socket', req);
          if(typeof msg == 'string'){
            const objMsg =  <WsMsg>JSON.parse(msg);
            console.log('objMsg.type ', objMsg.type);
            await HandlerManager.handle(ws,objMsg)
          }else{
            logger.warn('Non string package');
          }
        } catch (error) {
          logger.error(error.stack);
          //TODO - tratar erro como se deve para websockets
        }
        
      });
      });
    
  }  
} 


export interface WsRestMsg{
  type: 'GET'|'PUT'|'DELETE'|'POST',
  url: string;
  params?: any;
}