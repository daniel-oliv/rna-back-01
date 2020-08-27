import { ANN } from "./ann";
import { createMtxOfBinaryVecs } from "./binary";

function trainAndTestHebb(nInputs: number){
  /// CRIA matriz das n entradas (nInputs)
  const nInCombination = Math.pow(2,nInputs)
  const mIn = createMtxOfBinaryVecs(nInputs, nInCombination);
  /// cria vetores de saída com 2^nInputs algarismos (1 para cada linha da tabela verdade)
  /// cada linha é o vetor target de uma época
  const allPossibleTargets = createMtxOfBinaryVecs(nInCombination);
  
  const rna = new ANN(nInputs);
  rna.testAllLogicFunction(mIn, allPossibleTargets);
}

trainAndTestHebb(2);