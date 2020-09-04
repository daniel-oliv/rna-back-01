export interface WsMsg{
  type: string,
  url: string
  params?: any;
  body?: any
}

export interface WsEventMsg extends WsMsg{
  type: 'subscribe' | 'unsubscribe',
}

export interface WsRestMsg extends WsMsg{
  type: 'GET'|'PUT'|'DELETE'|'POST',
}

export interface WsAck extends WsMsg{
  type: 'END_OK'|'END_ERROR',
}