export interface ManualSchema {
    medidorId: number;
    variableId: number;
    fecha: string;
    valor: number;
    estado: boolean;
}
export interface ManualInterface {
    id: number;
    medidorId: number;
    vmedidorId: number;
    variableId: number;
    fecha: string;
    valor: number;
    estado: boolean;
    codigo: string;
    descripcion: string;

}