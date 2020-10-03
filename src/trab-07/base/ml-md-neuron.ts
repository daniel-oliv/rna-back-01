import { NeuronInit, Neuron } from "./neuron";

/**
 * Middle neuron - do not receive inputs directly and do not emits actual outputs
 */
export class MlMdNeuron extends Neuron implements MlMdNeuronInit{
  inputs: number[];
  outNeurons: Neuron[];
  // indexes in the output arrays;
  oIdxs: number[];
  constructor(params: MlMdNeuronInit)
  { 
    super(params)
  }

  setInNeurons(inNeurons:Neuron[]){
    // console.log('inNeurons ', inNeurons);
    this.inNeurons = inNeurons;
  }

  //called after setInputNeurosn 
  setOutNeurons(outNeurons:Neuron[]){
    this.outNeurons = outNeurons;
    this.oIdxs = outNeurons.map(n=>n.inNeurons.indexOf(this))
  }

  setInAndOut(){
    this.in = this.calcIn(this.inNeurons.map(d=>d.fOut));
    this.fOut = this.f(this.in);
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
    this.Δws = this.inNeurons.map((n)=>{ 
      // console.log('this.α ', this.α);
      return this.α*this.δ*n.fOut
    });
    this.Δb = this.α*this.δ;

    return [this.Δb].concat(this.Δws)
  }

  sumΔws(){
    this.calcDerivIn()
    this.Δws = this.inNeurons.map((n, i)=>{ 
      // console.log('this.α ', this.α);
      return this.Δws[i]+this.α*this.δ*n.fOut
    });
    this.Δb += this.α*this.δ;

    // return [this.Δb].concat(this.Δws)
  }

  updateWs(){
    this.ws = this.ws.map((w,i)=>w+this.Δws[i]);
    this.b=this.b+this.Δb;
    return [this.Δb].concat(this.Δws);
  }
} 

export interface MlMdNeuronInit extends NeuronInit{
  // outNeurons: Neuron[]
}