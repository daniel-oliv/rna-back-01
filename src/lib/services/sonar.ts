import {AdalineParams, Adaline } from "../../trab-05/adaline/adaline";
import { PerceptronParams, Perceptron } from "../../trab-05/perceptron/perceptron";
import { createOrAppendFile, readFile, createAndWriteFile } from "../../utils/fileMan";
import { AnnParams } from "../../trab-05/base/ann";
import { ANN } from "../../trab-05/base/ann";

export class ImgCharDataService {


	constructor() {

  }

  private ann: ANN;

  async trainNet(datasetID: string, annParams: AnnParams, listener: (...args: any[]) => void){
    console.log('trainNet id ', datasetID);
    // const dataset = 
    // const nInputs = dataset.data[0].inVector.length
    // const nOutputs = dataset.data[0].targetVector.length;
    // annParams.nInputs = nInputs;
    // annParams.nOutputs = nOutputs;
    // this.setAnn(annParams);
    // const res = await this.ann.train(dataset.data, listener);
    // console.log('res ', res);
    // return res;
  }

  private setAnn(annParams: AnnParams){
    switch (annParams.type) {
      case 'Adaline':
        this.ann = new Adaline(annParams as AdalineParams);
        break;
      case 'Perceptron':
        this.ann = new Perceptron(annParams as PerceptronParams);
        break;    
      default:
        console.warn('UNKNOWN ANN TYPE')
        break;
    }
  }

  async testNet(datasetID: string){
    console.log('trainNet id ', datasetID);
    // const dataset = this.datasets.filter(d=>d.id===datasetID)[0]
    // console.log('testNet id ', dataset.id);
    // const res = this.ann.testDataset(dataset.data);
    // console.log('res ', res);
    // return res;
  }

}

export const imgCharDataService = new ImgCharDataService();

