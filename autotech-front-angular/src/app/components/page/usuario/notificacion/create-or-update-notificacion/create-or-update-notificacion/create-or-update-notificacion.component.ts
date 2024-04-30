import { Component, HostListener, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { openModals } from 'src/app/core/global/modals/openModal';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { TextLargeWindow } from 'src/app/core/constants/textLargeWindow';
import { Usuario, UsuarioService } from 'src/app/core/services/usuario/usuario.service';
import { ClientService, ClienteReq } from 'src/app/core/services/client/client.service';
import { Recordatorio, RecordatorioService } from 'src/app/core/services/recordatorio/recordatorio.service';

@Component({
  selector: 'app-create-or-update-notificacion',
  templateUrl: './create-or-update-notificacion.component.html',
  styleUrls: ['./create-or-update-notificacion.component.scss']
})
export class CreateOrUpdateNotificacionComponent {

  public idRecordatorio: number = 0;
  public isEdit: boolean = false;
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public currentCompanyNit: string = '';
  public colorsLinks: { associate: any, disassociate: any } = { associate: 'cyan', disassociate: 'neutral' };
  public lastIndexCompany!: number;

  listClients:ClienteReq[] = [];
  listUsuario: Usuario[] = [];
  listNotificacion: Notification[] =[];

  public tooltip: TootilpOption = {
    enable: true,
    placement: 'top',
    showDelay: 0,
    hideDelay: 0,
  };

  public recordatorioToUpdate: Recordatorio = {
    id_recordatorio: 0,
    fecha:'',
    id_cliente: 0,
    id_usuario: 0,
    eliminado: 0,
  };


  public form: FormGroup = new FormGroup({});

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private clientService = inject(ClientService);
  private usuarioService = inject(UsuarioService);
  private recordatorioService = inject(RecordatorioService);
  private activatedRoute = inject(ActivatedRoute);


  @Input() color = 'sky';
  @Input() id_recordatorio: string = 'select';
  @Input() defaultValue: string='Seleccione una opción';

  public openModal: openModals = new openModals(this.dialog);
  public currentLargeText = 10;

  constructor(public dialog: Dialog) {
    this.setFormNotification(this.recordatorioToUpdate);
  }

  public ngOnInit(): void {
    this.currentLargeText = TextLargeWindow.get(15);
    this.getClientes();
    this.getUsuarios();
    if (this.router.url.includes('updateNotification')) {
      this.isEdit = true;
      this.GetNotification();
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


private GetNotification(): void {
  const idNotification = this.activatedRoute.snapshot.paramMap.get('id');
  this.idRecordatorio = parseInt(idNotification!);
  if (!idNotification)
    this.router.navigateByUrl('/notification');

  this.recordatorioService.getRecordatorioById(parseInt(idNotification!) ).subscribe(
    (r:any) => {
      console.log('Notificacion actualizada correctamente');
      this.setFormNotification(r);
    },
    error => {
      console.error('Error al traer la orden de trabajo', error);
      this.router.navigateByUrl(`notification`);
    }
  );
}


  public setFormNotification(recordatorio: Recordatorio) {
    this.form = this.fb.group({
      id_recordatorio: [recordatorio.id_recordatorio],
      fecha:[recordatorio.fecha, Validators.required],
      id_cliente:  [Number(recordatorio.id_cliente) , Validators.required],
      id_usuario:  [Number(recordatorio.id_usuario), Validators.required],
      eliminado:  0,
    });
  }

  public back = () => this.router.navigateByUrl('notification');

  public updateOrCreateNotification(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    let request: Recordatorio = this.form.value;

    if(this.isEdit ){

      this.recordatorioService.updateRecordatorioById(this.idRecordatorio, request).subscribe((r: any) => {

        console.log("Recordatorio actualizado correctamente");
        this.router.navigateByUrl(`/notification`);
      });
    }else{
      this.recordatorioService.createNewRecordatorio(request).subscribe((r: any) => {

          console.log("Recordatorio creado correctamente");
          this.router.navigateByUrl(`/notification`);

        });
    }
  }
  public getForm = (control: string) => this.form.get(control);

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
