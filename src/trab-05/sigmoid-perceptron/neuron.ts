import { Neuron } from "../base/neuron";

export class SigmoidNeuron extends Neuron  {

  public sigma: number = 1
  
  constructor(params: SigmoidNeuronInit)
  { 
    super(params)
  }
  
  ///activation function
  protected f(){
    // console.log('theta ', this.theta)
    // return 1/(1+Math.exp(-this.sigma*this.in));
    return 2/(1+Math.exp(-this.sigma*this.in)) - 1;
  }

  limitedOut(){
    // return this.fOut > 0.5 ? 1 : 0;
    return this.fOut > 0 ? 1 : -1;
  }

  trainFac(t:number){
    // const outDerivative = this.out *(1-this.out)
    const outDerivative = (this.sigma/2) *(1+this.fOut)*(1-this.fOut)
    return (t-this.fOut)*outDerivative;
  } 

}

export interface SigmoidNeuronInit{
  nInputs: number, 
  sigma: number
}