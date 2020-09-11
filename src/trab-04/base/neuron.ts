export class Neuron{
  public ws: number[];
  public b: number;
  public in: number;
  //!PERCEPTRON
  public wChanged = false;
  constructor(
    public nInputs: number, 
    public theta: number = 0
  )
  { 


  }


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
  //? Calcula a saída do neurônio
  out(inputs:number[]){
    this.in = this.inNeuron(inputs);
    return this.f(this.in)
  }
  
  ///activation function
  private f(inNeuron: number){
    // console.log('theta ', this.theta)
    if(inNeuron > this.theta){
      return 1;
    }
    else if(inNeuron < -this.theta){
      return -1;
    }
    else{
      return 0;
    }
  }

  private inNeuron(inputs: number[]){
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