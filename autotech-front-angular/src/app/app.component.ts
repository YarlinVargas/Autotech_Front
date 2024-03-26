import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'autotech-front-angular';
  constructor(public router: Router) {
    this.router.events.subscribe((event: any) => {
      if(event instanceof NavigationEnd) {
        if (event.url) {
          const splitUrl = event.url.split('/');
          if (splitUrl.length > 1) {
            if (splitUrl[1] != "listcompanyResult" && splitUrl[1] != "detailResultCompany") {
              localStorage.removeItem('filterExams');
            }

            if (splitUrl[1] != "patientResult" && splitUrl[1] != "result") {
              localStorage.removeItem('filterResults');
            }
          }
        }
      }
    })
  }
}
