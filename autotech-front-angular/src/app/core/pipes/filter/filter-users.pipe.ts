import { Pipe, PipeTransform } from '@angular/core';
import { ListUsuario } from '../../models/user/list-user.model';

@Pipe({
  name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {

  transform(users: ListUsuario[], ...args: any[]): any {
    let results: ListUsuario[] = [];
    let foundFields: string[] = [];

    if (users?.length) {

      if (args[0].trim() == '') {
        return { results: users, foundFields };
      }

      for (const user of users) {
        let found = false;

        if (user.name.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(user);
          found = true;
          foundFields.push("name");
        }
        if(user.lastName.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(user);
          found = true;
          foundFields.push("lastName");
        }
        if(user.email.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(user);
          found = true;
          foundFields.push("email");
        }
        if(user.userName.toLowerCase().includes(args[0].trim().toLowerCase())) {
          !found && results.push(user);
          found = true;
          foundFields.push("userName");
        }
      }
    }

    foundFields = new Array(...new Set(foundFields));
    return { results, foundFields };
  }

}
