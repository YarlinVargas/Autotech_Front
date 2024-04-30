import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, filter, takeUntil, tap} from 'rxjs';
import { TextLargeWindow } from 'src/app/core/constants/textLargeWindow';
import { openModals } from 'src/app/core/global/modals/openModal';
import { ToggleListEnum } from 'src/app/core/models/enums/toggleList.enum';
import { ListNotifications } from 'src/app/core/models/notification/list_notification.model';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { FilterClientsPipe } from 'src/app/core/pipes/filter/filter-clients.pipe';
import { FilterNotificationPipe } from 'src/app/core/pipes/filter/filter-notification.pipe';
import { ClientService, ClienteReq } from 'src/app/core/services/client/client.service';
import { Recordatorio, RecordatorioModule, RecordatorioService } from 'src/app/core/services/recordatorio/recordatorio.service';

@Component({
  selector: 'app-gestor-notificacion',
  templateUrl: './gestor-notificacion.component.html',
  styleUrls: ['./gestor-notificacion.component.scss']
})
export class GestorNotificacionComponent {
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

  listNotification:Recordatorio[] = [];
  lstNotification:RecordatorioModule[] = [];
  lstRecordatorio:RecordatorioModule[] = [];
  listClients:ClienteReq[] = [];
  public optionsSearch: string[] = [];

  cliente:string = "";
  email:string = "";

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


  constructor(public dialog: Dialog, public pipe: FilterNotificationPipe, private eRef: ElementRef, private recordatorioService: RecordatorioService) {
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
        var resultPipe: any = this.pipe.transform(this.lstRecordatorio, value);
        this.optionsSearch = resultPipe.results.map((user: any) =>
          resultPipe.foundFields.map((field: string) => user[field])
        ).flat();
      });
    this.currentLargeTextCard = TextLargeWindow.get(15, 20, 15, 25);
    this.currentLargeTextTable = TextLargeWindow.get(15);

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
  // trae la lista de clientes
public getClientes(){
  this.clientService.getClientes().subscribe((r: any) => {
      if (r.length > 0) {
        this.listClients = r;
        this.getNotificacion();
      } else {
        console.log("No hay clientes registrados en el sistema");
      }
    });
}
// trae la lista de ordenes de trabajo
public getNotificacion(){

  this.recordatorioService.getRecordatorios().subscribe((r: any) => {
      if (r.length > 0) {
        this.listNotification = r;

        for (let index = 0; index < this.listNotification.length; index++) {
          for (let c = 0; c < this.listClients.length; c++) {
            if(this.listClients[c].id_cliente == this.listNotification[index].id_cliente){
              this.cliente = this.listClients[c].nombres + " " + this.listClients[c].apellidos;
              this.email = this.listClients[c].email;
            }
          }

          this.lstNotification.push({id_recordatorio:this.listNotification[index].id_recordatorio, nombre:this.cliente ,email:this.email, fecha:this.listNotification[index].fecha});
          this.lstRecordatorio = this.lstNotification;
        }
      } else {
        console.log("No hay ordenes registrados en el sistema");
      }
    });
}

  public getValueForm = (id: string): string => this.form.get(id)?.value;

  public navigate(url: string, event?: any): void {
    if (event?.header === 'Editar')
      this.router.navigate([url, event.id]);
    else if (event?.header === 'Eliminar')
      this.deleteRecordatorio(event.id);
    else
      this.router.navigateByUrl(url);
  }

  // Eliminar recordatorio
  public deleteRecordatorio(idRecordatorio: number) {
    const currentRecordatorio = this.listNotification.find((recordatorio: Recordatorio) => recordatorio.id_recordatorio == idRecordatorio);
    if (!currentRecordatorio) return;

    const dialog = this.openModal.OpenLogout(
      [`La Notificacion "${currentRecordatorio?.id_recordatorio}" no podrá acceder al sistema`],
      '30rem',
      '¿Esta seguro que desea eliminar esta notificacion?',
      'Esta acción es permanente'
    );

    dialog.componentInstance!.logoutEvent?.subscribe(_ => {
      this.recordatorioService.deleteRecordatorioById(currentRecordatorio.id_recordatorio)
      .subscribe((r: any) => {
            this.openModal.Open(1, [],`Notificacion "${currentRecordatorio?.id_recordatorio}" eliminado correctamente!`, '25rem');
            this.getNotificacion();
        });
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

