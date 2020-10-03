import { maxBy, meanBy, minBy, shuffle } from "lodash";
import { sdBy } from "../../utils/common";
import { Datum } from "./Datum";

export abstract class  Dataset{
  // id: string;
  public state: DatasetState;
  public features: FeatureData[];
  public data: Datum[];
  constructor(public id: string, public rawData: (any[])){
    this.state = 'Unmodified'
    this.initData();
    this.setFeatures()
    // FIXME - VOLTAR NORMALIZE E COLOCAR MAIS NEURÔNIOS NA CAMADA ESCONDIDA - se não adiantar, pode ser melhor aumentar o range do PCA, pois deu 99 naquela outra estatística
    // Pode ser interessante fazer PCA apenas para um número???? acho que não exemplos não fazem, mas 1 é muito diferente de 2, enquanto rostos são parecidos
    this.standardize();
    // this.normalize(-1,1);
    // this.normalize(0,255);
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
          let newNum = feat.sd !== 0 ? (d-feat.mean)/feat.sd
           : feat.mean
          return newNum;
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
          let newNum
          if((feat.max-feat.min)!==0){
            newNum = (d-feat.min)/(feat.max-feat.min)*(ymax-ymin)+ymin;
          }else{
            newNum = (ymax+ymin)/2
          }
          // console.log('newNum ', newNum);
          return newNum;
        })
      }
    }

    // for (let i = 0; i < this.features.length; i++) {
    //   const getFun = d=>
    //     d.inVector[i]
    //   const max = getFun(maxBy(this.data,getFun))
    //   const min= getFun(minBy(this.data,getFun))
    //   console.log('min ', min);
    //   console.log('max ', max);

    // }
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