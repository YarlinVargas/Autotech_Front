import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, filter, finalize, takeUntil, tap } from 'rxjs';
import { TextLargeWindow } from 'src/app/core/constants/textLargeWindow';
import { openModals } from 'src/app/core/global/modals/openModal';
import { ToggleListEnum } from 'src/app/core/models/enums/toggleList.enum';
import { ListOrdenTrabajo, OrdenTrabajoModel } from 'src/app/core/models/orden-trabajo/orden-trabajo.model';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { VehiculoModel } from 'src/app/core/models/vehiculo/vehiculo.model';
import { ClientService, Cliente, ClienteReq } from 'src/app/core/services/client/client.service';
import { Requirenment } from 'src/app/core/services/requirenment/models/requirenment';
import { SoporteModel, SoporteService } from 'src/app/core/services/soporte/soporte.service';
import { TipoOrdenModel } from 'src/app/core/services/tipoOrden/tipo-orden.service';
import { Usuario, UsuarioService } from 'src/app/core/services/usuario/usuario.service';
import { VehiculoService } from 'src/app/core/services/vehiculo/vehiculo.service';
import { OrdenTrabajoService } from 'src/app/core/services/ordenTrabajo/ordenTrabajo.service';
import { TipoOrdenTrabajoService } from 'src/app/core/services/tipoOrden/tipo-orden.service';
import { RequirenmentService } from 'src/app/core/services/requirenment/requirenment.service';
import { FilterOrdenPipe } from 'src/app/core/pipes/filter/filter_orden.pipe';


@Component({
  selector: 'app-gestor-orden-trabajo',
  templateUrl: './gestor-orden-trabajo.component.html',
  styleUrls: ['./gestor-orden-trabajo.component.scss']
})
export class GestorOrdenTrabajoComponent {
  public currentView:boolean=true;
  public isOpen:boolean=false;
  public allOptions = ToggleListEnum;
  public form: FormGroup = new FormGroup({});
  public tooltip: TootilpOption = {
    enable: true,
    placement: 'top',
    showDelay: 0,
    hideDelay: 0,
  };

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private clientService = inject(ClientService);
  private usuarioService = inject(UsuarioService);
  private soporteService = inject(SoporteService);
  private vehiculoService = inject(VehiculoService);
  private ordenService = inject(OrdenTrabajoService);
  private tipoOrdenService = inject(TipoOrdenTrabajoService);
  private requirenmentService = inject(RequirenmentService);


  listClients:ClienteReq[] = [];
  listSoportes:SoporteModel[] = [];
  listVehiculo: VehiculoModel[] = [];
  listOrdenTrabajo: OrdenTrabajoModel[] = [];
  listOrden:ListOrdenTrabajo[] = [];
  listaOrden:ListOrdenTrabajo[] = [];
  listUsuario: Usuario[] = [];
  listTipoOrden: TipoOrdenModel[] =[];
  listRequerimientos: Requirenment[]=[];

  cliente:string = "";
  ordentrabajo:string= "";
  requerimiento:string= "";
  soporte:string= "";
  tipoOrden:string= "";
  vehiculo:string= "";
  usuario:string= "";


  public optionsSearch: string[] = [];
  public perfilUser: any;

  public currentLargeTextCard = 10;
  public currentLargeTextTable = 10;
  public openModal: openModals = new openModals(this.dialog);
  public destroy$: Subject<boolean> = new Subject<boolean>();

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.currentLargeTextCard = TextLargeWindow.get(15, 20, 15, 25);
    this.currentLargeTextTable = TextLargeWindow.get(15);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if(this.eRef.nativeElement.contains(event.target)) {
      this.optionsSearch = [];
    }
  }

  @HostListener('window:resize',['$event'])
  Resolucion(event:any): void{
    setTimeout(()=>{
      this.calcularCarta()
    },100)
  }


  constructor(public dialog: Dialog, public pipe: FilterOrdenPipe, private eRef: ElementRef, ) {
    this.form = this.fb.group({
      search: ['']
    });
    this.calcularCarta()
  }

  calcularCarta() {
    if (window.innerWidth < 768) {
      this.currentView=true
    }
  }

  public ngOnInit(): void {
if (localStorage.getItem('perfilUser')) {
      this.perfilUser = JSON.parse(localStorage.getItem('perfilUser')!);
    }
    this.getClientes();
    this.form.get('search')?.valueChanges

      .pipe(
        takeUntil(this.destroy$),
        tap((value: string) => {
          this.optionsSearch = [];
        }),
        filter((value: string) => value.length > 2),
      )
      .subscribe((value: string) => {
        var resultPipe: any = this.pipe.transform(this.listaOrden, value);
        this.optionsSearch = resultPipe.results.map((client: any) =>
          resultPipe.foundFields.map((field: string) => client[field])
        ).flat();
      });

    this.currentLargeTextCard = TextLargeWindow.get(15, 20, 15, 25);
    this.currentLargeTextTable = TextLargeWindow.get(15);
  }
  // trae la lista de ordenes de trabajo
