import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, filter, finalize, takeUntil, tap } from 'rxjs';
import { TextLargeWindow } from 'src/app/core/constants/textLargeWindow';
import { openModals } from 'src/app/core/global/modals/openModal';
import { ListClients } from 'src/app/core/models/client/list-client.model';
import { ToggleListEnum } from 'src/app/core/models/enums/toggleList.enum';
import { RespService } from 'src/app/core/models/general/resp-service.model';
import { ListOrdenTrabajo, OrdenTrabajoModel } from 'src/app/core/models/orden-trabajo/orden-trabajo.model';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { VehiculoModel } from 'src/app/core/models/vehiculo/vehiculo.model';
import { FilterClientsPipe } from 'src/app/core/pipes/filter/filter-clients.pipe';
import { ClientService, Cliente, ClienteReq } from 'src/app/core/services/client/client.service';
import { SpinnerService } from 'src/app/core/services/gen/spinner.service';
import { Requirenment } from 'src/app/core/services/requirenment/models/requirenment';
import { SoporteModel, SoporteService } from 'src/app/core/services/soporte/soporte.service';
import { TipoOrdenModel } from 'src/app/core/services/tipoOrden/tipo-orden.service';
import { Usuario, UsuarioService } from 'src/app/core/services/usuario/usuario.service';
import { VehiculoService } from 'src/app/core/services/vehiculo/vehiculo.service';
import { OrdenTrabajoService } from 'src/app/core/services/ordenTrabajo/ordenTrabajo.service';
import { TipoOrdenTrabajoService } from 'src/app/core/services/tipoOrden/tipo-orden.service';
import { RequirenmentService } from 'src/app/core/services/requirenment/requirenment.service';


@Component({
  selector: 'app-gestor-orden-trabajo',
  templateUrl: './gestor-orden-trabajo.component.html',
  styleUrls: ['./gestor-orden-trabajo.component.scss']
})
export class GestorOrdenTrabajoComponent {
  public currentView:boolean=true;
  public isOpen:boolean=false;
  public allOptions = ToggleListEnum;
  public formClient: FormGroup = new FormGroup({});
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


  listClients:Cliente[] = [];
  listSoportes:SoporteModel[] = [];
  listVehiculo: VehiculoModel[] = [];
  listOrdenTrabajo: OrdenTrabajoModel[] = [];
  listOrden:ListOrdenTrabajo[] = [];
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


