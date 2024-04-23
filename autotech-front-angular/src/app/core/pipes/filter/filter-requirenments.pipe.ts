import { Pipe, PipeTransform } from '@angular/core';
import { ListRequirenment } from '../../services/requirenment/models/requirenment';

@Pipe({
  name: 'filterRequeriments'
})
export class FilterRequerimentsPipe implements PipeTransform {

  transform(requirenments: ListRequirenment[], ...args: any[]): any {
    let results: ListRequirenment[] = [];
    let foundFields: string[] = [];

    if (requirenments?.length) {

      if (args[0].trim() == '') {
        return { results: requirenments, foundFields };
      }

      for (const requirenment of requirenments) {
        let found = false;

        if (requirenment.fecha.toString().toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(requirenment);
          found = true;
          foundFields.push("fecha");
        }
        if (requirenment.cliente.toString().toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(requirenment);
          found = true;
          foundFields.push("cliente");
        }
        if (requirenment.usuario.toString().toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(requirenment);
          found = true;
          foundFields.push("usuario");
        }
        if (requirenment.descripcion_requerimiento.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(requirenment);
          found = true;
          foundFields.push("descripcion_requerimiento");
        }
      }
    }

    foundFields = new Array(...new Set(foundFields));
    return { results, foundFields };
  }

}
