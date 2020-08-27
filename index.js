function createMtxOfBinaryVecs(numOfAlgarismos){
  const nTotal = Math.pow(2,numOfAlgarismos)
  for (let i = nTotal-1; i >= 0; i--) {
    const str = i.toString(2).padStart(nTotal,0);
    console.log('str ', str);
    for (const ch of str) {
      console.log('ch ', ch);
      
    }
  }
}