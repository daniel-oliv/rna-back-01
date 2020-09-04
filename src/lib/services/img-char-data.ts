import { Dataset } from "../../trab-02/interfaces/interfaces/dataset";
import DataSource from "../../db/data-source";
import { ANN } from "../../trab-02/ann";

const ImgCharDataCollection = 'imgchardata'

export class ImgCharDataService {

  datasets: Dataset[] = [];

	constructor() {

  }

  private ann: ANN;

  async trainNet(datasetID: string, learningRate?: number, theta?: number){
    console.log('trainNet id ', datasetID);
    const dataset = this.datasets.filter(d=>d.id===datasetID)[0]
    const nInputs = dataset.data[0].inVector.length
    const nOutput = dataset.data[0].targetVector.length;
    this.ann = new ANN(nInputs, nOutput, learningRate);
    const res = await this.ann.train(dataset.data);
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
    console.log('res ', res);
    this.datasets.push(...res);
    return res;
  }
  
  async addAndSaveOnDB(dataset: Dataset){
    console.log('addAndSaveOnDB id ', dataset.id);
    this.datasets.push(dataset);
    const res = await DataSource.save(ImgCharDataCollection, dataset);
    console.log('res ', res);
    return res.insertedCount ? true : false;
  }

}

export const imgCharDataService = new ImgCharDataService();

