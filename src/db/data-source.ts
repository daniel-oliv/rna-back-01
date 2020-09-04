import * as logger from 'winston';
import MongoDriver from './mongo-driver';
import {forAssign} from '../utils/object-utils'
import { mean, meanOnlyValid } from '../utils/common';

export default class DataSource{

  static save(collection: string, instance){
    return MongoDriver.insertOne(collection, instance);
  }

  static getEntities(entityClassName: string, key, value){
    let objCondition = JSON.parse(`{"${key}":"${value}"}`); 
    // logger.debug('DataSource Entity ' + this.getCollectionName(entityClassName));
    // logger.debug('DataSource objCondition' + JSON.stringify(objCondition,null,2));
    return MongoDriver.findMany(DataSource.getCollectionName(entityClassName), objCondition);
  }

  static getByCOD_ID(entityClassName: string, COD_ID: string){
    let objCondition = JSON.parse(`{"COD_ID":"${COD_ID}"}`); 
    // logger.debug('DataSource Entity ' + this.getCollectionName(entityClassName));
    // logger.debug('DataSource objCondition' + JSON.stringify(objCondition,null,2));
    return MongoDriver.findOne(DataSource.getCollectionName(entityClassName), objCondition);
  }

  static numberOfEntities(entityClassName: string){
    logger.debug("DataSource " + DataSource.getCollectionName(entityClassName))
    return MongoDriver.getCollectionSize(DataSource.getCollectionName(entityClassName))
  }
  
  //! APAGAR - apenas para substituir cache e agilizar os testes. Pode ser substituído por um processo filho ou Redis
  static entitiesCacheMap = new Map<String, any[]>();
  static async getAllEntities(entityClassName: string, fields?: string[]){
    let ret
    // ret = this.entitiesCacheMap.get(entityClassName);
    // if(ret){
    //   return ret
    // }
    const collection = this.getCollectionName(entityClassName);
    const itemsPerPage = 100000;
    const total = await MongoDriver.getCollectionSize(collection);
    // const total = 100000;
    // const itemsPerPage = 100000;
    let pageNum;
    ret = [];

    let fieldsObj = undefined;
    if(fields) {
      fieldsObj = fields.reduce((res, item)=>{
      res[item]=1;
      return res;
      },{_id:0});
    }
    for (pageNum = 1; (pageNum -1) * itemsPerPage < total; pageNum++) {
        ret.push(MongoDriver.getPage(collection, itemsPerPage, pageNum,fieldsObj));
    }
    ret = await Promise.all(ret)
    ret =  ret.flat();
    // this.entitiesCacheMap.set(entityClassName, ret);
    return ret as any[];
  }

  // an array with the results returned by fn parameter for every instance of the collection
  //! Be careful using filterFn, since is best implement match in aggregate into MongoDriver.getPage()
  static async getForEach(entityClassName: string, eachFn: Function, fields?: string[], filterFn?: Function){
    let ret: [string,any][] = [];
    let acumulatorFn = filterFn ? d=>{if(filterFn(d))ret.push([d.COD_ID,eachFn(d)])}
      : d=>{ret.push([d.COD_ID,eachFn(d)])} ;
    await this.forEach(entityClassName, acumulatorFn, fields) 
    return ret;
  }

  // an array with the results returned by fn parameter for every instance of the collection
  static getMeanEach(entityClassName: string, keys: string[]){
    let fn = (d)=>mean(d,keys);
    return this.getForEach(entityClassName, fn, keys.concat('COD_ID'))
  }

  static getValidMonthsMeanEach(entityClassName: string, keys: string[]){
    let fn = (d)=>meanOnlyValid(d,keys);
    return this.getForEach(entityClassName, fn, keys.concat('COD_ID'))
  }

  static async forEach(entityClassName: string, callback: Function, fields?: string[]){
    const collection = this.getCollectionName(entityClassName);
    const itemsPerPage = 200000;
    const total = await MongoDriver.getCollectionSize(collection);
    // const total = 10000;
    // const itemsPerPage = 10000;
    let pageNum;

    let fieldsObj = undefined;
    if(fields) {
      fieldsObj = fields.reduce((res, item)=>{
      res[item]=1;
      return res;
      },{_id:0});
    }
    let promises = [];
    for (pageNum = 1; (pageNum -1) * itemsPerPage < total; pageNum++) {
      let pagePromise = (MongoDriver.getPage(collection, itemsPerPage, pageNum,fieldsObj))
      pagePromise.then(page=>{
        for(const item of page) {
          callback(item)
        }
      })
      promises.push(pagePromise)
    }
    await Promise.all(promises)
    return true;
  }

  static async getFields(entityClassName: string){
    let firstInstance = await MongoDriver.findOne(DataSource.getCollectionName(entityClassName), {})
    let fields = firstInstance ? Object.keys(firstInstance).filter(item =>!( ['_id', '__v', 'geometry'].includes(item) )) : [];
    // logger.debug(`[data-source.ts,54]  ${fields}`)
    return fields;
  }

  static getCollectionName(entityClassName: string): string{
    //return 'bdgd_' + entityClassName.toLowerCase();
    return entityClassName;
  }

}

/// fazer funções separadas quando são utilizadas separadamente (apenas esta função)
/// ou quando são utilizadas muitas vezes num mesmo contexto
export async function initSources(config){
  await  MongoDriver.connect(config.db);
}

export async function freeSources(){
  /// free resources
  try {
    await  MongoDriver.freeResourcesAndClose();
  } catch (error) {
    logger.info(error.stack);
  }
}