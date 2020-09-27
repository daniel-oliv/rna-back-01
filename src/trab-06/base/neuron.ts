import { ActivationFunction, ActivationFunctionName, getActFun } from "./activation-funs";

export abstract class Neuron{

  public nInputs: number
  inNeurons?: Neuron[];
  
  public ws: number[];
  public b: number;
  public Δws: number[];
  public Δb: number;

  /// APÓS A ÚLTIMA VALIDAÇÃO BEM SUCEDIDA
  public preWs: number[];
  public preB: number;
  
  public in: number;
  public fOut: number;

  /// saída quantizada
  public limOut: number;

  actFunName: ActivationFunctionName;
  α: number; //learning rate
  δ: number;

  //!PERCEPTRON
  public wChanged = false;

  constructor(params: NeuronInit)
  { 
    Object.assign(this,params)
    const actFun = getActFun(params)
    this.f =  actFun.f
    this.df =  actFun.df
  }

  ///activation function
  f: (input:number)=>number
  df: (fOut:number)=>number
  
  /// limited out: -1 e 1 or 0 e 1, por exemplo
  abstract limitedOut():number

  resetWeights(mode:InitWeightsMode){
    // console.log('resetWeights mode', mode);
    switch (mode.name) {
      case 'zeros':
        this.ws = Array(this.nInputs).fill(0);
        this.b=0;
        break;
      case 'random':
        const wLimit = (<InitWeightsRandom>mode).wLimit
        this.ws = [...Array(this.nInputs)].map(() => (Math.random() * wLimit));
        this.b=0;
        break;
      default:
        console.log('resetWeights() Invalid mode ', mode);
        break;
    }
    
  }
  //? Calcula e retorna a saída do neurônio or enquanto
  abstract setInAndOut(inputs?: number[]):void

  // //? Calcula e retorna a saída do neurônio or enquanto
  // abstract incrementΔWs(inputs?: number[]):void

  // //? Calcula e retorna a saída do neurônio or enquanto
  // abstract updateWs():void

  protected calcIn(inputs: number[]){
    let sum = this.b; 
    for (let i = 0; i < inputs.length; i++) {
      sum += this.ws[i]*inputs[i]
    }
    return sum
  }

}

export interface InitWeightsMode{
  name: 'zeros' | 'random',
} 

export interface InitWeightsRandom extends InitWeightsMode{
  name: 'random',
  wLimit: number;
} 

export interface NeuronInit{
  nInputs: number,
  actFunName: ActivationFunctionName,
  α: number;
  ///activation functions params
  sigma?: number
}