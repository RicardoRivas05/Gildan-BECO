export interface ManualInvoiceDetailSchema{
    id: number,
    facturaId: number,
    tipoCargoId: number,
    estado: boolean,
}

export interface ManualInvoiceDetailView{
    estado: boolean,
    id: number,
    codigo: string,
    contratoId: number,
    fechaEmision: string,
    fechaVencimiento: string,
    fechaInicial: string,
    fechaFinal: string,
    tipoFacturaId:number,
    detalleId: number,
    tipoCargoId: number,
    nombre: string,
    valor: number,
}