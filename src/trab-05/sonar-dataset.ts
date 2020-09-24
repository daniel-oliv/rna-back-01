import { maxBy, meanBy, minBy } from "lodash";
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
    // this.normalize();
  }

  private setFeatures(){
    const nFeatures = this.data[0].inVector.length;
    this.features = Array(nFeatures);
    for (let i = 0; i < nFeatures; i++) {
      const getFun = d=>d.inVector[i];
      const mean = meanBy(this.data,getFun)
      this.features[i] ={
        id:i,
        mean: mean,
        sd: sdBy(this.data,mean,getFun),
        max: getFun(maxBy(this.data, getFun)),
        min: getFun(minBy(this.data, getFun)),
      }
    }
  }

  standardize(){
    if(this.state !== 'Standardized' ){
      this.state = 'Standardized';
      for (const datum of this.data) {
        datum.inVector = datum.inVector.map((d,i)=>{
          const feat = this.features[i]
          // console.log('feat ', feat);
          // console.log('i ', i);
          // console.log('d ', d);
          return (d-feat.mean)/feat.sd;
        })
      }
    }

    // for (let i = 0; i < this.features.length; i++) {
    //   const mean = meanBy(this.data,d=>d.inVector[i])
    //   const sd= sdBy(this.data,mean,d=>d.inVector[i])
    //   console.log('mean ', mean);
    //   console.log('sd ', sd);

    // }
  }

  normalize(){
    if(this.state !== 'Normalized' ){
      this.state = 'Normalized';
      for (const datum of this.data) {
        datum.inVector = datum.inVector.map((d,i)=>{
          const feat = this.features[i]
          // console.log('feat ', feat);
          // console.log('i ', i);
          // console.log('d ', d);
          return (d-feat.min)/(feat.max-feat.min);
        })
      }
    }

    for (let i = 0; i < this.features.length; i++) {
      const getFun = d=>d.inVector[i]
      const max = getFun(maxBy(this.data,getFun))
      const min= getFun(minBy(this.data,getFun))
      console.log('min ', min);
      console.log('max ', max);

    }
  }
}

export interface FeatureData{
  id: string | number;
  mean: number;
  sd: number;
  max: number,
  min: number
}

export type DatasetState = 'Unmodified' | 'Standardized' | 'Normalized'