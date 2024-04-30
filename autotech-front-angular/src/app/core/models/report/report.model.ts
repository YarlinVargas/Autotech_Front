export interface ReportModel {
  id_report: number,
  initialDate: string,
  finalDate: string,
  placa:string
}
export interface FiltroReport {
  initialDate: string,
  finalDate: string,
  placa:string
}

export interface ReportProductoModel {
  codigo: string,
  descripcion: string,
  cantidad: number,
  imagen:string
}
export interface ReportVehiculoModel {
  placa: string,
  nombre_completo: string,
  fecha: string,
  requerimiento: string,
  trabajo_realizado: string,
}
