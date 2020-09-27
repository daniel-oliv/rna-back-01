import DataSource from "../../db/data-source";
import { parseCSV } from "../../utils/fileMan";
import { shuffle } from "lodash";
import { Dataset } from "../../trab-06/datasets/dataset";
import { ANN, AnnParams } from "../../trab-06/base/ann";
import { SonarDataset } from "../../trab-06/datasets/sonar-dataset";
import { IrisDataset  } from "../../trab-06/datasets/iris-dataset";
import { TLP, TLP_Params } from "../../trab-06/two-layer-perceptron/perceptron";

export class MlpService {

  datasets: Dataset[] = [];

	constructor() {

  }

  private ann: ANN;

  datasetMap: Map<string, Dataset>;
  // sonarSet: SonarDataset;
  async trainAndTest(datasetID: string, annParams: AnnParams, listener: (...args: any[]) => void){
    console.log('trainAndTestSonar');
    console.log('annParams ', annParams);
    if(!this.datasetMap){
      await this.initDatasetsMap();
    }
    const dataset = this.datasetMap.get(datasetID);
    if(dataset){
      //!misturar e padronizar
      console.error("NOT LOADED DATASET")
    }
    dataset.randomlySort();
    const nInputs = dataset.data[0].inVector.length
    const nOutputs = dataset.data[0].targetVector.length;
    const setsLength = annParams.setsLength
    console.log('setsLength ', setsLength);
    annParams.nInputs = nInputs;
    annParams.nOutputs = nOutputs;
    this.setAnn(annParams);
    const res = await this.ann.trainAndTest(dataset.data, setsLength, listener);
    console.log('res ', res);
    return res;
  }

  async trainCrossValidation(datasetID: string, annParams: AnnParams, listener: (...args: any[]) => void){
    console.log('trainAndTestSonar');
    console.log('annParams ', annParams);
    if(!this.datasetMap){
      await this.initDatasetsMap();
    }
    const dataset = this.datasetMap.get(datasetID);
    if(dataset){
      //!misturar e padronizar
      console.error("NOT LOADED DATASET")
    }
    dataset.randomlySort();
    const nInputs = dataset.data[0].inVector.length
    const nOutputs = dataset.data[0].targetVector.length;
    const setsLength = annParams.setsLength
    console.log('setsLength ', setsLength);
    annParams.nInputs = nInputs;
    annParams.nOutputs = nOutputs;
    this.setAnn(annParams);
    const res = await this.ann.trainCrossValidation(dataset.data, setsLength, listener);
    console.log('res ', res);
    return res;
  }

  async initDatasetsMap(){
    this.datasetMap = new Map();
    const sonarSet = new SonarDataset('sonar', await parseCSV('./assets/sonar.all-data',false, ','))
    this.datasetMap.set('sonar', sonarSet)
    const irisSet = new IrisDataset('iris', await parseCSV('./assets/bezdekIris.data',false, ','));
    this.datasetMap.set('iris', irisSet)
  }

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
      case 'Two Layer Perceptron':
        this.ann = new TLP(annParams as TLP_Params);
        break;
      // case 'Perceptron':
      //   this.ann = new Perceptron(annParams as PerceptronParams);
      //   break;
      // case 'Sigmoid Perceptron':
      //     this.ann = new SigmoidPerceptron(annParams as SigmoidPerceptronParams);
      //     break;
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

}

export const mlpService = new MlpService();

