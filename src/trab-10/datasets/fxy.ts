import { Dataset } from "./dataset";
import { FxyDatum } from "./Datum";

//THE MNIST DATABASE of handwritten digits
export class FxyDataset extends Dataset{
  public data: FxyDatum[];
  initData(){
    this.data = this.rawData.map((d,i)=>new FxyDatum(d,i))
  }
}