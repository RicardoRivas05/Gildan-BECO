export interface ActorInterface{
    id: number;
    usuarioId: number;
    tipo: boolean;
    nombre: string;
    telefono: string;
    direccion: string;
    imagen: string;
    imagenId: string;
    observacion: string;
    correo: string;
    estado: boolean;
}

export interface ImageInterface {
    uid: string,
    name: string,
    status: string,
    url: string,
    thumbUrl: string
}