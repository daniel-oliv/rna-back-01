import { getActFun, ActivationFunction, ActivationFunctionName } from "./activation-funs";
import { Neuron, NeuronInit } from "./neuron";

export class MlOutNeuron extends Neuron implements MlOutNeuronInit{
  constructor(params: MlOutNeuronInit)
  { 
    super(params)
  }

  setInNeurons(inNeurons:Neuron[]){
    console.log('inNeurons ', inNeurons);
    this.inNeurons = inNeurons;
  }

  setInAndOut(){
    this.in = this.calcIn(this.inNeurons.map(d=>d.fOut));
    this.fOut = this.f(this.in);
    this.limOut = this.limitedOut()
  }

  limitedOut(){
    return this.fOut > 0 ? 1 : -1;
  }

  setΔws(){
    
  }

  updateWs(t:number): number[]{
    //! ATENÇÃO: SÓ FIZ df(in) PQ NA FUNÇÃO SIGMOID a f' DEPENDE DA f(in)
    const dfIn = this.df(this.fOut)
    this.δ = (t-this.fOut)*dfIn;
    const dw = this.inNeurons.map((n)=>{ 
      // console.log('this.α ', this.α);
      return this.α*this.δ*n.fOut
    });
    const db = this.α*this.δ;
    this.ws = this.ws.map((w,i)=>w+dw[i]);
    this.b=this.b+db;
    return [db].concat(dw)
  }
  
} 

export interface MlOutNeuronInit extends NeuronInit{
  // inNeurons: Neuron[]
}