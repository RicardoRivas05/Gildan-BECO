export interface EspecialChargesInterface {
    id: number;
    descripcion: string;
    ajuste: number;
    cargoCorte: number;
    cargoFinanciamiento: number;
    cargoMora: number;
    otrosCargos: number;
    totalCargos: number;
    fechaInicio: string;
    fechaFinal: string;
    observacion: string;
    estado: boolean;
}