  constructor(public dialog: Dialog, public pipe: FilterClientsPipe, private eRef: ElementRef, ) {
    this.formClient = this.fb.group({
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
    this.getOrdenTrabajo();
    this.getClientes();
    this.getRequerimientos();
    this.getSoportes();
    this.getTiposOrdenes();
    this.getUsuarios();
    this.getVehiculos();
    this.formClient.get('search')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((value: string) => {
          this.optionsSearch = [];
        }),
        filter((value: string) => value.length > 2),
      )
      .subscribe((value: string) => {
        var resultPipe: any = this.pipe.transform(this.listClients, value);
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
        debugger
        this.listOrdenTrabajo = r;

        for (let index = 0; index < this.listOrdenTrabajo.length; index++) {
          for (let c = 0; c < this.listClients.length; c++) {
            if(this.listClients[c].id == this.listOrdenTrabajo[index].id_cliente.toString()){
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
              //this.listOrden.push({id_orden_trabajo:this.listOrdenTrabajo[index].id_orden_trabajo,cliente:this.listClients[c].nombres + " " + this.listClients[c].apellidos, vehiculo:"",usuario:"", tipo_orden:"",soporte:"",requerimiento:"", descripcion:"" });
                this.soporte = this.listSoportes[s].descripcion_soporte;
            }
          }
          for (let t = 0; t < this.listTipoOrden.length; t++) {
            if(this.listTipoOrden[t].id == this.listOrdenTrabajo[index].id_tipo_orden){
              //this.listOrden.push({id_orden_trabajo:this.listOrdenTrabajo[index].id_orden_trabajo,cliente:this.listClients[c].nombres + " " + this.listClients[c].apellidos, vehiculo:"",usuario:"", tipo_orden:"",soporte:"",requerimiento:"", descripcion:"" });
              this.tipoOrden= this.listTipoOrden[t].descripcion;
            }
          }
          for (let u = 0; u < this.listUsuario.length; u++) {
            if(this.listUsuario[u].id_usuario == this.listOrdenTrabajo[index].id_usuario){
              //this.listOrden.push({id_orden_trabajo:this.listOrdenTrabajo[index].id_orden_trabajo,cliente:this.listClients[c].nombres + " " + this.listClients[c].apellidos, vehiculo:"",usuario:"", tipo_orden:"",soporte:"",requerimiento:"", descripcion:"" });
            this.usuario = this.listUsuario[u].nombres + " " + this.listUsuario[u].apellidos;
            }
          }
          for (let v = 0; v < this.listVehiculo.length; v++) {
            if(this.listVehiculo[v].id_vehiculo == this.listOrdenTrabajo[index].id_vehiculo){
              //this.listOrden.push({id_orden_trabajo:this.listOrdenTrabajo[index].id_orden_trabajo,cliente:this.listClients[c].nombres + " " + this.listClients[c].apellidos, vehiculo:"",usuario:"", tipo_orden:"",soporte:"",requerimiento:"", descripcion:"" });
              this.vehiculo =this.listVehiculo[v].marca + " " + this.listVehiculo[v].color + " " + this.listVehiculo[v].placa;
            }
          }
          this.listOrden.push({id_orden_trabajo:this.listOrdenTrabajo[index].id_orden_trabajo, descripcion:this.listOrdenTrabajo[index].descripcion ,cliente:this.cliente, vehiculo:this.vehiculo,usuario:this.usuario, tipo_orden:this.tipoOrden,soporte:this.soporte,requerimiento:this.requerimiento});
          debugger
        }
      } else {
        console.log("No hay clientes registrados en el sistema");
      }
    });
}
// trae la lista de clientes
public getClientes(){
  this.clientService.getClientes().subscribe((r: any) => {
      if (r.length > 0) {
        this.listClients = r;
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
      } else {
        console.log("No hay clientes registrados en el sistema");
      }
    });
}

  public setSuggestion(event: any) {
    this.formClient.get('search')?.setValue(event);
    this.optionsSearch = [];
  }

  public toggleView(){
    this.currentView = !this.currentView
  }
  public OpenMenu(){
    this.isOpen = !this.isOpen;
  }
  public changeStatus(event: [boolean, number]) {
    if (event[1] == undefined) return;

    if (event[0] == false) {
      const dialog = this.openModal.OpenLogout(
        [`El cliente "${this.listClients[event[1]].nombres}" no podrá acceder al sistema`],
        '30rem',
        '¿Esta seguro de deshabilitar este usuario?',
      );

      dialog.componentInstance!.logoutEvent?.subscribe(_ => {
        this.ActiveOrDeactiveUser(event[1], event[0]);
      });
    } else this.ActiveOrDeactiveUser(event[1], event[0]);
  }

  public ActiveOrDeactiveUser(index: number, status: boolean): void {
  }




  public getValueForm = (id: string): string => this.formClient.get(id)?.value;

  public navigate(url: string, event?: any): void {
    if (event?.header === 'Editar')
      this.router.navigate([url, event.id]);
    else if (event?.header === 'Eliminar')
      this.deleteClient(event.id);
    // else if (event?.header === 'Detalles')
    //   this.showDetails(event.id);
    else
      this.router.navigateByUrl(url);
  }

 // Eliminar cliente
 public deleteClient(idClient: string) {
  const currentClient = this.listClients.find((client: Cliente) => client.id == idClient);
  if (!currentClient) return;

  const dialog = this.openModal.OpenLogout(
    [`El Cliente "${currentClient?.nombres}" no podrá acceder al sistema`],
    '30rem',
    '¿Esta seguro que desea eliminar este cliente?',
    'Esta acción es permanente'
  );

  dialog.componentInstance!.logoutEvent?.subscribe(_ => {
    this.clientService.deleteClienteById(currentClient.id)
    .subscribe((r: any) => {
          this.openModal.Open(1, [],`Cliente "${currentClient?.nombres}" eliminado correctamente!`, '25rem');
          this.getClientes();
      });
  });
}

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
