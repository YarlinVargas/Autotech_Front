export interface OrdenTrabajoModel {
  id_orden_trabajo: number,
  descripcion: string,
  id_estado: number,
  id_cliente: number,
  id_vehiculo: number,
  id_usuario: number,
  id_tipo_orden: number,
  id_soporte: number,
  id_requerimiento: number
}
export interface ListOrdenTrabajo {
  id_orden_trabajo: number,
  descripcion: string,
  cliente: string,
  vehiculo: string,
  usuario: string,
  tipo_orden: string,
  soporte: string,
  requerimiento: string
}

