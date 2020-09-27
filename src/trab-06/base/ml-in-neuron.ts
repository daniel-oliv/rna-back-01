import { InNeuron } from "./in-neuron";
import { NeuronInit, Neuron } from "./neuron";

export class MlInNeuron extends Neuron implements MlInNeuronInit{
  inputs: number[];
  outNeurons: Neuron[];
  // indexes in the output arrays;
  oIdxs: number[];
  constructor(params: MlInNeuronInit)
  { 
    super(params)
  }

  //called after setInputNeurosn 
  setOutNeurons(outNeurons:Neuron[]){
    this.outNeurons = outNeurons;
    this.oIdxs = outNeurons.map(n=>n.inNeurons.indexOf(this))
  }

  setInAndOut(inputs: number[]){
    this.inputs = inputs;
    this.in = this.calcIn(inputs);
    this.fOut = this.f(this.in);
    // console.log('fOut ', this.fOut);
    this.limOut = this.limitedOut()
  }

  limitedOut(){
    return this.fOut > 0 ? 1 : -1;
  }

  updateWs(): number[]{
    const δin = this.outNeurons.reduce((a,n,i)=> a+ n.δ * n.ws[this.oIdxs[i]], 0)
    //! ATENÇÃO: SÓ FIZ df(in) PQ NA FUNÇÃO SIGMOID a f' DEPENDE DA f(in)
    const dfIn = this.df(this.fOut)
    this.δ = δin*dfIn;
    const dw = this.inputs.map((x)=> this.α * this.δ * x);
    const db = this.α*this.δ;
    this.ws = this.ws.map((w,i)=>w+dw[i]);
    this.b=this.b+db;
    return [db].concat(dw)
  }
} 

export interface MlInNeuronInit extends NeuronInit{
  // outNeurons: Neuron[]
}