import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent {
  public isOpen:boolean=false;

  public OpenMenu(){
    this.isOpen = !this.isOpen;
  }
}
