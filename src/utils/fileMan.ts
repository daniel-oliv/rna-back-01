import * as fs from 'fs'
import {promisify} from 'util'
const csv = require('csv');
import * as logger from 'winston';
const ou = require("../helpers/object-utils")

// console.log('csvParser ', csv);
// Convert fs.readFile into Promise version of same    
export const readFile = promisify(fs.readFile);

export async function fileExist(filePath: string){
  return fs.existsSync(filePath);
}

export async function parseCSV(filePath: string, toObject: boolean,delimiter: string = ";"): Promise<Promise<any[]>>{
  logger.debug("parseCSV " + filePath);
  logger.debug("delimiter- " + delimiter);
  return new Promise((res,rej)=>{
    let results: any[] = [];
      fs.createReadStream(filePath)
      .pipe(csv.parse({ columns: toObject, delimiter: delimiter }))
      .on('data', (data: any) => {
        results.push(data);
        // logger.debug(`fileMan parseCSV data: ${data}`)
      })
      .on('end', () => {
        ou.log('[fileMan.ts] parseCSV - ', filePath)
        ou.log('[fileMan.ts] parseCSV - ', results[0])
        res(results as []);
      })
      .on('error', (error: Error) => {
        logger.info(error.stack as string)
        console.log('error ', error.stack);
        rej(error);  
      })
  })
}

export function createAndWriteFile(buff: string, file_name: string)
{
    let dir = "./logMsgFiles/"
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    
    fs.writeFile(dir+ file_name, buff, function(err: any){
        //Caro ocorra algum erro
      if(err){
            return console.log('erro: ', err)
        }
      //Caso não tenha erro, retornaremos a mensagem de sucesso
        console.log('Arquivo Criado');
    });
}

export function createOrAppendFile(dir: string, file_name: string, buff: string)
{
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    
    fs.appendFileSync(dir+ file_name, buff)
    // fs.appendFile(dir+ file_name, buff, function(err:any){
    //     //Caro ocorra algum erro
    //   if(err){
    //         return console.log('erro: ', err)
    //     }
    //   //Caso não tenha erro, retornaremos a mensagem de sucesso
    //   //console.log('Escrita realizada com sucesso.');
    // });
}