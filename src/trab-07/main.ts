// const { PCA } = require('ml-pca');
import * as logger from 'winston'
import { PCA } from "ml-pca";
import { shuffle } from "lodash";
import { getTrainTestData } from "./datasets/idx_ubyte_to_json";
import { MnistDataset } from "./datasets/mnist";
import { TLP, TLP_Params } from "./two-layer-perceptron/perceptron";

export async function currentMain(){
  const rawData = getTrainTestData();
  
  const mtx = shuffle(rawData.trainData).slice(0,3000).map(d=>d.data);
  console.time('build pca');
  const pca = new PCA(mtx);
  console.log('pca ', pca.getExplainedVariance());
  console.timeEnd('build pca');
  
  console.time('applyPCA');
  
  let mtxIn: number[][];
  let mtxOut: number[][];

  mtxIn = rawData.trainData.map(d=>d.data);
  mtxOut = pca.predict(mtxIn, {nComponents: 60}).to2DArray();
  rawData.trainData.forEach((d,i)=>d.data = mtxOut[i])
  
  mtxIn = rawData.testData.map(d=>d.data);
  mtxOut = pca.predict(mtxIn, {nComponents: 60}).to2DArray();
  rawData.testData.forEach((d,i)=>d.data = mtxOut[i])
  
  console.timeEnd('applyPCA');

  const trainSet = new MnistDataset('mnist', rawData.trainData)
  const testSet = new MnistDataset('mnist', rawData.testData)
  trainSet.randomlySort();
  
  
  const setLen = trainSet.data.length + testSet.data.length;
  const nInputs = trainSet.data[0].inVector.length
  const nOutputs = trainSet.data[0].targetVector.length;
  // const params: AdalineParams = {
  //   type: 'Adaline',
  //   nInputs: nInputs, 
  //   nOutputs: nOutputs, 
  //   initWeightsMode: {name: 'random',wLimit: 0.1},
  //   learningRate: 0.01,
  //   theta: 0,
  //   maxEpoch: 100,
  //   dwAbsMin: 0.01,
  // }
  const params: TLP_Params = {
    type: 'Two Layer Perceptron',
    nInputs: nInputs, 
    nOutputs: nOutputs, 
    initWeightsMode: {name: 'random',wLimit: 0.1},
    learningRate: 0.3,
    outSigma: 0.9,
    hiddenSigma: 0.9,
    numHiddenNeurons: 9,
    maxEpoch: 50,
    dwAbsMin: 0.00001,
    lenBatch: 100,
    setsLength: {train: Math.floor(0.80*trainSet.data.length), 
      test: testSet.data.length, 
      validation: Math.floor(0.20*trainSet.data.length)
    }
  }
  //! CHUTO QUE VAMOS precisar idealmente de dois neurônios na camada de escondida, e não de três
  const ann = new TLP(params);

  // const ret = await ann.train(dataset.data.slice(0,100),(res)=>console.log(res));
  // console.log('ret ', ret);
  // const res = ann.testDataset(dataset.data.slice(100,150));
  // const listener = (res)=>console.log(res);
  const listener = (res)=>logger.verbose(JSON.stringify(res,null,2));
  // let timeStr = getTimeString();
  console.time('trainAndTest');
  const res = await ann.trainAndTest(trainSet.data.concat(testSet.data), params.setsLength, listener);
  console.timeEnd('trainAndTest');
  // console.time('trainCrossValidation');
  // const res = await ann.trainCrossValidation(trainSet.data.concat(testSet.data), params.setsLength, (res)=>console.log('res ', res));
  // console.timeEnd('trainCrossValidation');  
  console.log('res FINAL', res)
  logger.info(`[trab-07/main,84] RES FINAL  ${JSON.stringify(res,null,2)}`)
  listener(res);

}