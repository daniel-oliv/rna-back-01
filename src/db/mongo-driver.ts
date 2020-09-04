import { last } from 'lodash';
// var MongoClient = require('mongodb').MongoClient;
import * as logger from 'winston'
import {MongoClient, Db, ObjectId} from "mongodb"
// var url = "mongodb://localhost:27017/";

// static setURL = (config)=>{
//   url = 'mongodb://'+configDB.user + ':' + configDB.password + '@' + configDB.host+':'+configDB.port+'/'+configDB.database+'?authSource=admin'
//   console.log('url ', url);
// }

export default class MongoDriver{
  static url;
  static db: Db;
  static connection: MongoClient;
  static async connect(configDB){
    // url = 'mongodb://'+configDB.user + ':' + configDB.password + '@' + configDB.host+':'+configDB.port+'/'+configDB.database+'?authSource=admin'
    MongoDriver.url = 'mongodb://'+configDB.user + ':' + configDB.password + '@' + configDB.host+':'+configDB.port+'/'+'?authSource=admin'
    let urlLog = 'mongodb://'+configDB.user + ':' + '*******' + '@' + configDB.host+':'+configDB.port+'/'+'?authSource=admin'
    logger.info('masked mongo url ' + urlLog);
    //var dbo = db.db("bdgd");
    MongoDriver.connection = (await MongoClient.connect(MongoDriver.url,{ useUnifiedTopology: true, useNewUrlParser: true })); 
    MongoDriver.db = MongoDriver.connection.db(configDB.database);
    return MongoDriver.db;
  }

  static getPage(collection: string, itemsPerPage: number, pageNum: number, fieldsObj?: any){
    let ops: any[]= [
      { $skip: (itemsPerPage * (pageNum - 1)) },
      { $limit: itemsPerPage }
    ]
    if(fieldsObj){
     ops.push({$project: fieldsObj})  
    }
    return MongoDriver.db.collection(collection).aggregate(ops).toArray();
  }

  // TODO - fazer lógica para salvar os ids das páginas inicias, assim, é possível ir diretamente para uma página
  static async getChunk(collection: string, itemsPerPage: number, last_id: ObjectId, fieldsObj?: any){
    // console.log('last_id ', last_id);
    let findObj = undefined;
    if(last_id){
      findObj = {'_id': {'$gt': last_id}}
    }else{
      findObj = {}
    }
    let arr =  fieldsObj ? await MongoDriver.db.collection(collection).find(findObj).project(fieldsObj).limit(itemsPerPage).toArray()
      : await  MongoDriver.db.collection(collection).find(findObj).limit(itemsPerPage).toArray()
    
    return arr;
  }

  static findOne(collection: string, condition) {
    return MongoDriver.db.collection(collection).findOne(condition);
  }
  
  static findMany(collection: string, condition) {
    // return db.collection(collection).find(condition).toArray();
    return MongoDriver.db.collection(collection).find(condition).toArray();
  }
  
  static findManyLimit = (collection: string, condition,limit) => {
    // return db.collection(collection).find(condition).toArray();
    return MongoDriver.db.collection(collection).find(condition).limit(limit).toArray();
  }

  static getCollectionSize = (collection: string) => {
      return MongoDriver.db.collection(collection).countDocuments();
  }
  
  
  static getCollection = (collection: string) => {
      return MongoDriver.db.collection(collection).find().toArray();
  }
  
  static insertOne = (collection: string, item)=>{
    console.log('collection ', collection);
      return MongoDriver.db.collection(collection).insertOne(item)
  }
  
  static insertMany = (collection: string, array)=>{
    return MongoDriver.db.collection(collection).insertMany(array,{ordered: false})
  }
  
  /// this is not needed according this: https://stackoverflow.com/questions/19938153/do-i-need-to-explicitly-close-connection
  static freeResourcesAndClose = ()=>{
    return MongoDriver.connection.close();
  }
}