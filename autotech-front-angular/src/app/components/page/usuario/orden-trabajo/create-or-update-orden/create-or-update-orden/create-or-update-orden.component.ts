import { Component, HostListener, Input, OnDestroy, OnInit, inject } from '@angular/core';

import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RespService } from 'src/app/core/models/general/resp-service.model';
import { Subject, finalize, tap } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { openModals } from 'src/app/core/global/modals/openModal';
import { SpinnerService } from 'src/app/core/services/gen/spinner.service';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { TextLargeWindow } from 'src/app/core/constants/textLargeWindow';
import { CreateUpdateClient } from 'src/app/core/services/client/models/create-update-client.model';
import { ClientService, Cliente } from 'src/app/core/services/client/client.service';
import { SoporteModel, SoporteService } from 'src/app/core/services/soporte/soporte.service';
import { VehiculoModel } from 'src/app/core/models/vehiculo/vehiculo.model';
import { ListOrdenTrabajo, OrdenTrabajoModel } from 'src/app/core/models/orden-trabajo/orden-trabajo.model';
import { Usuario, UsuarioService } from 'src/app/core/services/usuario/usuario.service';
import { Requirenment } from 'src/app/core/services/requirenment/models/requirenment';
import { TipoOrdenModel, TipoOrdenTrabajoService } from 'src/app/core/services/tipoOrden/tipo-orden.service';
import { VehiculoService } from 'src/app/core/services/vehiculo/vehiculo.service';
import { RequirenmentService } from 'src/app/core/services/requirenment/requirenment.service';

@Component({
  selector: 'app-create-or-update-orden',
  templateUrl: './create-or-update-orden.component.html',
  styleUrls: ['./create-or-update-orden.component.scss']
})
export class CreateOrUpdateOrdenComponent {

  public idClient: number = 0;
  public isEdit: boolean = false;
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public currentCompanyNit: string = '';
  public colorsLinks: { associate: any, disassociate: any } = { associate: 'cyan', disassociate: 'neutral' };
  public lastIndexCompany!: number;

  listClients:Cliente[] = [];
  listSoportes:SoporteModel[] = [];
  listVehiculo: VehiculoModel[] = [];
  listOrdenTrabajo: OrdenTrabajoModel[] = [];
  listOrden:ListOrdenTrabajo[] = [];
  listUsuario: Usuario[] = [];
  listTipoOrden: TipoOrdenModel[] =[];
  listRequerimientos: Requirenment[]=[];

  public tooltip: TootilpOption = {
    enable: true,
    placement: 'top',
    showDelay: 0,
    hideDelay: 0,
  };

  public ordenToUpdate: ListOrdenTrabajo = {
    id_orden_trabajo: 0,
    descripcion: '',
    cliente: '',
    vehiculo: '',
    usuario: '',
    tipo_orden: '',
    soporte: '',
    requerimiento: ''
  };


  public form: FormGroup = new FormGroup({});

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private clientService = inject(ClientService);
  private usuarioService = inject(UsuarioService);
  private soporteService = inject(SoporteService);
  private vehiculoService = inject(VehiculoService);
  private tipoOrdenService = inject(TipoOrdenTrabajoService);
  private requirenmentService = inject(RequirenmentService);

  @Input() color = 'sky';
  @Input() id_client: string = 'select';
  @Input() defaultValue: string='Seleccione una opción';

  public openModal: openModals = new openModals(this.dialog);
  public currentLargeText = 10;

  constructor(public dialog: Dialog) {
    this.setFormClient(this.ordenToUpdate);
  }

  public ngOnInit(): void {
    this.currentLargeText = TextLargeWindow.get(15);

    if (this.router.url.includes('updateClient')) {
      this.isEdit = true;
      this.getClientes();
      this.getRequerimientos();
      this.getSoportes();
      this.getTiposOrdenes();
      this.getUsuarios();
      this.getVehiculos();
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.currentLargeText = TextLargeWindow.get(15);
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



  public setFormClient(orden: ListOrdenTrabajo) {
    this.form = this.fb.group({
      id_orden_trabajo: [orden.id_orden_trabajo],
      // nombres: [client.nombres, [Validators.required, Validators.minLength(1)]],
      // apellidos: [client.apellidos, [Validators.required, Validators.minLength(1)]],
      // direccion: [client.direccion, Validators.required],
      // telefono: [client.telefono, Validators.required],
      // email: [
      //   client.email,
      //   [
      //     Validators.required,
      //     Validators.email,
      //   ]
      // ],
      // documento_identidad: [client.documento_identidad, Validators.required],
      // fecha_nacimiento: [client.fecha_nacimiento, Validators.required],

    });
  }

  public back = () => this.router.navigateByUrl('client');

  public updateOrCreateClient(): void {
    debugger
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    let request: Cliente = this.form.value;

    if(this.isEdit ){

      this.clientService.updateClienteById(this.idClient, request).subscribe((r: any) => {

        console.log("Cliente actualizado correctamente");
        this.router.navigateByUrl(`/client`);
      });
    }else{

      // this.spinnerSvc.show();
      this.clientService.createNewCliente(request).subscribe((r: any) => {

          console.log("Cliente creado correctamente");
          this.router.navigateByUrl(`/client`);

        });
    }
  }
  public getForm = (control: string) => this.form.get(control);

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

