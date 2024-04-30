
import { Pipe, PipeTransform } from '@angular/core';
import { RecordatorioModule } from '../../services/recordatorio/recordatorio.service';

@Pipe({
  name: 'filterNotification'
})
export class FilterNotificationPipe implements PipeTransform {

  transform(recordatorio: RecordatorioModule[], ...args: any[]): any {
    let results: RecordatorioModule[] = [];
    let foundFields: string[] = [];

    if (recordatorio?.length) {

      if (args[0].trim() == '') {
        return { results: recordatorio, foundFields };
      }

      for (const orden of recordatorio) {
        let found = false;

        if (orden.fecha.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(orden);
          found = true;
          foundFields.push("fecha");
        }
        if (orden.nombre.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(orden);
          found = true;
          foundFields.push("nombre");
        }
        if (orden.email.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(orden);
          found = true;
          foundFields.push("email");
        }

      }
    }

    foundFields = new Array(...new Set(foundFields));
    return { results, foundFields };
  }

}
