import { WsMsg, WsAck } from "./ws-msg";
import { imgCharDataService } from "../../lib/services/img-char-data";
import { mlpService } from "../../lib/services/mlp-service";
import { somService } from "../../lib/services/som-service";
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
      const err: WsAck = {url: msg.url, type: 'END_OK', id:msg.id}
      ws.send(JSON.stringify(err));
    }

    else if(msg.type === 'GET' && msg.params.res ==='dataset'){
      const res = await imgCharDataService.getAllOnDB()
      const ret: WsAck = {url: msg.url, body: res, type: 'END_OK', id:msg.id}
      ws.send(JSON.stringify(ret));
    }

    if(msg.type === 'subscribe' && msg.params.res ==='trainNet'){
      const datasetID = msg.params.datasetID;
      const annParams = msg.params.ann
      const res = await imgCharDataService.trainNet(datasetID, annParams, 
        (result)=> {
        const ret: WsAck = {url: msg.url, id: msg.id, body:result, type: 'DATA'} 
        ws.send(JSON.stringify(ret))
      })
      const ret: WsAck = {url: msg.url, body:res, type: 'END_OK', id:msg.id}
      ws.send(JSON.stringify(ret));
    }

    if(msg.type === 'POST' && msg.params.res ==='testNet'){
      console.log('testNet ');
      const datasetID = msg.params.datasetID;
      const res = await imgCharDataService.testNet(datasetID)
      const ret: WsAck = {url: msg.url, body: res, type: 'END_OK', id:msg.id}
      ws.send(JSON.stringify(ret));
    }

    if(msg.type === 'subscribe' && msg.params.res ==='trainAndTestSonar'){
      const annParams = msg.params.ann
      const res = await imgCharDataService.trainAndTestSonar(annParams, 
        (result)=> {
        const ret: WsAck = {url: msg.url, id: msg.id, body:result, type: 'DATA'} 
        ws.send(JSON.stringify(ret))
      })
      const ret: WsAck = {url: msg.url, body:res, type: 'END_OK', id:msg.id}
      ws.send(JSON.stringify(ret));
    }
    
    if(msg.type === 'subscribe' && msg.params.res ==='trainAndTestMLP'){
      const annParams = msg.params.ann
      const res = await mlpService.trainAndTest(msg.params.datasetID, annParams, 
        (result)=> {
        const ret: WsAck = {url: msg.url, id: msg.id, body:result, type: 'DATA'} 
        ws.send(JSON.stringify(ret))
      })
      const ret: WsAck = {url: msg.url, body:res, type: 'END_OK', id:msg.id}
      ws.send(JSON.stringify(ret));
    }

    if(msg.type === 'subscribe' && msg.params.res ==='trainCrossValidation'){
      const annParams = msg.params.ann
      const res = await mlpService.trainCrossValidation(msg.params.datasetID, annParams, 
        (result)=> {
        const ret: WsAck = {url: msg.url, id: msg.id, body:result, type: 'DATA'} 
        ws.send(JSON.stringify(ret))
      })
      const ret: WsAck = {url: msg.url, body:res, type: 'END_OK', id:msg.id}
      ws.send(JSON.stringify(ret));
    }

    if(msg.type === 'subscribe' && msg.params.res ==='clusterSOM'){
      const somParams = msg.params.som
      const res = await somService.cluster(msg.params.datasetID, somParams, 
        (result)=> {
        const ret: WsAck = {url: msg.url, id: msg.id, body:result, type: 'DATA'} 
        ws.send(JSON.stringify(ret))
      })
      const ret: WsAck = {url: msg.url, body:res, type: 'END_OK', id:msg.id}
      ws.send(JSON.stringify(ret));
    }
  }
}