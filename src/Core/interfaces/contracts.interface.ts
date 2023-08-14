export interface ContractInterface{
    id: number;
    codigo: string;
    clasificacion: string;
    nombre: string; 
    actorId:number;
    exportacion: boolean;
    diaGeneracion: number;
    diasDisponibles: number;
    descripcion: string;
    fechaCreacion: string;
    fechaVenc: string;
    observacion: string;
    estado: boolean;
    tipoContratoId: number;
}

export interface ContractSchema{
  codigo: string;
  tipoContratoId: number;
  clasificacion: string;
  descripcion: string;
  actorId: number;
  fechaCreacion: string;
  fechaVenc: string;
  diaGeneracion: number;
  diasDisponibles: number;
  exportacion: boolean;
  observacion: string;
  estado: boolean;
}