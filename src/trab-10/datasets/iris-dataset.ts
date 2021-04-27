import { Dataset } from "./dataset";
import { IrisDatum } from "./Datum";

export class IrisDataset extends Dataset{
  public data: IrisDatum[];
  initData(){
    this.data = this.rawData.map((d,i)=>new IrisDatum(d,i))
  }
}