export interface MeterSchema{
    id: number;
    codigo: string;
    sourceId: number;
    descripcion: string;
    lecturaMax: number;
    TipoMedidorId: number;
    observacion: string;
    tipo: boolean;
    estado: boolean;
  }
