import { WsMsg, WsAck } from "./ws-msg";
import WebSocket = require("../../../node_modules/@types/ws")
import {ImgCharDataHandler} from './img-char-data'
export class HandlerManager{
  static handlers = {
    '/img-char-data' : ImgCharDataHandler
  };
  static async handle(ws: WebSocket, msg: WsMsg){
    const hand = this.handlers[msg.url]
    if(hand){
      await hand.handle(ws, msg) 
    }else{
      const err: WsAck = {url: msg.url, type: 'END_ERROR'}
      ws.send(JSON.stringify(err));
    }
  }
}

interface WsHandler{
  handle: (ws: WebSocket, WsMsg)=>any
}