import { Neuron } from "./neuron";

export class StepNeuron extends Neuron  {

  public theta: number = 0
  
  constructor(params: StepNeuronInit)
  { 
    super(params)
  }
  
  ///activation function
  protected f(){
    // console.log('theta ', this.theta)
    if(this.in > this.theta){
      return 1;
    }
    else if(this.in < -this.theta){
      return -1;
    }
    else{
      return 0;
    }
  }

  limitedOut(){
    return this.fOut;
  }

  trainFac(t:number){
    return t;
  } 

}

export interface StepNeuronInit{
  nInputs: number, 
  theta: number
}