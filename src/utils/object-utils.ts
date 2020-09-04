import * as logger from 'winston'
import { groupBy as groupByLodash, isEqual} from 'lodash';

export function forAssign(arr: any[], fun: Function, options?:any){
  arr.forEach((element,index,arra) => {
    arra[index] = fun(element, options)
  });
}

export function assignSome(target, source, props: string[]){
  for (const prop of props) {
    target[prop] = source[prop];
  }
}

/**
 * @param {Object} obj 
 * @param {string} preKey 
 * @param {Object} res 
 */
export function planeObj(obj, preKey='', res = {}){
  let keys = Object.keys(obj);
  // console.log('keys ', keys);
  // console.log('obj ', obj);
  // console.log('typeof  obj ', typeof(obj));
  let type = typeof(obj);
  if( type == 'string' || keys.length === 0){
    res[preKey] = obj;
    return;
  }
  for (const key of keys) {
    let newKey = preKey === '' ? key : preKey+"_"+key; 
    planeObj(obj[key],newKey,res);
  }

  return res;
}

/**
 * @param {Array} items - array in which the keys will be search in all objects at firts level
 */
export function allDataKeys(items){
  let allK:any = [];
  for (const item of items) {
    let itemKeys = Object.keys(item);
    for (const key of itemKeys) {
      if(!allK.includes(key)){
        allK.push(key);
      }
    }
  }
  return allK;
}

/**
 * 
 * @param {String} str 
 */
export function str2Array(str){
  try {
    if(str?.startsWith("[")){
      let mod = str.trim();
      return mod.slice(1,mod.length-1).split(",");
    }
  } catch (error) {
    logger.warn('object-utils - ' + error.stack);
  }
  return str;
}

/**
 * 
 * @param {any} obj 
 * @param {Function} func 
 */
export function forIn(obj, func){
  let keys = Object.keys(obj);
  logger.debug("forIn keys: "+ keys);
  for (const key of keys) {
    func(key,obj);
  }
}

/**
 * 
 * @param {any[]} obj 
 * @param {Function} func 
 */
export function forInArray(objs, func){
  let keys = Object.keys(objs[0]);
  logger.debug("forInArray keys: "+ keys);
  for (const obj of objs) { 
    for (const key of keys) {
      func(key, obj);
    }
  }
}

// export function groupBy(xs, key) {
//   return xs.reduce(function(rv, x) {
//       let v = x[key];
//       if(!rv['_keys'].includes(v)) rv['_keys'].push(v);
//       (rv[v] = rv[v] || []).push(x);
//       return rv;
//   }, {'_keys': []});
// };

export function groupBy(arr, func: Function) {
  let keys = [];
  const mapObj = groupByLodash(arr,func);
  
  for (const key in mapObj) {
    if (mapObj.hasOwnProperty(key)) {
      keys.push(key); 
    }
  }
  return {'_keys':keys, '_dict':mapObj}
}

export function groupByMap<T>(arr: T[], func: Function) {
  const map = new Map<string,T[]>();
  const mapObj = groupByLodash(arr,func);
  
  for (const key in mapObj) {
    if (mapObj.hasOwnProperty(key)) {
      map.set(key,mapObj[key] as T[]) 
    }
  }
  return map;
}

export function groupByFunction(xs, callback) {
  return xs.reduce(function(rv, x) {
      let v = callback(x); 
      if(!rv['_keys'].includes(v)) rv['_keys'].push(v);
      (rv[v] = rv[v] || []).push(x);
      return rv;
  }, {'_keys': []});
};

export function iterableToArray<T>(it: IterableIterator<T>){
  let ret: T[] = [];
  for (const item of it) {
    ret.push(item);
  }
  return ret;
}

export function valuesMapToArray<K,T>(map: Map<K,T>){
  let ret: T[]=[];
  for (const value of map.values()) {
    ret.push(value); 
  }
  return ret;
}

export function array2Map<K,T>(arr: T[], getKey: (d:T)=>K){
  let ret = new Map<K,T>();
  for (const value of arr) {
    ret.set(getKey(value), value); 
  }
  return ret;
}

function areEqualArrayInOrder(arr1: any[],arr2: any[], fn){
  if(arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if(fn(arr2[i]) !== fn(arr1[i])) {
      return false;
    }
  }
  return true;
}

/// be careful
export function isArrayEqual(arr1: any[], arr2:any[]){
  let cp1 = arr1.concat();
  let cp2 = arr2.concat();
  return isEqual(cp1.sort(),cp2.sort());
}

export function someProp(obj, fn: (key: string, value)=> boolean, keys?: string[]){
  if(!keys) keys = Object.keys(obj)
  for (const key of keys) {
    if(fn(key, obj[key])){
      return true;
    }
  }
  return false;
}

export function everyProp(obj, fn: (key: string, value)=> boolean, keys?: string[]){
  if(!keys) keys = Object.keys(obj)
  for (const key of keys) {
    if(!fn(key, obj[key])){
      return false;
    }
  }
  return true;
}