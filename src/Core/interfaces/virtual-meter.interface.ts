export interface VirtualMeterInterface{
    id: number;
    medidorId: number;
    sourceId: number;
    vmedidorId: number;
    operacion: number;
    porcentaje: number;
    observacion: string;
    mostrar: boolean;
    estado: boolean;
}

export interface VirtualMeterShema{
    id: number;
    medidorId: number;
    porcentaje: number;
    operacion: boolean;
    observacion: string;
    estado: boolean;
}