export interface Requirenment {
  id_requerimiento: number;
  fecha: Date;
  id_cliente: number;
  id_usuario: number;
  id_estado: number;
  descripcion_requerimiento: string;
}
export interface ListRequirenment {
  id_requerimiento: string;
  fecha: Date;
  descripcion_requerimiento: string;
}
