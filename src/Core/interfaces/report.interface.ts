export interface ReportData {
  sourceID: number;
  TimestampUTC: string;
  sourceName: string;
  quantityID: number;
  quantityName: string;
  Value: number;
  energiaActivaInicialPT577:number;
  energiaActivaFinalPT577:number;
  diferenciaEnergiaActivaPT577:number;
  energiaReactivaInicialPT577:number;
  energiaReactivaFinalPT577:number;
  diferenciaEnergiaReactivaPT577:number;
  energiaActivaInicialRT577:number;
  energiaActivaFinalRT577:number;
  diferenciaEnergiaActivaRT577:Number
  energiaReactivaInicialRT577:Number;
  energiaReactivaFinalRT577:Number;
  diferenciaEnergiaReactivaRT577:Number;
  energiaActivaBecoT577: number;
  lecturaReactiva:number;
  factorPotencia:number;
}
