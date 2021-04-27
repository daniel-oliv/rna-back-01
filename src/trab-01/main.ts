import { ANN } from "./ann";
import { createMtxOfBinaryVecs, printMatrix } from "../utils/binary";

//! Questão 2.2
function trainAndTestHebb(nInputs: number){
  /// CRIA matriz das n entradas (nInputs)
  const nInCombination = Math.pow(2,nInputs)
  //? nInCombination número de linhas tabela verdade
  const mIn = createMtxOfBinaryVecs(nInputs, nInCombination);
  printMatrix(mIn,'Entradas');
  /// cria vetores de saída com 2^nInputs algarismos (1 para cada linha da tabela verdade)
  /// cada linha é o vetor target de uma época
  const allPossibleTargets = createMtxOfBinaryVecs(nInCombination);
  printMatrix(allPossibleTargets,'Todos os targets');
  
  const rna = new ANN(nInputs);
  rna.testAllLogicFunction(mIn, allPossibleTargets);
}
// trainAndTestHebb(2);

//! Questão 2.5
function questao2_5(){
  const mtxInputs = [
    [1, 1, 1, 1],
    [-1, 1, -1, -1],
    [1, 1, 1, -1],
    [1, -1, -1, 1],

  ]
  const target = [1,1,-1,-1];
  const rna = new ANN(4);

  printMatrix(mtxInputs,'Matrix de entrada')
  console.log('target ', target);
  
  rna.train(mtxInputs,target);
  if(rna.test(mtxInputs,target)){
    console.log('Certo!')
  }else{
    console.log('Rede não foi capaz de aprender!');
  }
}
questao2_5();