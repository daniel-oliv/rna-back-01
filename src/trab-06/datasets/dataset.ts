import { maxBy, meanBy, minBy, shuffle } from "lodash";
import { sdBy } from "../../utils/common";
import { Datum } from "./Datum";

export abstract class  Dataset{
  id: string;
  public state: DatasetState;
  public features: FeatureData[];
  public data: Datum[];
  constructor(id, public rawData: string[][]){
    this.state = 'Unmodified'
    this.initData();
    this.setFeatures()
    // this.standardize();
    this.normalize(-1,1);
  }

  randomlySort(){
    this.data = shuffle(this.data)
  }

  protected abstract initData()

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

  normalize(ymin:number, ymax){
    if(this.state !== 'Normalized' ){
      this.state = 'Normalized';
      for (const datum of this.data) {
        datum.inVector = datum.inVector.map((d,i)=>{
          const feat = this.features[i]
          // console.log('feat ', feat);
          // console.log('i ', i);
          // console.log('d ', d);
          return (d-feat.min)/(feat.max-feat.min)*(ymax-ymin)+ymin;
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