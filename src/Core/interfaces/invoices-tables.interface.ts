export interface  InvoiceInterface{
    detalleFacturaId: number;
    codigo: string;
    codigoContrato: string;
    descripcion: string;
    fechaLectura: string;
    fechaVencimiento: string;
    fechaInicio: string;
    fechaFin: string;
    fechaEmision: string;
    tipoConsumo: number;
    observacion: string;
    cargoFacturaId: number;
    facturaId: number;
    contratoMedidorId: number;
    actorId: number;
    cliente: string;
    energiaConsumida: number;
    consumoSolar: number,
    consumoExterno: number,
    total: number;
    parametroTarifaId: number;
    estado: number;
    medidorId: number;
}