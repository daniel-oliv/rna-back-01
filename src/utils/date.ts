const toSeconds = (ms)=>{
  return Math.floor(ms/1000);
}

export const Seconds = {
  from (value: number | string | Date): SecondsUnixEpoch{
    return toSeconds(new Date(value).getTime());
  },
  toDate (sec:SecondsUnixEpoch): Date{
    return new Date(sec*1000);
  },
  now: ()=>{
    return toSeconds(Date.now())
  },
  //! adiciona ou subtrai minutos
  addMinutes(timeInSec,minutes){
    return timeInSec+minutes*60;
  },
  //! adiciona ou subtrai horas
  addHours(timeInSec,hours){
    return timeInSec+hours*3600;
  }
}

export const Milis = {
  from (value: number | string | Date): MilisUnixEpoch{
    return new Date(value).getTime();
  },
  now: ()=>{
    return Date.now()
  },
  //! adiciona ou subtrai minutos
  addMinutes(timeInMili,minutes){
    return timeInMili+minutes*60000;
  },
  //! adiciona ou subtrai horas
  addHours(timeInMili,hours){
    return timeInMili+hours*3600*1000;
  }
}

export function formatDate(date: Date){
  return ("0" + date.getDate()).slice(-2) + "/" + ("0"+(date.getMonth()+1)).slice(-2) + "/" +
  date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) ;
}

export type SecondsUnixEpoch =  number;
export type MilisUnixEpoch =  number;
