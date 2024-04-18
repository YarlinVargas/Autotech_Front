import { Component, HostListener, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject} from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { openModals } from 'src/app/core/global/modals/openModal';
import { SpinnerService } from 'src/app/core/services/gen/spinner.service';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { TextLargeWindow } from 'src/app/core/constants/textLargeWindow';
import { Requirenment } from 'src/app/core/services/requirenment/models/requirenment';
import { RequirenmentService } from 'src/app/core/services/requirenment/requirenment.service';
import { Usuario, UsuarioService } from 'src/app/core/services/usuario/usuario.service';
import { ClientService, Cliente, ClienteReq } from 'src/app/core/services/client/client.service';

@Component({
  selector: 'app-create-or-update-requirenment',
  templateUrl: './create-or-update-requirenment.component.html',
  styleUrls: ['./create-or-update-requirenment.component.scss']
})
export class CreateOrUpdateRequirenmentComponent {

  public idRequirenment: number = 0;
  public isEdit: boolean = false;
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public currentCompanyNit: string = '';
  public colorsLinks: { associate: any, disassociate: any } = { associate: 'cyan', disassociate: 'neutral' };
  public lastIndexCompany!: number;

  listRequerimientos:Requirenment[] = [];
  public listUser: Usuario[] = [];
  public listClients:ClienteReq[] = [];

  public tooltip: TootilpOption = {
    enable: true,
    placement: 'top',
    showDelay: 0,
    hideDelay: 0,
  };

  public requirenmentToUpdate: Requirenment = {
    id_requerimiento: 0,
    fecha: new Date(),
    id_cliente: 0,
    id_usuario: 0,
    id_estado: 0,
    descripcion_requerimiento: '',
  };

  public form: FormGroup = new FormGroup({});

  private clientService = inject(ClientService);
  private _usuarioService = inject(UsuarioService);
  private requirenmentService = inject(RequirenmentService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  @Input() color = 'sky';
  @Input() id_requirenment: string = 'select';
  @Input() defaultValue: string='Seleccione una opción';

  public openModal: openModals = new openModals(this.dialog);
  public currentLargeText = 10;

  constructor(public dialog: Dialog) {
    this.setFormRequirenment(this.requirenmentToUpdate);

  }

  public ngOnInit(): void {
    this.getRequerimientos();
    this.getUsuarios();
    this.getClientes();
    this.currentLargeText = TextLargeWindow.get(15);

    if (this.router.url.includes('updateRequirement')) {
      this.isEdit = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.currentLargeText = TextLargeWindow.get(15);
  }
// trae la lista de usuarios
public getUsuarios(){
  this._usuarioService.getUsuarios().subscribe((r: any) => {
      if (r.length > 0) {
        this.listUser = r;

      } else {
        console.log("No hay usuarios registrados en el sistema");
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
//trae la lista de requerimientos
public getRequerimientos(){
  this.requirenmentService.getRequerimientos().subscribe((r: any) => {
      if (r.length > 0) {
        this.listRequerimientos = r;

      } else {
        console.log("No hay requerimientos registrados en el sistema");
      }
    });
}

  public setFormRequirenment(requirenment: Requirenment) {
    this.form = this.fb.group({
      id: [requirenment.id_requerimiento],
      fecha: [requirenment.fecha],
      id_cliente: [requirenment.id_cliente, Validators.required],
      id_usuario: [requirenment.id_usuario, [Validators.required, Validators.minLength(1)]],
      id_estado: 1,
      descripcion_requerimiento: [requirenment.descripcion_requerimiento, [Validators.required, Validators.minLength(1)]],

    });
  }

  public back = () => this.router.navigateByUrl('requirement');

  public updateOrCreateRequirenment(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    let request: Requirenment = this.form.value;

    if(this.isEdit ){

      this.requirenmentService.updateRequerimientoById(this.idRequirenment, request).subscribe((r: any) => {

        console.log("Requerimiento actualizado correctamente");
        this.router.navigateByUrl(`/requirement`);
      });
    }else{

      // this.spinnerSvc.show();
      this.requirenmentService.createNewRequerimiento(request).subscribe((r: any) => {

          console.log("Requerimiento creado correctamente");
          this.router.navigateByUrl(`/requirement`);

        });
    }

  }

  public getForm = (control: string) => this.form.get(control);

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

