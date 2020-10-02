const params: TLP_Params = {
  type: 'Two Layer Perceptron',
  nInputs: nInputs, 
  nOutputs: nOutputs, 
  initWeightsMode: {name: 'random',wLimit: 0.1},
  learningRate: 0.3,
  outSigma: 0.9,
  hiddenSigma: 0.9,
  numHiddenNeurons: 5,
  maxEpoch: 50,
  dwAbsMin: 0.00001,
  lenBatch: 100,
  setsLength: {train: Math.floor(0.80*trainSet.data.length), 
    test: testSet.data.length, 
    validation: Math.floor(0.20*trainSet.data.length)
  }
}

Com PCA 3000 e 22 componentes (das 784)

Conseguiu-se 20%.


Aumentei as componentes para 50

Consegui por volta de 16% de erro


Aumentei as componentes para 100

Consegui por volta de 18-20% de erro

Diminuir tamanho do batch (voltando para 60 componentes)

Com 50 -> 16%
Com 25 -> 16-17%
Com 40 -> 20%
Fiquei com 50!!!!

Aumentei o número de neurônios escondidos para 16
# O treinamento começou com muito mais erros. Acho que uma rede com menos pesos e que fosse aumentando o número de pesos seria incrível!!!
- Estabilizou em 18-19%. Tem alguma coisa segurando ele, e não parece ser o número de neurônios


<!-- Depois vou aumentar para 10000 o PCA -->

Depois vou retirar o PCA
Retirei mas:
# SEM PCA, o treinamento fica bem mais lento, uma vez que há mais componentes
- Estabilizou em 12-13%

Colocar o PCA e testar com validação cruzada
- Não deve ajudar, pois o erro no conjunto de treino está quase a mesma coisa no validação cruzada
- Realmente 20% de erro no conjunto de teste

Depois vou retirar o PCA


Vou colocar mais uma camada de 10 neurônios (16 na primeira)

Vou colocar mais uma camada de 10 neurônios (5 na primeira)
