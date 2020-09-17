import { meanBy } from "lodash";
import { sd, sdBy } from "../utils/common";
import { SonarDatum } from "./Datum";

export class SonarDataset{
  public data: SonarDatum[];
  public state: DatasetState;
  public features: FeatureData[];
  constructor(public rawData: string[][], standardize = false){
    this.state = 'Unmodified'
    this.data = this.rawData.map(d=>new SonarDatum(d))
    this.setFeatures()
    this.standardize();
  }

  private setFeatures(){
    const nFeatures = this.data[0].inVector.length;
    this.features = Array(nFeatures);
    for (let i = 0; i < nFeatures; i++) {
      const mean = meanBy(this.data,d=>d.inVector[i])
      this.features[i] ={
        id:i,
        mean: mean,
        sd: sdBy(this.data,mean,d=>d.inVector[i])
      }
    }
  }

  standardize(){
    if(this.state !== 'Standardized' ){
      this.state = 'Standardized';
      for (const datum of this.data) {
        datum.inVector = datum.inVector.map((d,i)=>{
          const feat = this.features[i]
          return (d-feat.mean)/feat.sd;
        })
      }
    }
  }
}

export interface FeatureData{
  id: string | number;
  sd: number;
  mean: number;
}

export type DatasetState = 'Unmodified' | 'Standardized' | 'Normalized'