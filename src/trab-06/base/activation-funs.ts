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
  f:()=>number,
  df:(fOut: number)=>number
}

export type ActivationFunctionName = 'Bipolar Sigmoid'


export function getActFun(params : NeuronInit){
  switch (params.actFunName) {
    case 'Bipolar Sigmoid':
      return BipolarSigmoidFactory(params.sigma)
      break;
  
    default:
      console.log('INVALID ACTIVATION FUNCTION')
      break;
  }
}