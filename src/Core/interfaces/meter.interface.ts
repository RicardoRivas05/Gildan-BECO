export interface MeterSchema{
    id: number;
    codigo: string;
    sourceId: number;
    descripcion: string;
    modelo: string;
    serie: string;
    lecturaMax: number;
    multiplicador: number;
    TipoMedidorId: number;
    observacion: string;
    puntoConexion: number;
    tipo: boolean;
    registroDatos: boolean,
    almacenamientoLocal: boolean,
    funcionalidad: number,
    estado: boolean;
  }
