import * as logger from 'winston'
import { EventEmitter } from 'events';

import { printMatrix } from "../../utils/binary";
import { InitWeightsMode, Neuron } from "./neuron";
import {StepNeuron} from './step-neuron'
import { Datum } from "../Datum";
import { sleep } from '../../utils/common';


export abstract class  ANN{
  //Parameters
  nInputs: number; 
  nOutputs: number;
  initWeightsMode;
  learningRate: number = 0.001;
  theta: number = 0;
  
  ///Layers and Architecture
  outputNeurons: (StepNeuron | Neuron)[];
  
  /// output
  epoch: number;
  notLearned: number;

  /// data
  validationSet: Datum[]
  lastValidationErrors: number;
  setsLength: SetsLength

  constructor(params: AnnParams){
    Object.assign(this, params)
    this.outputNeurons = Array(this.nOutputs);
    // console.log('ANN theta ', theta);
  }

  initNeurons(){
    for (let i = 0; i < this.nOutputs; i++) {
      this.outputNeurons[i] = new StepNeuron({
          nInputs: this.nInputs,
          theta: this.theta
      });
    }
  }
  protected abstract eachEpoch()
  protected abstract stop(): boolean

  public async trainAndTest(dataset: Datum[], setsLen:SetsLength, listener: (...args: any[]) => void){
    const res = {}
    this.setsLength = setsLen;
    let ends = [
      setsLen.train, 
      setsLen.train + setsLen.test, 
      setsLen.train + setsLen.test + setsLen.validation
    ] 
    const trainSet = dataset.slice(0,ends[0]) 
    const testSet = dataset.slice(ends[0], ends[1]) 
    this.validationSet = dataset.slice(ends[1], ends[2])
    this.lastValidationErrors = this.validationSet.length;
    res['train'] = await this.train(trainSet, listener);

    res['test'] = this.testDataset(testSet);
    return res;
  }
  protected abstract trainDatum(datum:Datum)
  trainResult(){
    return {
      epoch: this.epoch, 
      notLearned: this.notLearned
    }
  }  

  async train(data: Datum[], listener: (...args: any[]) => void){
    ANN.emitter$.addListener('train',listener);
    this.epoch = 0;
    //! resetting neurons weights
    this.outputNeurons.forEach(n=>n.resetWeights(this.initWeightsMode))
    do {
      this.notLearned = 0
      this.epoch++;
      console.log('------------Epoch--------------', this.epoch);
      this.eachEpoch();
      this.trainEpoch(data)
      ANN.emitter$.emit('train',this.trainResult())
      await sleep(100);
    } while (!this.stop());

    ANN.emitter$.removeListener('train',listener)

    //?debug
    console.log('\n---Final weights---')
    this.outputNeurons.forEach((n, i)=>{
      console.log('Neuron ', i)
      console.log('w = ', n.ws)
      console.log('b = ', n.b)
    })

    console.log('\n---Previous and recommended weights---')
    this.outputNeurons.forEach((n, i)=>{
      console.log('Neuron ', i)
      console.log('w = ', n.preWs)
      console.log('b = ', n.preB)
    })

    return this.trainResult();
  }

  protected trainEpoch(data: Datum[]){
    for (const datum of data) {
      this.trainDatum(datum)    
    }
  }

  protected calcOuts(datum: Datum): number[]{
    const outs = [];
    for (const neuron of this.outputNeurons) {
      outs.push(neuron.setInAndOut(datum.inVector));
    }
    return outs;
  }

  testDataset(data: Datum[]): TestResult{
    const res: TestResult = {erros: 0, notLearned: []}
    for (const datum of data) {
      if(!this.testDatum(datum)){
        ++res.erros;
        res.notLearned.push({
          id:datum.id, 
          fOuts: this.outputNeurons.map(d=>d.fOut),
          outs: this.calcOuts(datum)
        });
      }
    }
    return res;
  }

  testDatum(datum: Datum){
    const outs = this.calcOuts(datum);
    console.log('testDatum() outs ', outs);
    for (let i = 0; i < this.outputNeurons.length; i++) {
      const t = datum.targetVector[i];
      const out = outs[i];
      /// if output is wrong
      if(out!==t){
        return false;
      }
    }
    return true;
  }

  isSpecifying(){
    let ret = false;
    if(this.validationSet && this.epoch%30===0){
      const res = this.testDataset(this.validationSet)
      const currentErros = res.erros;
      if(this.epoch>1 && currentErros > this.lastValidationErrors){
        ret = true;
        console.log('---isSpecifying---');
      }else{
        this.outputNeurons.forEach(n=>{
          n.preB = n.b;
          n.preWs = n.ws.concat();
        })
      }
      this.lastValidationErrors = currentErros;
    }
    return ret;
  }

  //! always unregister from the emitter
  private static emitter$ = ANN.initEventEmitter();
  private static initEventEmitter(){
    const e$ = new EventEmitter({ captureRejections: true });
    e$.on('error',(error)=>{
      logger.error('Entity.emitter$ onError()');
      logger.error(error.stack);
    })
    return e$;
  }
}

export interface AnnParams{
  type: AnnType;
  nInputs: number; 
  nOutputs: number; 
  initWeightsMode: InitWeightsMode;
  learningRate: number;
  theta?: number;
  setsLength: SetsLength
}

export type AnnType = 'Perceptron' | 'Adaline' | 'Sigmoid Perceptron';

export interface TestResult{
  erros: number,
  notLearned: {
    id:(string|number)
    fOuts: number[];
    outs: number[];
  }[]
}

export interface SetsLength{
  train: number
  test: number
  validation: number
}