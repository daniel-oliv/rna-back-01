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

export const tanh: ActivationFunction = {
  f:(input: number)=>{
    var expm2x = Math.exp(-2*input)
    return (1-expm2x)/(1+expm2x);
  },
  df:(fOut: number)=>{
    return (1+fOut)*(1-fOut);
  } 
}

export const relu: ActivationFunction = {
  f:(input: number)=>
    (input > 0 ? input : 0),
  df:(fOut: number)=>{
    return (fOut > 0 ? 1 : 0);
  } 
}

export const LeakyReluFactory=(sigma:number)=> {
  if(!sigma || isNaN(sigma)) {
    console.error('[base/activation-funs,5] - INVALID SIGMA!')
  }
  return ({
    f:(input: number)=>
      (input > 0 ? input : sigma*input),
    df:(fOut: number)=>{
      return (fOut > 0 ? 1 : sigma);
    } 
  }) as ActivationFunction
}

export type ActivationFunctionName = 'Bipolar Sigmoid' | 'Relu' | 'Tangente Hiperbólica' | 'Leaky Relu'


export function getActFun(params : NeuronInit){
  switch (params.actFunName) {
    case 'Bipolar Sigmoid':
      return BipolarSigmoidFactory(params.sigma)
    case "Relu":
      return relu;
    case "Leaky Relu":
      return LeakyReluFactory(params.sigma);
    case "Tangente Hiperbólica":
      return tanh;
  
    default:
      console.log('INVALID ACTIVATION FUNCTION')
      break;
  }
}