public getOrdenTrabajo(){

  this.ordenService.getOrdenesTrabajo().subscribe((r: any) => {
      if (r.length > 0) {
        this.listOrdenTrabajo = r;

        for (let index = 0; index < this.listOrdenTrabajo.length; index++) {
          for (let c = 0; c < this.listClients.length; c++) {
            if(this.listClients[c].id_cliente == this.listOrdenTrabajo[index].id_cliente){
              this.cliente = this.listClients[c].nombres + " " + this.listClients[c].apellidos;
            }
          }
          for (let r = 0; r < this.listRequerimientos.length; r++) {
            if(this.listRequerimientos[r].id_requerimiento == this.listOrdenTrabajo[index].id_requerimiento){
              this.requerimiento = this.listRequerimientos[r].descripcion_requerimiento;
            }
          }
          for (let s = 0; s < this.listSoportes.length; s++) {
            if(this.listSoportes[s].id_soporte == this.listOrdenTrabajo[index].id_soporte){

                this.soporte = this.listSoportes[s].descripcion_soporte;
            }
          }
          for (let t = 0; t < this.listTipoOrden.length; t++) {
            if(this.listTipoOrden[t].id_tipo_orden == this.listOrdenTrabajo[index].id_tipo_orden){

              this.tipoOrden= this.listTipoOrden[t].descripcion;
            }
          }
          for (let u = 0; u < this.listUsuario.length; u++) {
            if(this.listUsuario[u].id_usuario == this.listOrdenTrabajo[index].id_usuario){

            this.usuario = this.listUsuario[u].nombres + " " + this.listUsuario[u].apellidos;
            }
          }
          for (let v = 0; v < this.listVehiculo.length; v++) {
            if(this.listVehiculo[v].id_vehiculo == this.listOrdenTrabajo[index].id_vehiculo){

              this.vehiculo =this.listVehiculo[v].marca + " " + this.listVehiculo[v].color + " " + this.listVehiculo[v].placa;
            }
          }
          this.listOrden.push({id_orden_trabajo:this.listOrdenTrabajo[index].id_orden_trabajo, descripcion:this.listOrdenTrabajo[index].descripcion ,cliente:this.cliente, vehiculo:this.vehiculo,usuario:this.usuario, tipo_orden:this.tipoOrden,soporte:this.soporte,requerimiento:this.requerimiento});
        this.listaOrden = this.listOrden;
        }
      } else {
        console.log("No hay ordenes registrados en el sistema");
      }
    });
}
// trae la lista de clientes
public getClientes(){
  this.clientService.getClientes().subscribe((r: any) => {
      if (r.length > 0) {
        this.listClients = r;
        this.getRequerimientos();

      } else {
        console.log("No hay clientes registrados en el sistema");
      }
    });
}

// trae la lista de vehiculos
public getVehiculos(){
  this.vehiculoService.getVehiculos().subscribe((r: any) => {
      if (r.length > 0) {
        this.listVehiculo = r;
        this.getOrdenTrabajo();
      } else {
        console.log("No hay clientes registrados en el sistema");
      }
    });
}

// trae la lista de usuarios
public getUsuarios(){
  this.usuarioService.getUsuarios().subscribe((r: any) => {
      if (r.length > 0) {
        this.listUsuario = r;
        this.getVehiculos();
      } else {
        console.log("No hay clientes registrados en el sistema");
      }
    });
}

// trae la lista de tipos de ordenes
public getTiposOrdenes(){
  this.tipoOrdenService.getTiposOrden().subscribe((r: any) => {
      if (r.length > 0) {
        this.listTipoOrden = r;
        this.getUsuarios();
      } else {
        console.log("No hay clientes registrados en el sistema");
      }
    });
}
// trae la lista de soportes
public getSoportes(){
  this.soporteService.getSoportes().subscribe((r: any) => {
      if (r.length > 0) {
        this.listSoportes = r;
        this.getTiposOrdenes();
      } else {
        console.log("No hay soportes registrados en el sistema");
      }
    });
}
// trae la lista de requerimientos
public getRequerimientos(){
  this.requirenmentService.getRequerimientos().subscribe((r: any) => {
      if (r.length > 0) {
        this.listRequerimientos = r;
        this.getSoportes();
      } else {
        console.log("No hay clientes registrados en el sistema");
      }
    });
}

  public setSuggestion(event: any) {
    this.form.get('search')?.setValue(event);
    this.optionsSearch = [];
  }

  public toggleView(){
    this.currentView = !this.currentView
  }
  public OpenMenu(){
    this.isOpen = !this.isOpen;
  }

  public getValueForm = (id: string): string => this.form.get(id)?.value;

  public navigate(url: string, event?: any): void {
    if (event?.header === 'Editar')
      this.router.navigate([url, event.id]);
    else if (event?.header === 'Eliminar')
      this.deleteOrden(event.id);
    // else if (event?.header === 'Detalles')
    //   this.showDetails(event.id);
    else
      this.router.navigateByUrl(url);
  }

 // Eliminar orden de trabajo
 public deleteOrden(idOrden: number) {
  const currentOrden = this.listOrdenTrabajo.find((orden: OrdenTrabajoModel) => orden.id_orden_trabajo == idOrden);
  if (!currentOrden) return;

  const dialog = this.openModal.OpenLogout(
    [`La orden "${currentOrden?.descripcion}" no podrá acceder al sistema`],
    '30rem',
    '¿Esta seguro que desea eliminar esta orden de trabajo?',
    'Esta acción es permanente'
  );

  dialog.componentInstance!.logoutEvent?.subscribe(_ => {
    this.ordenService.deleteOrdenTrabajoById(currentOrden.id_orden_trabajo)
    .subscribe((r: any) => {
          this.openModal.Open(1, [],`Orden de trabajo "${currentOrden?.id_orden_trabajo}" eliminado correctamente!`, '25rem');
          this.getOrdenTrabajo();
      });
  });
}

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
