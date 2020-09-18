import { SigmoidNeuron } from "./neuron";
import { Datum } from "../Datum";
import { ANN, AnnParams } from "../base/ann";

export class SigmoidPerceptron extends ANN{
  //Parameters
  nInputs: number; 
  nOutputs: number; 
  learningRate: number;
  sigma: number;
  maxEpoch;
  dwAbsMin;
  
  ///Layers and Architecture
  outputNeurons: SigmoidNeuron[];
  
  /// output
  epoch: number;
  notLearned: number;
  dwAbsMax: number;
  squareError: number;  

  constructor(params:SigmoidPerceptronParams
    ){
    super(params)
    //! override if needed another neurons
    this.initNeurons();
  }
  initNeurons(){
    for (let i = 0; i < this.nOutputs; i++) {
      this.outputNeurons[i] = new SigmoidNeuron({
          nInputs: this.nInputs,
          sigma: this.sigma
      });
    }
  }

  eachEpoch(){
    //! ADALINE
    this.squareError = 0
    this.dwAbsMax = 0;
  }

  stop(): boolean{
    return this.maxEpoch && (this.epoch >= this.maxEpoch) || 
      this.dwAbsMax < this.dwAbsMin ||
      this.isSpecifying()
  }

  protected trainDatum(datum:Datum){
    //!ADALINE TRAINING -> CHANGE ACCORDING WITH Y_IN - NET INPUT
    /// calc out
    const outs = this.calcOuts(datum);
    for (let i = 0; i < this.outputNeurons.length; i++) {
      const t = datum.targetVector[i];
      const neuron = this.outputNeurons[i];
      const out = outs[i];
      const inNeuron = neuron.in;
      const trainFac = neuron.trainFac(t);
      // console.log('trainFac ', trainFac);
      //! FOR EVERY OUTPUT NEURON
      this.squareError += (t-neuron.fOut)**2;
      if(out!==t){
        this.notLearned++;
      }
        // console.log('netIn ', netIn);
        const dw = datum.inVector.map((x)=> this.learningRate*x*trainFac );
        const db = this.learningRate*trainFac;
        /// se de fato algum delta for diferente de zero, ou seja, se os pesos realmente mudaram
        neuron.b += db; 
        neuron.ws = neuron.ws.map((preW, i)=>
          preW+dw[i]
        )
        const absV = dw.concat(db).map(d=>Math.abs(d))
        const maxDelta = Math.max(...absV)
        if(maxDelta > this.dwAbsMax){
          this.dwAbsMax = maxDelta
        }
      //}
    }
  }

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

export interface SigmoidPerceptronParams extends AnnParams{
  type: 'Sigmoid Perceptron'
  sigma; // = 1
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