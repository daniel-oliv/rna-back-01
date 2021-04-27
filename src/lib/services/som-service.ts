import { SOM, SOM_Params } from "../../trab-08/som";
import { getDumpData } from "../../trab-08/target-less-datum";

export class SomService {
	constructor() {

  }

  private som: SOM;


  async cluster(datasetID: string,somParams: SOM_Params, listener: (...args: any[]) => void){
    console.log('trainNet id ', datasetID);
    const dataset = getDumpData(50,2)
    // console.log('testNet id ', dataset);
    this.som = new SOM(somParams)
    const res = this.som.cluster(dataset, listener);
    console.log('res ', res);
    return res;
  }

}

export const somService = new SomService();

