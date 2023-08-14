export interface RollOverSchema { 
    id: number;
    medidorId: number;
    fechaInicial: string;
    fechaFinal: string;
    energia: number;
    lecturaAnterior: number;
    lecturaNueva: number;
    observacion: string;
    estado: boolean;
}