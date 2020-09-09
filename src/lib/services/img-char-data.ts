import { Dataset } from "../../trab-02/interfaces/interfaces/dataset";
import DataSource from "../../db/data-source";
import { Adaline as ANN, AdalineParams } from "../../trab-04/adaline/adaline";
import { createOrAppendFile, readFile, createAndWriteFile } from "../../utils/fileMan";
import { AnnParams } from "../../trab-04/base/ann";

const ImgCharDataCollection = 'imgchardata'

export class ImgCharDataService {

  datasets: Dataset[] = [];

	constructor() {

  }

  private ann: ANN;

  async trainNet(datasetID: string, annParams: AdalineParams, listener: (...args: any[]) => void){
    console.log('trainNet id ', datasetID);
    const dataset = this.datasets.filter(d=>{
      console.log('d.id ', d.id);
      return d.id===datasetID})[0]
    const nInputs = dataset.data[0].inVector.length
    const nOutput = dataset.data[0].targetVector.length;
    this.ann = new ANN(annParams);
    const res = this.ann.train(dataset.data, listener);
    console.log('res ', res);
    return res;
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
    this.datasets.push(dataset);
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

