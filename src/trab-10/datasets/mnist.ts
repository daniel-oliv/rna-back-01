import { Dataset } from "./dataset";
import { MnistDatum } from "./Datum";

//THE MNIST DATABASE of handwritten digits
export class MnistDataset extends Dataset{
  public data: MnistDatum[];
  initData(){
    this.data = this.rawData.map((d,i)=>new MnistDatum(d,i))
  }
}