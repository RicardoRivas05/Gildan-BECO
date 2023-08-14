export interface EEHSchema{
    id: number,
    contratoId: number,
    tipoFacturaId: number,
    codigo: string,
    fechaEmision: string,
    fechaVencimiento: string,
    fechaInicial: string,
    fechaFinal: string,
    cargoReactivo: number,
    estado: boolean
}

export interface datosFacturacion {
    facturaId: number,
    estado: boolean,
    facturaManualId: number,
    codigo: string,
    contratoId: number,
    fechaEmision: string,
    fechaVencimiento: string,
    fechaInicial: string,
    fechaFinal: string,
    tipoFacturaId: number,
    detalleId: number,
    
}


export interface LecturasPorContrato {

  contrato: {
    contratoId: number,
    contratoMedId: number,
    contratoCodigo: string,
    fechaInicial: string,
    fechaFinal: string,
    cliente: string,
    diasDisponibles: number,
    diaGeneracion: number,
    direccion: string,
    telefono: string,
    correo: string,
    logo: string,
  },
  cargo:
  [
    {
      nombre: string,
      valorAjustado: number
    }
  ],
  medidor: [
    {
      sourceID: number,
      sourceName: string,
      LecturaActiva: number,
      ConsumoExterno: number,
      ConsumoInterno: number,
      LecturaReactiva: number,
      LecturaActivaExportada: number,
      cargoReactivo: boolean,
      descripcion: string,
      CEF: number,
      PCF: number,
      FP: number,
      PCFR: number,
      ESC: number,
      EAX: number,
      PPPT: number,
      funcionalidad: number,
      mostrar: boolean,
      historico: {
        lecturaActivaActual: number,
        lecturaActivaAnterior: number,
        lecturaReactivaActual: number,
        lecturaReactivaAnterior: number,
        lecturaActivaExportadaActual: number,
        lecturaActivaExportadaAnterior: number,
        fechaActual: string,
        fechaAnterior: string,
        multiplicador: number,
      }

    }
  ],
  vmedidor?: [
    {
      id: number,
      descripcion: string,
      LecturaActiva: number,
      LecturaReactiva: number,
      mostrar: boolean,
      porcentaje: number,
    }
  ],
  totalLecturaActivaAjustada: number,
  totalLecturaReactivaAjustada: number,
  totalEnergiaFotovoltaicaActivaConsumida: number,
  totalEnergiaFotovoltaicaReactivaConsumida: number,
  totalEnergiaActivaExportada: number,
  totalEnergiaDeInyeccionConsumida: number,
  CEFTotal: number,
  PCFTotal: number,
  PCFRTotal: number,
  FPTotal: number,
  PPPTT: number,
  PPS: number,
  PT: number,
  PBE: number,
  ECR: number,
  ESG: number,
  cargoReactivo: boolean,
  ModoCalculoSolar: boolean,
  diasFacturados: number,
}