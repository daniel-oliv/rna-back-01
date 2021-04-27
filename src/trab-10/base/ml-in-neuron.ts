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

  calcDerivIn(){
    const δin = this.outNeurons.reduce((a,n,i)=> a+ n.δ * n.ws[this.oIdxs[i]], 0)
    //! ATENÇÃO: SÓ FIZ derivada(f(in))=derivada(fout) PQ NA FUNÇÃO SIGMOID a f' DEPENDE DA f(in)=fout
    const dfIn = this.df(this.fOut)
    this.δ = δin*dfIn;
  }

  setΔws(){
    this.calcDerivIn()
    this.Δws = this.inputs.map((x)=> this.α * this.δ * x);
    this.Δb = this.α*this.δ;

    // return [this.Δb].concat(this.Δws)
  }

  sumΔws(){
    this.calcDerivIn()    
    this.Δws = this.inputs.map((x,i)=> this.Δws[i] + this.α * this.δ * x);
    this.Δb += this.α*this.δ;
    // return [this.Δb].concat(this.Δws)
  }

  updateWs(){
    this.ws = this.ws.map((w,i)=>w+this.Δws[i]);
    this.b=this.b+this.Δb;
    return [this.Δb].concat(this.Δws);
  }
} 

export interface MlInNeuronInit extends NeuronInit{
  // outNeurons: Neuron[]
}