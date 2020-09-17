export abstract class Neuron{

  public nInputs: number
  
  public ws: number[];
  public b: number;

  /// APÓS A ÚLTIMA VALIDAÇÃO BEM SUCEDIDA
  public preWs: number[];
  public preB: number;
  
  public in: number;
  public fOut: number;

  /// saída quantizada
  public out: number;

  //!PERCEPTRON
  public wChanged = false;

  constructor(params: NeuronInit)
  { 
    Object.assign(this,params)
  }

  ///activation function
  protected abstract f(): number
  
  /// limited out: -1 e 1 or 0 e 1, por exemplo
  protected abstract limitedOut():number

  ///train factor
  abstract trainFac(t: number):number
  


  resetWeights(mode:InitWeightsMode){
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
  setInAndOut(inputs:number[]){
    this.in = this.calcIn(inputs);
    this.fOut = this.f();
    this.out = this.limitedOut()
    return this.out;
  }
  
  

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
  nInputs: number
}