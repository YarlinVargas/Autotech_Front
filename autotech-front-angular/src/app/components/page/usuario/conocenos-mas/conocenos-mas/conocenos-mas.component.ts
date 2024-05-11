import { Component } from '@angular/core';

@Component({
  selector: 'app-conocenos-mas',
  templateUrl: './conocenos-mas.component.html',
  styleUrls: ['./conocenos-mas.component.scss']
})
export class ConocenosMasComponent {
  public isOpen:boolean=false;
  public perfilUser: any;

  //inicializar componente
  public ngOnInit(): void {

    if (localStorage.getItem('perfilUser')) {
      this.perfilUser = JSON.parse(localStorage.getItem('perfilUser')!);
    }

  }

  public OpenMenu(){
    this.isOpen = !this.isOpen;
  }
}
