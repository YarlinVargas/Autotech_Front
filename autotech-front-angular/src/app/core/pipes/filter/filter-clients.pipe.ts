import { Pipe, PipeTransform } from '@angular/core';
import { Cliente } from '../../services/client/client.service';

@Pipe({
  name: 'filterClients'
})
export class FilterClientsPipe implements PipeTransform {

  transform(clients: Cliente[], ...args: any[]): any {
    let results: Cliente[] = [];
    let foundFields: string[] = [];

    if (clients?.length) {

      if (args[0].trim() == '') {
        return { results: clients, foundFields };
      }

      for (const client of clients) {
        let found = false;

        if (client.nombres.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(client);
          found = true;
          foundFields.push("nombres");
        }
        if (client.apellidos.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(client);
          found = true;
          foundFields.push("apellidos");
        }
        if (client.Direccion.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(client);
          found = true;
          foundFields.push("Direccion");
        }
        if(client.documento_identidad.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(client);
          found = true;
          foundFields.push("documento_identidad");
        }
        if(client.telefono.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(client);
          found = true;
          foundFields.push("telefono");
        }
        if(client.email.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(client);
          found = true;
          foundFields.push("email");
        }

      }
    }

    foundFields = new Array(...new Set(foundFields));
    return { results, foundFields };
  }

}
