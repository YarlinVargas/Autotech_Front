import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { openModals } from 'src/app/core/global/modals/openModal';
import { FiltroReport, ReportModel, ReportProductoModel, ReportVehiculoModel } from 'src/app/core/models/report/report.model';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { ReporteService } from 'src/app/core/services/reporte/reporte.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent {
  public isProducto:boolean=false;
  public isVehiculo:boolean=false;

  public isOpen:boolean=false;

  public tooltip: TootilpOption = {
    enable: true,
    placement: 'top',
    showDelay: 0,
    hideDelay: 0,
  };

  public reportToUpdate: ReportModel = {
    id_report: 0,
    initialDate:'',
    finalDate:'',
    placa:''
  };

  public form: FormGroup = new FormGroup({});

  reports = [
    { id: 1, title: 'Productos Sin Stock' },
    { id: 2, title: 'Historial Vehiculo'},
  ]
  listProductos:ReportProductoModel[] = [];
  listVehiculos:ReportVehiculoModel[] = [];

  private fb = inject(FormBuilder);

  @Input() color = 'sky';
  @Input() id_client: string = 'select';
  @Input() defaultValue: string='Seleccione una opción';

  public openModal: openModals = new openModals(this.dialog);
  public currentLargeText = 10;
  public currentLargeTextCard = 10;
  public currentLargeTextTable = 10;

  constructor(public dialog: Dialog, public reporteService: ReporteService) {
    this.setFormOrden(this.reportToUpdate);
  }

  public setFormOrden(report: ReportModel) {
    this.form = this.fb.group({
      id_report: [report.id_report],
      initialDate:[report.initialDate],
      finalDate:[report.finalDate],
      placa:[report.placa],
    });
  }

  public OpenMenu(){
    this.isOpen = !this.isOpen;
  }

  public report(){
    if(this.form.value.id_report == 1){
      this.isProducto= true;
      this.isVehiculo= false;
       this.getReportes();
    }else{
      this.isVehiculo= true;
      this.isProducto=false;
      const data = {

        placa:this.form.value.placa,
        initialDate :this.form.value.initialDate,
        finalDate : this.form.value.finalDate
      }
      debugger
      this.getHistorial(data);
    }
  }
  //CONSULTAR TODOS LOS PRODUCTOS SIN STOCK
  public getReportes(){
    this.reporteService.getProductosSinStock().subscribe((r: any) => {
        if (r.length > 0) {
          this.listProductos = r;

        } else {
          console.log("No hay productos sin stock registrados en el sistema");
        }
      });
  }

    //CONSULTAR HISTORIAL DE VEHICULOS POR PLACA Y FECHA
    public getHistorial(data:FiltroReport){

      this.reporteService.getHistorialVehiculoxPlacaxFechas(data).subscribe((r: any) => {
        debugger
          if (r.length > 0) {
            this.listVehiculos = r;

          } else {
            console.log("No hay productos sin stock registrados en el sistema");
          }
        });
    }
}
