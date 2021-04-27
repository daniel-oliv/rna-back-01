import { SOM, SOM_Params } from "./som";
import { getDumpData } from "./target-less-datum";

export async function currentMain(){
  console.log('08 ');
  // const rawData = await parseCSV('./assets/bezdekIris.data',false, ',');
  // // //!misturar e padronizar
  // const dataset = new IrisDataset('iris', rawData)
  const inputs = getDumpData(100,2);
  // console.log('inputs ', inputs);
  const params: SOM_Params = {
    nIns: 2,
    nOuts: 50,
    r: 1,
    a: 0.5,
    k: 0.0049,
    maxEpoch: 100,
    initWeightsMode: {name: 'random',wLimit: 0.1}
  }
  const som = new SOM(params)
  som.cluster(inputs, (res)=>console.log('res ', res))
}