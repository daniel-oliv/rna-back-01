import { InitWeightsModeParams, InitWeightsRandom, NeuronInit } from "./neuron";
import { Neuron } from "./neuron";

export abstract class InNeuron extends Neuron{

  public nInputs: number
  
  public ws: number[];
  public b: number;

  /// APÓS A ÚLTIMA VALIDAÇÃO BEM SUCEDIDA
  public preWs: number[];
  public preB: number;
  
  public in: number;
  public fOut: number;

  /// saída quantizada
  public limOut: number;

  //!PERCEPTRON
  public wChanged = false;

  constructor(params: NeuronInit)
  { 
    super(params);
  }

  
  

}