import { Component, HostListener, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, finalize, tap } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { openModals } from 'src/app/core/global/modals/openModal';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { TextLargeWindow } from 'src/app/core/constants/textLargeWindow';
import { ClientService, Cliente } from 'src/app/core/services/client/client.service';
import { PerfilModel } from 'src/app/core/models/general/perfil.model';
import { GeneralService } from 'src/app/core/services/gen/general.service';


@Component({
  selector: 'app-create-or-update-client',
  templateUrl: './create-or-update-client.component.html',
  styleUrls: ['./create-or-update-client.component.scss']
})
export class CreateOrUpdateClientComponent {

  public idClient: number = 0;
  public isEdit: boolean = false;
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public currentCompanyNit: string = '';
  public colorsLinks: { associate: any, disassociate: any } = { associate: 'cyan', disassociate: 'neutral' };
  public lastIndexCompany!: number;

  public tooltip: TootilpOption = {
    enable: true,
    placement: 'top',
    showDelay: 0,
    hideDelay: 0,
  };

  public clientToUpdate: Cliente = {
    id_cliente: 0,
    nombres:'',
    apellidos: '',
    Direccion: '',
    telefono:'',
    email: '',
    documento_identidad: '',
    fecha_nacimiento:'',
    id_estado:0,
  };


  public form: FormGroup = new FormGroup({});

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  @Input() color = 'sky';
  @Input() id_client: string = 'select';
  @Input() defaultValue: string='Seleccione una opción';

  public openModal: openModals = new openModals(this.dialog);
  public currentLargeText = 10;

  constructor(public dialog: Dialog, public clientService: ClientService) {
    this.setFormClient(this.clientToUpdate);
  }

  public ngOnInit(): void {
    this.currentLargeText = TextLargeWindow.get(15);

    if (this.router.url.includes('updateClient')) {
      this.isEdit = true;
      this.GetClient();
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.currentLargeText = TextLargeWindow.get(15);
  }


  private GetClient(): void {
    const idClient = this.activatedRoute.snapshot.paramMap.get('id');
    debugger
    this.idClient = parseInt(idClient!);
    if (!idClient)
      this.router.navigateByUrl('/client');

    this.clientService.getClienteById(parseInt(idClient!) ).subscribe(
      (r:any) => {
        console.log('Cliente actualizado correctamente');
        this.setFormClient(r);
      },
      error => {
        console.error('Error al actualizar el cliente', error);
        this.router.navigateByUrl(`client`);
      }
    );
  }



  public setFormClient(client: Cliente) {
    this.form = this.fb.group({
      id: [client.id_cliente],
      nombres: [client.nombres, [Validators.required, Validators.minLength(1)]],
      apellidos: [client.apellidos, [Validators.required, Validators.minLength(1)]],
      direccion: [client.Direccion, Validators.required],
      telefono: [client.telefono, Validators.required],
      email: [
        client.email,
        [
          Validators.required,
          Validators.email,
        ]
      ],
      documento_identidad: [client.documento_identidad, Validators.required],
      fecha_nacimiento: [client.fecha_nacimiento, Validators.required],

    });
  }

  public back = () => this.router.navigateByUrl('client');

  public updateOrCreateClient(): void {
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
