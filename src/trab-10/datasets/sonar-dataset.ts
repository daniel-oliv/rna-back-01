import { Dataset } from "./dataset";
import { SonarDatum } from "./Datum";

export class SonarDataset extends Dataset{
  public data: SonarDatum[];
  initData(){
    this.data = this.rawData.map(d=>new SonarDatum(d))
  }
}