import * as logger from 'winston'
import { EventEmitter } from 'events';

import { printMatrix } from "../../utils/binary";
import { Datum } from "../datasets/Datum";
import { sleep } from '../../utils/common';
import { Neuron } from './neuron';
import { InitWeightsModeParams, InitWeightsRandom } from './neuron';
import { StopCondition } from '../stop-condition';
import { shuffle } from 'lodash';


export abstract class  ANN{
  //Parameters
  nInputs: number; 
  nOutputs: number;
  initWeightsMode;
  learningRate: number = 0.001;
  theta: number = 0;
  lenBatch: number;
  
  ///Layers and Architecture
  outputNeurons: Neuron[];
  
  /// scores
  epoch: number;
  notLearned: number;
  dwAbsMax: number;
  squareError: number;  

  /// data
  validationSet: Datum[]
  lastValidationErrors: number;
  setsLength: SetsLength

  // temp/algorithm variables
  isMoreSpecific: boolean;
  iBatch: number;

  constructor(params: AnnParams){
    Object.assign(this, params)
    this.outputNeurons = Array(this.nOutputs);
    // console.log('ANN theta ', theta);
  }

  protected abstract initNeurons()
  protected abstract onStartTrain()
  protected eachEpoch(){
    this.squareError = 0;
    this.dwAbsMax = 0;
    this.iBatch = 0;
  }
  protected abstract onTrainEnd()
  protected abstract stopConditions: StopCondition[]
  protected abstract updatePreWs()
  protected abstract retrieveWs()


  stop(): boolean{
    for (const condition of this.stopConditions) {
      if(condition.stop()){
        logger.info(`[two-layer-perceptron/perceptron,109] stop condition: ${condition.desc}`)
        return true;
      }
    } 
    return false;
  }

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
    this.isMoreSpecific = false;
    res['train'] = await this.train(trainSet, listener);

    res['test'] = this.testDataset(testSet);
    return res;
  }
  /// validação cruzada k-fold
  public async trainCrossValidation(dataset: Datum[], setsLen:SetsLength, listener: (...args: any[]) => void){
    const res = {training:[], test:{}}
    this.setsLength = setsLen;
    const trainLen = setsLen.train;
    const validationLen = setsLen.validation;
    const totalTrainSet = dataset.slice(0,trainLen) 
    const testSet = dataset.slice(trainLen) 
    
    let validationStart = 0;
    let validationEnd = validationStart+validationLen;
    let trainSet: Datum[] = [];
    while(validationStart < trainLen){
      console.log('validationStart ', validationStart);
      console.log('trainLen ', trainLen);
      this.validationSet = dataset.slice(validationStart, validationEnd)
      trainSet = totalTrainSet.slice(0,validationStart).concat(totalTrainSet.slice(validationEnd))
      this.lastValidationErrors = this.validationSet.length;
      this.isMoreSpecific = false;
      res.training.push(await this.train(trainSet, listener));
      validationStart=validationEnd;
      validationEnd +=validationLen;
    }
    
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
    this.onStartTrain()
    do {
      this.notLearned = 0
      this.epoch++;
      logger.verbose('------------Epoch-------------- '+ this.epoch);
      this.eachEpoch();
      this.trainEpoch(data)
      ANN.emitter$.emit('train',this.trainResult())
      await sleep(25);
    } while (!this.stop());

    ANN.emitter$.removeListener('train',listener)

    //?debug
    console.log('\n---Final weights---')
    console.log('\n---outputNeurons---')
    this.printWs(this.outputNeurons)
    
    this.onTrainEnd()

    return this.trainResult();
  }

  printWs(layer: Neuron[]){
    layer.forEach((n, i)=>{
      logger.info('Neuron ', i)
      logger.info('w = ', n.ws)
      logger.info('b = ', n.b)
    })

    if(this.isMoreSpecific){
      logger.info('\n---Previous and recommended weights---')
      layer.forEach((n, i)=>{
        logger.info('Neuron ', i)
        logger.info('w = ', n.preWs)
        logger.info('b = ', n.preB)
      })
    }
  }

  wsFile = './logs/ws.json'
  protected writeFileWs(){

  }

  protected readFileWs(){
    
  }

  protected trainEpoch(data: Datum[]){
    // let time: string;
    console.time('trainEpoch');
    data = shuffle(data);
    for (const datum of data) {
      // console.time('batch');
      this.trainDatum(datum);
      // console.timeEnd('batch');  
    }
    console.timeEnd('trainEpoch');  
  }

  protected calcLimOuts(datum: Datum): number[]{
    const outs: number[] = [];
    for (const neuron of this.outputNeurons) {
      neuron.setInAndOut(datum.inVector)
      outs.push(neuron.limOut);
    }
    return outs;
  }

  testDataset(data: Datum[]): TestResult{
    const res: TestResult = {erros: 0, errosPer:0, notLearned: []}
    for (const datum of data) {
      if(!this.testDatum(datum)){
        ++res.erros;
        res.notLearned.push({
          id:datum.id, 
          fOuts: this.outputNeurons.map(d=>d.fOut),
          outs: this.calcLimOuts(datum)
        });
      }
    }
    res.errosPer = res.erros/this.setsLength.test
    // console.log('this.setsLength.test ', this.setsLength.test);
    return res;
  }

  testDatum(datum: Datum, outs?: number[]){
    if(!outs) outs = this.calcLimOuts(datum);
    const fOuts = this.outputNeurons.map(d=>d.fOut)
    // console.log('testDatum() outs ', outs);
    // if(datum.targetVector.some((t,i)=> t !== outs[i])){
    if(datum.targetVector.length > 1  && datum.targetVector.indexOf(1)!==fOuts.indexOf(Math.max(...fOuts))
      || datum.targetVector.some((t,i)=> t !== outs[i])
    ){
      return false;
    }
    return true;
  }

  isSpecifying: StopCondition=
  {
    desc:'Especificou. Erros no conjunto de validação aumentaram',
    stop: ()=>{
      this.isMoreSpecific = false;
      if(this.validationSet && this.epoch%30===0){
        const res = this.testDataset(this.validationSet)
        const currentErros = res.erros;
        if(this.epoch>1 && currentErros > this.lastValidationErrors){
          this.isMoreSpecific = true;
          console.log('---isSpecifying---');
          this.retrieveWs()
        }else{
          this.updatePreWs()
        }
        this.lastValidationErrors = currentErros;
      }
      return this.isMoreSpecific;
    }
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
  initWeightsMode: InitWeightsModeParams | InitWeightsRandom;
  learningRate: number;
  theta?: number;
  lenBatch: number;
  setsLength?: SetsLength
}

export type AnnType = 'Perceptron' | 'Adaline' | 'Sigmoid Perceptron'|'Two Layer Perceptron';

export interface TestResult{
  erros: number,
  errosPer?: number;
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