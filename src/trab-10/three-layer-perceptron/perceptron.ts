import * as logger from 'winston'

import { Datum } from "../datasets/Datum";
import {byEpoch, lowΔw} from "../stop-condition"
import { ANN, AnnParams } from "../base/ann";
import { MlOutNeuron } from "../base/ml-out-neuron";
import { MlInNeuron } from "../base/ml-in-neuron";
import { loggers } from "winston";
import { MlMdNeuron } from '../base/ml-md-neuron';
/**
 * @class
 * Three layer perceptron
 */
export class ThreeLP extends ANN implements ThreeLP_Params{
  //Parameters
  type: 'Three Layer Perceptron';
  nInputs: number; 
  nOutputs: number; 
  learningRate: number;
  outSigma: number;
  hiddenSigma: number;
  numHiddenNeurons: number[];
  maxEpoch;
  dwAbsMin;
  
  ///Layers and Architecture
  outputNeurons: MlOutNeuron[];
  ftHiddenLayer: MlInNeuron[];
  mdHiddenLayer: MlMdNeuron[];
  

  constructor(params:ThreeLP_Params
    ){
    super(params)
    //! override if needed another neurons
    this.initNeurons();
  }
  initNeurons(){
    this.outputNeurons = Array(this.nOutputs);
    this.ftHiddenLayer = Array<MlInNeuron>(this.numHiddenNeurons[0]);
    this.mdHiddenLayer = Array<MlMdNeuron>(this.numHiddenNeurons[1]);
    for (let i = 0; i < this.nOutputs; i++) {
      this.outputNeurons[i] = new MlOutNeuron({
        /// prestar atenção no número de saída da última camada escondida, que será o número de inputs da camada de saída caso todos estejam ligados em todos
        nInputs: this.numHiddenNeurons[1],
        actFunName: 'Bipolar Sigmoid',
        α: this.learningRate,
        sigma: this.outSigma
      });
      this.outputNeurons[i].setInNeurons(this.mdHiddenLayer);
    }
    for (let i = 0; i < this.numHiddenNeurons[1]; i++) {
      this.mdHiddenLayer[i] = new MlMdNeuron({
        nInputs: this.numHiddenNeurons[0],
        actFunName: 'Bipolar Sigmoid',
        α: this.learningRate,
        sigma: this.hiddenSigma
      });
      this.mdHiddenLayer[i].setOutNeurons(this.outputNeurons);
      this.mdHiddenLayer[i].setInNeurons(this.ftHiddenLayer);
    }
    for (let i = 0; i < this.numHiddenNeurons[0]; i++) {
      this.ftHiddenLayer[i] = new MlInNeuron({
        nInputs: this.nInputs,
        actFunName: 'Bipolar Sigmoid',
        α: this.learningRate,
        sigma: this.hiddenSigma
      });
      this.ftHiddenLayer[i].setOutNeurons(this.mdHiddenLayer);
    }
    

    //! RESETTING WEIGHTS
    this.outputNeurons.forEach(n=>n.resetWeights(this.initWeightsMode));
    this.ftHiddenLayer.forEach(n=>n.resetWeights(this.initWeightsMode));
    this.mdHiddenLayer.forEach(n=>n.resetWeights(this.initWeightsMode));
  }

  protected onStartTrain(){
    
  }

  eachEpoch(){
    super.eachEpoch();
  }

  protected onTrainEnd(){
    console.log('\n---mdHiddenLayer---')
    this.printWs(this.mdHiddenLayer)
    console.log('\n---ftHiddenLayer---')
    this.printWs(this.ftHiddenLayer)
  }

  protected updatePreWs(){
    this.outputNeurons.forEach(n=>{
      n.preB = n.b;
      n.preWs = n.ws.concat();
    })
    this.ftHiddenLayer.forEach(n=>{
      n.preB = n.b;
      n.preWs = n.ws.concat();
    })
    this.mdHiddenLayer.forEach(n=>{
      n.preB = n.b;
      n.preWs = n.ws.concat();
    })
  }
  protected retrieveWs(){
    this.outputNeurons.forEach(n=>{
      n.b = n.preB;
      n.ws = n.preWs.concat();
    })
    this.ftHiddenLayer.forEach(n=>{
      n.b = n.preB;
      n.ws = n.preWs.concat();
    })
    this.mdHiddenLayer.forEach(n=>{
      n.b = n.preB;
      n.ws = n.preWs.concat();
    })
  }

