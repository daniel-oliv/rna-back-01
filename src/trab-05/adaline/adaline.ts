import { printMatrix } from "../../utils/binary";
import { StepNeuron } from "../base/step-neuron";
import { Datum } from "../Datum";
import { ANN, AnnParams } from "../base/ann";

export class Adaline extends ANN{
  //Parameters
  nInputs: number; 
  nOutputs: number; 
  learningRate: number;
  theta: number;
  maxEpoch;
  dwAbsMin;
  
  ///Layers and Architecture
  outputNeurons: StepNeuron[];
  
  /// output
  epoch: number;
  notLearned: number;
  dwAbsMax: number;
  squareError: number;  

  constructor(params:AdalineParams
    ){
    super(params)
    //! override if needed another neurons
    this.initNeurons();
  }

  eachEpoch(){
    //! ADALINE
    this.squareError = 0
    this.dwAbsMax = 0;
  }

  stop(): boolean{
    return this.epoch >= this.maxEpoch || 
      this.dwAbsMax < this.dwAbsMin
  }

  protected trainDatum(datum:Datum){
    //!ADALINE TRAINING -> CHANGE ACCORDING WITH Y_IN - NET INPUT
    /// calc out
    const outs = this.calcOuts(datum);
    for (let i = 0; i < this.outputNeurons.length; i++) {
      const t = datum.targetVector[i];
      const neuron = this.outputNeurons[i];
      const out = outs[i];
      const netIn = neuron.in;
      //! FOR EVERY OUTPUT NEURON
      if(out!==t){
        this.notLearned++;
      }
        this.squareError += (t-netIn)**2;
        // console.log('netIn ', netIn);
        const dw = datum.inVector.map((x)=>(t-netIn)*x*this.learningRate);
        const db = (t-netIn)*this.learningRate;
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
    return {
      epoch: this.epoch, 
      notLearned: this.notLearned, 
      dwAbsMax: this.dwAbsMax,
      squareError: this.squareError
    }
  }  
}

export interface AdalineParams extends AnnParams{
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