import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { openModals } from 'src/app/core/global/modals/openModal';
import { FiltroReport, ReportModel, ReportProducto, ReportProductoModel, ReportVehiculoModel } from 'src/app/core/models/report/report.model';
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

    /* Documento */
    pdfb64: string = '';
    public perfilUser: any;

  public form: FormGroup = new FormGroup({});

  reports = [
    { id: 1, title: 'Productos Sin Stock' },
    { id: 2, title: 'Historial Vehiculo'},
  ]
  listProductos:ReportProductoModel[] = [];
  listProducto:ReportProducto[] =[];
  lstProducto:ReportProducto[] =[];
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

  //inicializar componente
  public ngOnInit(): void {

    if (localStorage.getItem('perfilUser')) {
      this.perfilUser = JSON.parse(localStorage.getItem('perfilUser')!);
    }

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

      this.getHistorial();
    }
  }
  //CONSULTAR TODOS LOS PRODUCTOS SIN STOCK
  public getReportes(){
    this.reporteService.getProductosSinStock().subscribe((r: any) => {
        if (r.length > 0) {

          this.listProductos = r;
          for (let index = 0; index < this.listProductos.length; index++) {

            this.listProducto.push({codigo:this.listProductos[index].codigo, descripcion:this.listProductos[index].descripcion ,cantidad:this.listProductos[index].cantidad.toString(), imagen:this.listProductos[index].imagen});
            this.lstProducto = this.listProducto;
          }
          if(this.listProducto.length > 0){
            const sliceSize = 512
          let byteCharacters = atob(r); //data.file there

          let byteArrays = [];

          for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {

            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);

            for (var i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);

          }

          const data: Blob = new Blob(byteArrays, { type: 'application/pdf' });

          const url = window.URL.createObjectURL(data);


          this.pdfb64 = url + '#toolbar=0';


          }
          this.Dowload();

        } else {
          console.log("No hay productos sin stock registrados en el sistema");
        }
      });
  }



  Dowload() {
    const source = `${this.pdfb64}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `resultado.pdf`
    link.click();
  }


    //CONSULTAR HISTORIAL DE VEHICULOS POR PLACA Y FECHA
    public getHistorial(){

      this.reporteService.getHistorialVehiculoxPlacaxFechas(this.form.value.placa,this.form.value.initialDate, this.form.value.finalDate).subscribe((r: any) => {
          if (r.length > 0) {
            this.listVehiculos = r;

          } else {
            console.log("No hay productos sin stock registrados en el sistema");
          }
        });
    }
}
