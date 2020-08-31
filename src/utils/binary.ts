export function createMtxOfBinaryVecs(numOfAlgarismos, nTotal = Math.pow(2,numOfAlgarismos)){
  const ret: Array<Array<number>> = []
  
  for (let i = nTotal-1; i >= 0; i--) {
    const str = i.toString(2).padStart(numOfAlgarismos,'0');
    //console.log('str ', str);
    const arr: number[] = []//new Array(numOfAlgarismos);
    ret.push(arr)
    for (const ch of str) {
      //console.log('ch ', ch);
      arr.push(getBipolar(ch));
      //console.log('arr ', arr);
    }
    //console.log('ret ', ret);
  }
  return ret;
}

export function getBipolar(bit:string): 1|-1{
  switch (bit) {
    case '1':
      return 1;
      break;
    case '0':
      return -1;
      break;
    default:
      console.log('INVALID VALUE IN getBipolar()')
      break;
  }
}

export function printMatrix(m: Array<number[]>, title = 'Matrix '){
  const newLine = '\n'
  let str = title+newLine;
  for(const line of m){
    for (const el of line) {
      str += getSigned(el)+'\t'
    }
    str += newLine;
  }
  console.log(str);
}

export function getSigned(theNumber: number)
{
    if(theNumber > 0){
        return "+" + theNumber;
    }else{
        return theNumber.toString();
    }
}
