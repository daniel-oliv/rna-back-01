import * as fs from 'fs'

export function getTrainTestData(){
  const trainDataBuffer = fs.readFileSync('./assets/mnist/train-images.idx3-ubyte');
  const trainLabelBuffer = fs.readFileSync('./assets/mnist/train-labels.idx1-ubyte');
  
  const testDataBuffer = fs.readFileSync('./assets/mnist/t10k-images.idx3-ubyte');
  const testLabelBuffer = fs.readFileSync('./assets/mnist/t10k-labels.idx1-ubyte');

  const trainData = binToJSON(60000, trainDataBuffer, trainLabelBuffer)
  const testData = binToJSON(10000, testDataBuffer, testLabelBuffer)
  return {trainData, testData}
}

function binToJSON(numOfImgs: number, dataBuffer: Buffer, labelsBuffer): MnistRawDatum[]{
  const ret = [];
  for (let iImg = 0; iImg < numOfImgs; iImg++) {
    const pixels = [];

    for (let x = 0; x <= 27; x++) {
        for (let y = 0; y <= 27; y++) {
            pixels.push(dataBuffer[(iImg * 28 * 28) + (x + (y * 28)) + 15]);
        }
    }

    const label = JSON.stringify(labelsBuffer[iImg + 8]);
    const data = pixels;
    const imageData = {
        label,
        data
    };

    ret.push(imageData);
  }
  console.log('binToJSON() ret.length ', ret.length);
  return ret;
}

export type MnistRawDatum = {data:number[], label:string};


// console.log(JSON.stringify(pixelValues.slice.));

//node script.js > mnist.json 
//produces: [{"label":"5","data":[28,0,0,0,0,0,0,0,...