  stopConditions = [byEpoch, lowΔw, this.isSpecifying]

  protected calcLimOuts(datum: Datum): number[]{
    const outs: number[] = [];
    for (const neuron of this.ftHiddenLayer) {
      neuron.setInAndOut(datum.inVector)
    }
    for (const neuron of this.mdHiddenLayer) {
      neuron.setInAndOut()
    }
    for (const neuron of this.outputNeurons) {
      neuron.setInAndOut()
      outs.push(neuron.limOut);
    }
    return outs;
  }

  protected setDWs(targetVector: number[]){
    for (let i = 0; i < this.outputNeurons.length; i++) {
      const neuron = this.outputNeurons[i]
      neuron.setΔws(targetVector[i]);
    }
    for (const neuron of this.mdHiddenLayer) {
      neuron.setΔws();
    }
    for (const neuron of this.ftHiddenLayer) {
      neuron.setΔws();
    }
  }

  protected addDWs(targetVector: number[]): number[]{
    const dws: number[] = [];
    for (let i = 0; i < this.outputNeurons.length; i++) {
      const neuron = this.outputNeurons[i]
      neuron.sumΔws(targetVector[i]);
    }
    for (const neuron of this.mdHiddenLayer) {
      neuron.sumΔws();
    }
    for (const neuron of this.ftHiddenLayer) {
      neuron.sumΔws();
    }
    
    return dws;
  }

  protected updateWs(): number[]{
    const dws: number[] = [];
    for (let i = 0; i < this.outputNeurons.length; i++) {
      const neuron = this.outputNeurons[i]
      dws.push(...neuron.updateWs());
    }
    for (const neuron of this.mdHiddenLayer) {
      dws.push(...neuron.updateWs());
    }
    for (const neuron of this.ftHiddenLayer) {
      dws.push(...neuron.updateWs());
    }
    
    return dws;
  }

  protected trainDatum(datum:Datum){
    //!MLP TRAINING -> CHANGE ACCORDING WITH Y_IN - NET INPUT
    /// calc out
    const outs = this.calcLimOuts(datum);
    if(this.iBatch === 0 && this.iBatch !== this.lenBatch){
      /// setΔWs
      // console.log('setΔWs ');
      this.setDWs(datum.targetVector);
      this.iBatch++;
    } else {
      /// addΔWs
      // console.log('addΔWs ');
      this.addDWs(datum.targetVector);
      this.iBatch++;
      if(this.iBatch === this.lenBatch){
        // console.log('updateWs ');
        this.iBatch = 0;
        ///updateΔWs 
        const dws = this.updateWs();
        const absV = dws.map(dw=>Math.abs(dw));
        const maxDelta = Math.max(...absV)

        if(maxDelta > this.dwAbsMax){
          this.dwAbsMax = maxDelta
        }
      }
    }
    for (let i = 0; i < this.outputNeurons.length; i++) {
      const t = datum.targetVector[i];
      const neuron = this.outputNeurons[i];
      //! FOR EVERY OUTPUT NEURON
      this.squareError += (t-neuron.fOut)**2;
    }

    if(!this.testDatum(datum)){
      this.notLearned++;
    }
  }

  protected 

  trainResult(){
    const ret = {
      epoch: this.epoch, 
      notLearned: this.notLearned, 
      notLearnedPer: this.notLearned/this.setsLength.train,
      dwAbsMax: this.dwAbsMax,
      squareError: this.squareError,
    }
    if(this.lastValidationErrors){
      ret['lastValidationErrors']=this.lastValidationErrors
      ret['lastValidationErrorsPer']=this.lastValidationErrors/this.setsLength.validation
    }
    return ret;
  }  
}

export interface ThreeLP_Params extends AnnParams{
  type: 'Three Layer Perceptron';
  outSigma; // = 1
  hiddenSigma; // = 1
  numHiddenNeurons: number[];
  maxEpoch: number;
  dwAbsMin: number;
}

export interface Result{
  erros: number,
  notLearned: {
    id:(string|number)
    outs: number[];
  }[]
}