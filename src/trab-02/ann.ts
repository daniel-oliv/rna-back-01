import { printMatrix } from "../utils/binary";
import { Neuron } from "./neuron";
import { Datum } from "./Datum";

export class ANN{
  outputNeurons: Neuron[];
  learningRate: number;

  constructor(public nInputs: number, nOutputs: number, learningRate: number = 1, theta?: number){
    this.outputNeurons = Array(nOutputs);
    for (let i = 0; i < nOutputs; i++) {
      this.outputNeurons[i] = new Neuron(nInputs,theta);
    }
    this.learningRate = learningRate;
  }

  async train(data: Datum[]){
    //! resetting neurons weights
    this.outputNeurons.forEach(n=>n.resetWeights())
    
    let epoch = 0;
    do {
      epoch++;
      console.log('------------Epoch--------------', epoch);
      //!PERCEPTRON - set wChanged to false for every epoch
      this.outputNeurons.forEach(n=>n.wChanged=false)
      this.trainEpoch(data)

    } while (this.outputNeurons.some(n=>n.wChanged));
    return true;
  }

  private trainEpoch(data: Datum[]){
    for (const datum of data) {
      this.trainDatum(datum)    
    }

    //?debug
    console.log('\n---Final weights---')
    this.outputNeurons.forEach((n, i)=>{
      console.log('Neuron ', i)
      console.log('w = ', n.ws)
      console.log('b = ', n.b)
    })
  }

  private trainDatum(datum:Datum){
    //!PERCEPTRON TRAINING -> CHANGE JUST IF THE OUTPUT IS DIFFERENT
    /// calc out
    const outs = this.calcOuts(datum);
    for (let i = 0; i < this.outputNeurons.length; i++) {
      const t = datum.targetVector[i];
      const neuron = this.outputNeurons[i];
      const out = outs[i];
      //! FOR EVERY OUTPUT NEURON if output is wrong, calc deltaW (dw) and db
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
      }
    }
  }

  private calcOuts(datum: Datum): number[]{
    const outs = [];
    for (const neuron of this.outputNeurons) {
      outs.push(neuron.out(datum.inVector));
    }
    return outs;
  }

  testDataset(data: Datum[]): Result{
    const res: Result = {erros: 0, notLearned: []}
    for (const datum of data) {
      if(!this.testDatum(datum)){
        ++res.erros;
        res.notLearned.push(datum.id);
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
}

export interface Result{
  erros: number,
  notLearned: (string|number)[]
}