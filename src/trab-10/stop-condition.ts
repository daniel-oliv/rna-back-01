export interface StopCondition{
  desc: string,
  stop: (...args: any)=>boolean,
}

export const byEpoch: StopCondition = {
  desc: 'Máxima época atingida.',
  stop: (currentEpoch, maxEpoch)=>{return maxEpoch && (currentEpoch >= maxEpoch)}
}

export const lowΔw: StopCondition = {
  desc: 'Módulo da máxima mudança Δw não foi superior a mínima dwAbsMin configurada!',
  stop: (epoch, dwAbsMax, dwAbsMin)=>{return epoch > 3 && dwAbsMax < dwAbsMin}
}