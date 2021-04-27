import * as logger from 'winston'
import { EventEmitter } from 'events';

import { TargetLessDatum } from "./target-less-datum";
import { shuffle } from 'lodash';
import { Neuron } from './neuron';
import { minIndex } from '../utils/object-utils';
import { InitWeightsRandom, InitWeightsModeParams } from './neuron';

export class SOM implements SOM_Params{
  nIns: number;
  nOuts: number;
  units: Neuron[];
  r: number
  a: number;
  k: number;
  maxEpoch: number;
  initWeightsMode: InitWeightsModeParams | InitWeightsRandom;

  epoch: number;

  constructor(params){
    Object.assign(this,params)
    this.initNeurons();
  }

  initNeurons(){
    this.units = Array(this.nOuts);
    for (let i = 0; i < this.nOuts; i++) {
      this.units[i] = new Neuron({
        nInputs: this.nIns,
        a: this.a,
        k: this.k
      });
    }
    this.units.forEach(n=>n.resetWeights(this.initWeightsMode));
  }
  protected trainEpoch(data: TargetLessDatum[]){
    // let time: string;
    console.time('trainEpoch');
    data = shuffle(data);
    for (const datum of data) {
      // console.time('batch');
      this.trainDatum(datum);
      // console.timeEnd('batch');  
    }
    this.units.forEach(d=>d.updateLearning())
    console.timeEnd('trainEpoch');  
  }

  protected trainDatum(datum:TargetLessDatum){
    const dists = this.units.map(d=>d.getDist(datum.inVector))
    const minI = minIndex(dists);
    const start = Math.max(minI-this.r,0)
    const end = Math.min(minI + this.r+1, this.nOuts)
    const toUpdate = this.units.slice(start, end)
    toUpdate.forEach(d=>d.updateWs(datum.inVector))
  }

  stop(): boolean{
    return this.maxEpoch && (this.epoch >= this.maxEpoch)
  }

  async cluster(inputs: TargetLessDatum[], listener: (...args: any[]) => void){
    SOM.emitter$.addListener('train',listener);
    this.epoch = 0;
    // this.onStartTrain()
    do {
      // this.notLearned = 0
      this.epoch++;
      logger.verbose('------------Epoch-------------- '+ this.epoch);
      // this.eachEpoch();
      this.trainEpoch(inputs)
      SOM.emitter$.emit('train',this.trainResult())
      // await sleep(25);
    } while (!this.stop());    

    SOM.emitter$.removeListener('train',listener)

    //?debug
    console.log('\n---Final weights---')
    console.log('\n---outputNeurons---')
    // this.printWs(this.outputNeurons)
    
    // this.onTrainEnd()

    return this.trainResult();
  }

  trainResult(){
    return {
      epoch: this.epoch, 
      ws: this.units.map(d=>d.ws)
    }
  }

  

  //! always unregister from the emitter
  private static emitter$ = SOM.initEventEmitter();
  private static initEventEmitter(){
    const e$ = new EventEmitter({ captureRejections: true });
    e$.on('error',(error)=>{
      logger.error('Entity.emitter$ onError()');
      logger.error(error.stack);
    })
    return e$;
  }
}

export interface SOM_Params{
  nIns: number;
  nOuts: number;
  r: number
  a: number;
  k: number;
  maxEpoch: number;
  initWeightsMode: InitWeightsModeParams | InitWeightsRandom;
}