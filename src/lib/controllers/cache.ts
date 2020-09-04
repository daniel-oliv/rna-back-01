import { Request, Response } from "express";

const cacheRepMap = new Map<string,any>();


export function cacheReq(url: string, content: any){
  cacheRepMap.set(url, content);
}

export async function getReq(req: Request, res: Response, getServiceFun:(req: Request, res: Response,)=>Promise<any>){
  const url = req.url
  console.log('req.url ', url);
  let result = cacheRepMap.get(url);
  if(!result){
    result = await getServiceFun(req, res);
    cacheReq(url,result)
  }
  res.status(200).json(
    result
  ); 
}

// TODO - MUITO IMPORTANTE BOLAR COMO LIMPAR, ISTO É, COMO PERCEBER QUANTA MEMÓRIA FOI USADA E QUANDO FOR MUITA LIMPAR
//! in the second vesion, if will not use redis, we can do a logic to keep the most used req
export function clearCache(){
  cacheRepMap.clear()
}