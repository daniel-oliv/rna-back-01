import { Dataset } from "../../trab-02/interfaces/interfaces/dataset";
import DataSource from "../../db/data-source";
import {AdalineParams, Adaline } from "../../trab-04/adaline/adaline";
import { createOrAppendFile, readFile, createAndWriteFile } from "../../utils/fileMan";
import { AnnParams } from "../../trab-04/base/ann";
import { ANN } from "../../trab-04/base/ann";
import { PerceptronParams, Perceptron } from "../../trab-04/perceptron.ts/perceptron";

const ImgCharDataCollection = 'imgchardata'

export class ImgCharDataService {

  datasets: Dataset[] = [];

	constructor() {

  }

  private ann: ANN;

  async trainNet(datasetID: string, annParams: AnnParams, listener: (...args: any[]) => void){
    console.log('trainNet id ', datasetID);
    const dataset = this.datasets.filter(d=>{
      // console.log('d.id ', d.id);
      return d.id===datasetID})[0]
    const nInputs = dataset.data[0].inVector.length
    const nOutputs = dataset.data[0].targetVector.length;
    annParams.nInputs = nInputs;
    annParams.nOutputs = nOutputs;
    this.setAnn(annParams);
    const res = await this.ann.train(dataset.data, listener);
    console.log('res ', res);
    return res;
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
    const dataset = this.datasets.filter(d=>d.id===datasetID)[0]
    console.log('testNet id ', dataset.id);
    const res = this.ann.testDataset(dataset.data);
    console.log('res ', res);
    return res;
  }

  async getAllOnDB(): Promise<Dataset[]>{
    console.log('getAllOnDB ');
    const res = await DataSource.getAllEntities(ImgCharDataCollection, []);
    // const resStr = 
    // const res = JSON.parse(await (await readFile("./files/"+ImgCharDataCollection)).toString())
    if(res[0])console.log('res ', res[0].id);
    this.datasets = res;
    return res;
  }
  
  async addAndSaveOnDB(dataset: Dataset){
    console.log('addAndSaveOnDB id ', dataset.id);
    const oldArr = this.datasets.filter(d=>d.id === dataset.id)[0]
    if(oldArr){
      this.datasets.splice(this.datasets.indexOf(oldArr), 1, dataset)
    }else{
      this.datasets.push(dataset);
    }
    const old = await DataSource.updateOne(ImgCharDataCollection, {id:dataset.id},{$set:dataset});
    console.log(old)
    if(old.modifiedCount === 0){
      const res = await DataSource.save(ImgCharDataCollection, dataset);
      // createAndWriteFile(ImgCharDataCollection,JSON.stringify(this.datasets))
      console.log('res.insertedCount ', res.insertedCount);
      // return res.insertedCount ? true : false;
    }
    
    return true;
  }

}

export const imgCharDataService = new ImgCharDataService();

