export interface ChargesInterface{
    id: number;
    nombre: string;
    unidad: string;
    codigo: string;
    estado: boolean;
}

export interface ChargesShema{
    id: number;
    fechaInicio: string;
    fechaFinal: string;
    descripcion: string;
    cargoFinanciamiento: number;
    ajuste: number;
    cargoCorte: number;
    cargoMora: number;
    otrosCargos: number;
    totalCargos: number;
    observacion: string;
    estado?: number;
}