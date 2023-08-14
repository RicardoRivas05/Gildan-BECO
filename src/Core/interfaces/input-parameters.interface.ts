export interface InputParametersInterface{
    id: number;
    tipo: boolean;
    idParametro: number;
    codigo: string;
    cargoId: number | string;
    cargoNombre: string;
    valor: number;
    fechaInicio: string;
    fechaFinal: string;
    estado: boolean;
    observacion: string;
    tarifaId: number;
}

export interface InputParamSchema{
    id: number;
    tipoCargoId: number;
    fechaInicio: string;
    fechaFinal: string;
    valor: number;
    observacion: string;
    tipo: boolean;
    estado: boolean; 
}

export interface ParamRelationSchema { 
    id: number;
    tarifaId: number;
    parametroId: number;
    estado: boolean;
}