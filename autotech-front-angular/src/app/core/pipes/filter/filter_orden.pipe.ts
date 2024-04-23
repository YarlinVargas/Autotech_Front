import { Pipe, PipeTransform } from '@angular/core';
import { ListOrdenTrabajo } from '../../models/orden-trabajo/orden-trabajo.model';

@Pipe({
  name: 'filterOrden'
})
export class FilterOrdenPipe implements PipeTransform {

  transform(ordenes: ListOrdenTrabajo[], ...args: any[]): any {
    let results: ListOrdenTrabajo[] = [];
    let foundFields: string[] = [];

    if (ordenes?.length) {

      if (args[0].trim() == '') {
        return { results: ordenes, foundFields };
      }

      for (const orden of ordenes) {
        let found = false;

        if (orden.descripcion.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(orden);
          found = true;
          foundFields.push("descripcion");
        }
        if (orden.cliente.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(orden);
          found = true;
          foundFields.push("cliente");
        }
        if (orden.vehiculo.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(orden);
          found = true;
          foundFields.push("vehiculo");
        }
        if (orden.usuario.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(orden);
          found = true;
          foundFields.push("usuario");
        }
        if (orden.tipo_orden.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(orden);
          found = true;
          foundFields.push("tipo_orden");
        }
        if (orden.soporte.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(orden);
          found = true;
          foundFields.push("soporte");
        }
        if (orden.requerimiento.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(orden);
          found = true;
          foundFields.push("requerimiento");
        }
      }
    }

    foundFields = new Array(...new Set(foundFields));
    return { results, foundFields };
  }

}
