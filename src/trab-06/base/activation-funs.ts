import { NeuronInit } from "./neuron";

export const BipolarSigmoidFactory=(sigma:number)=> {
  if(!sigma || isNaN(sigma)) {
    console.error('[base/activation-funs,5] - INVALID SIGMA!')
  }
  return ({
    f:(input: number)=>
       2/(1+Math.exp(-sigma*input)) - 1,
    df:(fOut: number)=>{
      return (sigma/2) *(1+fOut)*(1-fOut);
    } 
  }) as ActivationFunction
}

export type ActivationFunction = {
  f:(input: number)=>number,
  df:(fOut: number)=>number
}

export const relu: ActivationFunction = {
  f:(input: number)=>
    (input > 0 ? input : 0),
  df:(fOut: number)=>{
    return (fOut > 0 ? 1 : 0);
  } 
}

export type ActivationFunctionName = 'Bipolar Sigmoid' | 'Relu'


export function getActFun(params : NeuronInit){
  switch (params.actFunName) {
    case 'Bipolar Sigmoid':
      return BipolarSigmoidFactory(params.sigma)
      break;
    case "Relu":
      return relu;
      break;
  
    default:
      console.log('INVALID ACTIVATION FUNCTION')
      break;
  }
}