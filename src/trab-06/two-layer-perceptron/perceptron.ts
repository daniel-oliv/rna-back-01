import { Datum } from "../datasets/Datum";
import { ANN, AnnParams } from "../base/ann";
import { MlOutNeuron } from "../base/ml-out-neuron";
import { MlInNeuron } from "../base/ml-in-neuron";

/**
 * @class
 * Two layer perceptron
 */
export class TLP extends ANN implements TLP_Params{
  //Parameters
  type: 'Two Layer Perceptron';
  nInputs: number; 
  nOutputs: number; 
  learningRate: number;
  outSigma: number;
  hiddenSigma: number;
  numHiddenNeurons: number;
  maxEpoch;
  dwAbsMin;
  
  ///Layers and Architecture
  outputNeurons: MlOutNeuron[];
  hiddenLayer: MlInNeuron[];
  
  /// output
  epoch: number;
  notLearned: number;
  dwAbsMax: number;
  squareError: number;  

  constructor(params:TLP_Params
    ){
    super(params)
    //! override if needed another neurons
    this.initNeurons();
  }
  initNeurons(){
    this.outputNeurons = Array(this.nOutputs);
    this.hiddenLayer = Array(this.numHiddenNeurons);
    for (let i = 0; i < this.nOutputs; i++) {
      this.outputNeurons[i] = new MlOutNeuron({
        /// prestar atenção no número de saída da última camada escondida, que será o número de inputs da camada de saída caso todos estejam ligados em todos
        nInputs: this.numHiddenNeurons,
        actFunName: 'Bipolar Sigmoid',
        α: this.learningRate,
        sigma: this.outSigma
      });
      this.outputNeurons[i].setInNeurons(this.hiddenLayer);
    }
    for (let i = 0; i < this.numHiddenNeurons; i++) {
      this.hiddenLayer[i] = new MlInNeuron({
        nInputs: this.nInputs,
        actFunName: 'Bipolar Sigmoid',
        α: this.learningRate,
        sigma: this.hiddenSigma
      });
      this.hiddenLayer[i].setOutNeurons(this.outputNeurons);
    }

    //! RESETTING WEIGHTS
    this.outputNeurons.forEach(n=>n.resetWeights(this.initWeightsMode));
    this.hiddenLayer.forEach(n=>n.resetWeights(this.initWeightsMode));
  }

  protected onStartTrain(){
    
  }

  eachEpoch(){
    //! ADALINE
    this.squareError = 0
    this.dwAbsMax = 0;
  }

  protected onTrainEnd(){
    console.log('\n---hiddenLayer---')
    this.printWs(this.hiddenLayer)
  }

  protected updatePreWs(){
    this.outputNeurons.forEach(n=>{
      n.preB = n.b;
      n.preWs = n.ws.concat();
    })
    this.hiddenLayer.forEach(n=>{
      n.preB = n.b;
      n.preWs = n.ws.concat();
    })
  }
  protected retrieveWs(){
    this.outputNeurons.forEach(n=>{
      n.b = n.preB;
      n.ws = n.preWs.concat();
    })
    this.hiddenLayer.forEach(n=>{
      n.b = n.preB;
      n.ws = n.preWs.concat();
    })
  }

  stop(): boolean{
    return this.maxEpoch && (this.epoch >= this.maxEpoch) || 
      this.epoch > 3 && this.dwAbsMax < this.dwAbsMin ||
      this.isSpecifying()
  }

  protected calcLimOuts(datum: Datum): number[]{
    const outs: number[] = [];
    for (const neuron of this.hiddenLayer) {
      neuron.setInAndOut(datum.inVector)
    }
    for (const neuron of this.outputNeurons) {
      neuron.setInAndOut()
      outs.push(neuron.limOut);
    }
    return outs;
  }

  protected updateWs(targetVector: number[]): number[]{
    const dws: number[] = [];
    for (let i = 0; i < this.outputNeurons.length; i++) {
      const neuron = this.outputNeurons[i]
      dws.push(...neuron.setΔws(targetVector[i]));
    }
    for (const neuron of this.hiddenLayer) {
      dws.push(...neuron.updateWs());
    }
    for (const neuron of this.outputNeurons) {
      neuron.updateWs()
    }
    
    return dws;
  }

  protected trainDatum(datum:Datum){
    //!MLP TRAINING -> CHANGE ACCORDING WITH Y_IN - NET INPUT
    /// calc out
    const outs = this.calcLimOuts(datum);
    
    const dws = this.updateWs(datum.targetVector);
    const absV = dws.map(dw=>Math.abs(dw));
    const maxDelta = Math.max(...absV)

    if(maxDelta > this.dwAbsMax){
      this.dwAbsMax = maxDelta
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

export interface TLP_Params extends AnnParams{
  type: 'Two Layer Perceptron';
  outSigma; // = 1
  hiddenSigma; // = 1
  numHiddenNeurons: number;
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