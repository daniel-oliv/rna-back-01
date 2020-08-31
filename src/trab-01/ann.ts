import { printMatrix } from "../utils/binary";

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
    for (let iDatum = 0; iDatum < inVectors.length; iDatum++) {
      this.trainDatumByHebb(inVectors[iDatum],tVector[iDatum])    
    }
    console.log('\n---Final weights---')
    console.log('w = ', this.w)
    console.log('b = ', this.b)
  }

  trainDatumByHebb(s: number[], t: number){
    this.b = this.b + t;
    for (let i = 0; i < this.nInputs; i++) {
      this.w[i] = this.w[i] + s[i]*t;
    }
  }

  testAllLogicFunction(mIn: Array<number[]>, allPossibleTargets: Array<number[]>){
    const ret = {sucesso: 0, falhas:0}
    for (const targetVector of allPossibleTargets) {
      console.log('\n\n-------- Training for ---------')
      // printMatrix(mIn, 'mIn')
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
    console.log('\n\nScore de todas as funções lógicas \n--------------------------------\n', ret);
    console.log('\n\n')
    return ret;
  }

  test(inVectors: Array<number[]>, tVector: number[]){
    for (let iDatum = 0; iDatum < inVectors.length; iDatum++) {
      if(!this.testDatum(inVectors[iDatum], tVector[iDatum])){
        return false
      }
    }
    return true;
  }

  testDatum(s: number[], t: number){
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