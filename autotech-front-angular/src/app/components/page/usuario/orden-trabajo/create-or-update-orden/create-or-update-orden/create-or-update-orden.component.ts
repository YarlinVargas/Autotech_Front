import { Component, HostListener, Input, OnDestroy, OnInit, inject } from '@angular/core';

import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, finalize, tap } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { openModals } from 'src/app/core/global/modals/openModal';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { TextLargeWindow } from 'src/app/core/constants/textLargeWindow';
import { OrdenTrabajoService } from 'src/app/core/services/ordenTrabajo/ordenTrabajo.service';
import { ClientService, Cliente, ClienteReq } from 'src/app/core/services/client/client.service';
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

  public idOrden: number = 0;
  public isEdit: boolean = false;
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public currentCompanyNit: string = '';
  public colorsLinks: { associate: any, disassociate: any } = { associate: 'cyan', disassociate: 'neutral' };
  public lastIndexCompany!: number;

  listClients:ClienteReq[] = [];
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

  public ordenToUpdate: OrdenTrabajoModel = {
    id_orden_trabajo: 0,
    descripcion:'',
    id_estado:0,
    id_cliente: 0,
    id_vehiculo: 0,
    id_usuario: 0,
    id_tipo_orden: 0,
    id_soporte: 0,
    id_requerimiento: 0,
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
  private ordenTrabajoService = inject(OrdenTrabajoService);
  private activatedRoute = inject(ActivatedRoute);


  @Input() color = 'sky';
  @Input() id_client: string = 'select';
  @Input() defaultValue: string='Seleccione una opción';

  public openModal: openModals = new openModals(this.dialog);
  public currentLargeText = 10;

  constructor(public dialog: Dialog) {
    this.setFormOrden(this.ordenToUpdate);
  }

  public ngOnInit(): void {
    this.currentLargeText = TextLargeWindow.get(15);
    this.getClientes();
    this.getRequerimientos();
    this.getSoportes();
    this.getTiposOrdenes();
    this.getUsuarios();
    this.getVehiculos();
    if (this.router.url.includes('updateordenes')) {
      this.isEdit = true;
      this.GetOrdenes();
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
        console.log("No hay vehiculos registrados en el sistema");
      }
    });
}

// trae la lista de usuarios
public getUsuarios(){
  this.usuarioService.getUsuarios().subscribe((r: any) => {
      if (r.length > 0) {
        this.listUsuario = r;
      } else {
        console.log("No hay usuarios registrados en el sistema");
      }
    });
}

// trae la lista de tipos de ordenes
public getTiposOrdenes(){
  this.tipoOrdenService.getTiposOrden().subscribe((r: any) => {
      if (r.length > 0) {
        this.listTipoOrden = r;
      } else {
        console.log("No hay tipos de orden registrados en el sistema");
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
        console.log("No hay requerimientos registrados en el sistema");
      }
    });
}

private GetOrdenes(): void {
  const idOrden = this.activatedRoute.snapshot.paramMap.get('id');
  this.idOrden = parseInt(idOrden!);
  if (!idOrden)
    this.router.navigateByUrl('/orders');

  this.ordenTrabajoService.getOrdenTrabajoById(parseInt(idOrden!) ).subscribe(
    (r:any) => {
      console.log('Orden de trabajo actualizado correctamente');
      this.setFormOrden(r);
    },
    error => {
      console.error('Error al traer la orden de trabajo', error);
      this.router.navigateByUrl(`orders`);
    }
  );
}


  public setFormOrden(orden: OrdenTrabajoModel) {
    this.form = this.fb.group({
      id_orden_trabajo: [orden.id_orden_trabajo],
      descripcion:[orden.descripcion, Validators.required],
      id_estado:1,
      id_cliente:  [Number(orden.id_cliente) , Validators.required],
      id_vehiculo:  [Number(orden.id_vehiculo), Validators.required],
      id_usuario:  [Number(orden.id_usuario), Validators.required],
      id_tipo_orden:  [Number(orden.id_tipo_orden), Validators.required],
      id_soporte:  [Number(orden.id_soporte), Validators.required],
      id_requerimiento:  [Number(orden.id_requerimiento), Validators.required],
    });
  }

  public back = () => this.router.navigateByUrl('orders');

  public updateOrCreateOrden(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    let request: OrdenTrabajoModel = this.form.value;

    if(this.isEdit ){

      this.ordenTrabajoService.updateOrdenTrabajoById(this.idOrden, request).subscribe((r: any) => {

        console.log("Orden actualizado correctamente");
        this.router.navigateByUrl(`/orders`);
      });
    }else{
      this.ordenTrabajoService.createNewOrdenTrabajo(request).subscribe((r: any) => {

          console.log("Orden creado correctamente");
          this.router.navigateByUrl(`/orders`);

        });
    }
  }
  public getForm = (control: string) => this.form.get(control);

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

