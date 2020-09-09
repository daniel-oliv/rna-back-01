import { randomInt } from "../../utils/common";

export interface WsMsg{
  type: string,
  url: string
  id?: number;
  params?: any;
  body?: any
}

export interface WsEventMsg extends WsMsg{
  type: 'subscribe' | 'unsubscribe',
}

export function wsEventMsgFac(msg: WsEventMsg): WsEventMsg{
  return Object.assign({}, msg,{id:randomInt(1000000)})
}

export interface WsRestMsg extends WsMsg{
  type: 'GET'|'PUT'|'DELETE'|'POST',
}

export interface WsAck extends WsMsg{
  type: 'END_OK'|'END_ERROR'|'DATA',
}