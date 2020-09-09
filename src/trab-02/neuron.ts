export class Neuron{
  public ws: number[];
  public b: number;
  public theta;
  //!PERCEPTRON
  public wChanged = false;
  constructor(public nInputs: number, theta: number = 0){
    this.theta = theta;
  }
  resetWeights(){
    this.ws = Array(this.nInputs).fill(0);
    this.b=0;
  }
  //? Calcula a saída do neurônio
  out(inputs:number[]){
    return this.f(this.inNeuron(inputs))
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