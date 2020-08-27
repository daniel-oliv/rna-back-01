import { printMatrix } from "./binary";

export class ANN{
  public w: number[];
  public b: number;
  constructor(public nInputs: number){
    this.w = Array(nInputs).fill(0);
    this.b=0;
  }

  train(inVectors: Array<number[]>, tVector: number[]){
    this.w = Array(this.nInputs).fill(0);
    this.b=0;
    for (let iEpoch = 0; iEpoch < inVectors.length; iEpoch++) {
      this.trainEpochByHebb(inVectors[iEpoch],tVector[iEpoch])    
    }
    console.log('\n---Final weights---')
    console.log('w = ', this.w)
    console.log('b = ', this.b)
  }

  trainEpochByHebb(s: number[], t: number){
    this.b = this.b + t;
    for (let i = 0; i < this.nInputs; i++) {
      this.w[i] = this.w[i] + s[i]*t;
    }
  }

  testAllLogicFunction(mIn: Array<number[]>, allPossibleTargets: Array<number[]>){
    const ret = {sucesso: 0, falhas:0}
    for (const targetVector of allPossibleTargets) {
      console.log('Training for ')
      printMatrix(mIn, 'mIn')
      console.log('target ', targetVector);
      /// para cada possível target (saída) para funções lógicas treinar
      this.train(mIn, targetVector);
      
      // e testar a rede
      /// se o teste for bom, adiciona no sucesso
      if(this.test(mIn,targetVector)){
        ret.sucesso= ret.sucesso+1;
      }
      else{
        ret.falhas= ret.falhas+1;
        console.log('------------FALHA--------------');
      }
    }
    console.log('ret ', ret);
    return ret;
  }

  test(inVectors: Array<number[]>, tVector: number[]){
    for (let iEpoch = 0; iEpoch < inVectors.length; iEpoch++) {
      if(!this.testEpoch(inVectors[iEpoch], tVector[iEpoch])){
        return false
      }
    }
    return true;
  }

  testEpoch(s: number[], t: number){
    let out = this.calcOut(s);
      if(out != t){
        return false
      }
    return true;
  }

  calcOut(s: number[]){
    if(this.inNet(s)>=0){
      return 1;
    }
    else{
      return -1;
    }
  }

  /// activation
  inNet(inputs: number[]){
    let sum = this.b; 
    for (let i = 0; i < inputs.length; i++) {
      sum += this.w[i]*inputs[i]
    }
    return sum
  }
}