export interface ContractMeterInterface{
    mostrar: boolean;
    estado: boolean;
    descripcion: string;
    codigoContrato: string;
    contratoMedidorId: number;
    nombreActor: string;
    codigoMedidor: string;
    ptarifaValor: number;
    parametroId: number;
    medidorId: number;
    actorId: number;
    tarifaId: number;
    zonaId: number;
    contratoId: number;
    fechaInicial: string;
    fechaFinal: string;
    observacion: string;
}

export interface ContractMeterSchema{
    id: number;
    medidorId: number;
    tarifaId: number;
    zonaId: number;
    contratoId: number;
    fechaInicial: string;
    fechaFinal: string;
    observacion: string;
    estado: number;
}