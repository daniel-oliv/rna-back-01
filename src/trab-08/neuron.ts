import { TargetLessDatum } from "./target-less-datum";

export class Neuron implements NeuronInit{

  public nInputs: number
  public a: number;
  public k: number;

  public ws: number[];

  constructor(params: NeuronInit)
  { 
    Object.assign(this,params)
  }

  getDist(x: number[]){
    const dist = x.reduce((a,xi, i)=>a+(this.ws[i]-xi)**2, 0);
    return dist;
  }

  updateWs(x: number[]){
    this.ws  = this.ws.map((w,i)=>w+this.a*(x[i]-w))
  }

  updateLearning(){
    /// artimética
    this.a -= 0.0049;
  }

  resetWeights(mode:InitWeightsModeParams){
    console.log('resetWeights mode', mode);
    switch (mode.name) {
      case 'zeros':
        this.ws = Array(this.nInputs).fill(0);
        break;
      case 'random':
        const wLimit = (<InitWeightsRandom>mode).wLimit
        this.ws = [...Array(this.nInputs)].map(() => (Math.random() * wLimit));
        break;
      case 'continue':
        // TODO - pega os pesos em método genérico
          // const ws = (<InitWeightsRandom>mode).wLimit
          // this.ws = [...Array(this.nInputs)].map(() => (Math.random() * wLimit));
          // this.b=0;
          break;
      default:
        console.log('resetWeights() Invalid mode ', mode);
        break;
    }
    
  }
}

export interface InitWeightsModeParams{
  name: 'zeros' | 'random'|'continue',
} 

export interface InitWeightsRandom extends InitWeightsModeParams{
  name: 'random',
  wLimit: number;
} 

export interface NeuronInit{
  nInputs: number,
  a: number;
  k: number; // taxa de degradação de a
}