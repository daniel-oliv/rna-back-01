
export function randomItem(array: any[]){
  return array[randomInt(array.length)];
}

export function randomInt(maxExcluded){
  return Math.floor(Math.random() * maxExcluded);
}

export function sdBy(data: any[], mean: number, func: (...args : any[])=>number) {
  return Math.sqrt(varianceBy(data, mean, func));
}

export function varianceBy(data: any[], mean: number, func: (...args : any[])=>number) {
  let sd = 0;
  let dif;
  mean = +mean;
  for (const datum of data) {
      dif = (+func(datum)-mean)
      sd += dif*dif;
  }
  //console.log('total ', total);
  return sd / data.length;
}

export function sd(data, mean, keys) {
  return Math.sqrt(variance(data, mean, keys));
}

export function variance(data, mean, keys) {
  let sd = 0;
  let dif;
  mean = +mean;
  for (const key of keys) {
      dif = (+data[key]-mean)
      sd += dif*dif;
  }
  //console.log('total ', total);
  return sd / keys.length;
}

export function varianceOnlyValid(data, mean, keys) {
  let sd = 0;
  let dif;
  mean = +mean;
  let num = 0;
  for (const key of keys) {
      dif = (+data[key]-mean)
      sd += dif*dif;
      num++;
  }
  //console.log('total ', total);
  return num ? sd / num : 0;
}

export function mean(data, keys) {
  let total = 0;
  for (const key of keys) {
      if(data[key] != "" && ( (+data[key]) != 0) && !isNaN(data[key])) 
      {
          total += +data[key];
      }
  }
  // console.log('total ', total);
  return Math.round(total / keys.length);
}

export function meanOnlyGtZero(data, keys) {
  let validFn = (num, key, rawValue)=> num > 0
  return meanOnlyValid(data, keys,validFn)
}

//! lembrar que +null = 0 então tem que avaliar value=!null caso não usar (+value) != 0
export function meanOnlyValid(data, keys, validFn?: (num: number,key, rawValue)=>boolean) {
  if(!validFn) validFn = (num, key, rawValue)=>rawValue != "" && !isNaN(num) &&  num != 0; 
  // console.log('this.meanOnlyValid ', data);
  let total = 0;
  let count = 0;
  for (const key of keys) {
      let num = +data[key];
      if(validFn(num,key,data[key])) 
      {
          total += num;
          count++;
      }
  }
  // console.log('total ', total);
  // console.log('ret ', (num ? Math.round(total / num) : 0) );
  return count ? Math.round(total / count) : 0;
}


export function secondsDiff(t1,t2){
  return Math.round(Math.abs( (t1.getTime() - t2.getTime())/1000 ));
}

export function getTimeDateString()
{
    let today = new Date();
    // let dd = today.getDate();
    // let mm = today.getMonth() + 1; //January is 0!
    // let yyyy = today.getFullYear();
    let dateVec = [today.getDate(), today.getMonth() + 1, today.getFullYear()];
    let timeVec = [today.getHours(), today.getMinutes(), today.getSeconds(), today.getMilliseconds()]
    
    let timeStr = 'Data_' + dateVec.join('-') + '_Hora_' + timeVec.join('-') ;
    return timeStr;
}

export function getTimeString()
{
    let today = new Date();
    // let dd = today.getDate();
    // let mm = today.getMonth() + 1; //January is 0!
    // let yyyy = today.getFullYear();
    let timeVec = [today.getHours(), today.getMinutes(), today.getSeconds(), today.getMilliseconds()]
    
    let timeStr = timeVec.join('-') ;
    return timeStr;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// module.exports = {
//   getTimeDateString,
//   getTimeString,
//   createOrAppendFile,
//   fileExist
// }