import { printMatrix } from "../../utils/binary";
import { Neuron } from "../base/neuron";
import { Datum } from "../Datum";
import { ANN, AnnParams } from "../base/ann";

export class Perceptron extends ANN{
  //Parameters
  nInputs: number; 
  nOutputs: number; 
  learningRate: number;
  theta: number;
  
  ///Layers and Architecture
  outputNeurons: Neuron[];
  
  /// output
  epoch: number;
  notLearned: number;
  dwAbsMax: number;
  squareError: number;  

  constructor(params:PerceptronParams
    ){
    super(params)
    //! override if needed another neurons
    this.initNeurons();
  }

  eachEpoch(){
    //!PERCEPTRON
    this.outputNeurons.forEach(n=>n.wChanged=false)
    //! ADALINE
    this.squareError = 0
    this.dwAbsMax = 0;
  }

  stop(): boolean{
    //!PERCEPTRON
    return !this.outputNeurons.some(n=>n.wChanged)
  }

  protected trainDatum(datum:Datum){
    //!PERCEPTRON TRAINING -> CHANGE JUST IF THE OUTPUT IS DIFFERENT
    /// calc out
    const outs = this.calcOuts(datum);
    for (let i = 0; i < this.outputNeurons.length; i++) {
      const t = datum.targetVector[i];
      const neuron = this.outputNeurons[i];
      const out = outs[i];
      const netIn = neuron.in;
      //! FOR EVERY OUTPUT NEURON if output is wrong, calc deltaW (dw) and db
      this.squareError += (t-out)**2;
      // console.log('netIn ', netIn);
      if(out!==t){
        const dw = datum.inVector.map((x)=>t*x*this.learningRate);
        const db = t;
        /// se de fato algum delta for diferente de zero, ou seja, se os pesos realmente mudaram
        if(dw.some(d=>d!==0) || db!==0){
          neuron.b += db; 
          neuron.ws = neuron.ws.map((preW, i)=>
            preW+dw[i]
          )
          /// if some dW !=0 set wChanged
          neuron.wChanged = true;
        }
        this.notLearned++;
        const absV = dw.concat(db).map(d=>Math.abs(d))
        const maxDelta = Math.max(...absV)
        if(maxDelta > this.dwAbsMax){
          this.dwAbsMax = maxDelta
        }
      }
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

export interface PerceptronParams extends AnnParams{

}

export interface Result{
  erros: number,
  notLearned: {
    id:(string|number)
    outs: number[];
  }[]
}