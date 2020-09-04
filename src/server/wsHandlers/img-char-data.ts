import { WsMsg, WsAck } from "./ws-msg";
import { imgCharDataService } from "../../lib/services/img-char-data";
import { Dataset } from "../../trab-02/interfaces/interfaces/dataset";

export class ImgCharDataHandler{

  constructor(){

  }
  static url: string = '/img-char-data';

  static async handle(ws: WebSocket, msg: WsMsg){
    console.log('handle msg.type', msg.type)
    console.log('handle msg.params', msg.params)
    if(msg.type === 'POST' && msg.params.res ==='dataset'){
      const dataset = <Dataset>msg.params.dataset;
      const res = await imgCharDataService.addAndSaveOnDB(dataset)
      const err: WsAck = {url: msg.url, type: 'END_OK'}
      ws.send(JSON.stringify(err));
    }

    else if(msg.type === 'GET' && msg.params.res ==='dataset'){
      const res = await imgCharDataService.getAllOnDB()
      const ret: WsAck = {url: msg.url, body: res, type: 'END_OK'}
      ws.send(JSON.stringify(ret));
    }

    if(msg.type === 'POST' && msg.params.res ==='trainNet'){
      const datasetID = msg.params.datasetID;
      const theta = msg.params.theta;
      const learningRate = msg.params.learningRate;
      console.log('theta ', theta);
      console.log('learningRate ', learningRate);
      const res = await imgCharDataService.trainNet(datasetID, learningRate, theta)
      const ret: WsAck = {url: msg.url, type: 'END_OK'}
      ws.send(JSON.stringify(ret));
    }

    if(msg.type === 'POST' && msg.params.res ==='testNet'){
      console.log('testNet ');
      const datasetID = msg.params.datasetID;
      const res = await imgCharDataService.testNet(datasetID)
      const ret: WsAck = {url: msg.url, body: res, type: 'END_OK'}
      ws.send(JSON.stringify(ret));
    }
    
  }
}