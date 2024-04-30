import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject} from 'rxjs';
import { TextLargeWindow } from 'src/app/core/constants/textLargeWindow';
import { openModals } from 'src/app/core/global/modals/openModal';
import { ToggleListEnum } from 'src/app/core/models/enums/toggleList.enum';
import { ListNotifications } from 'src/app/core/models/notification/list_notification.model';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { FilterClientsPipe } from 'src/app/core/pipes/filter/filter-clients.pipe';
import { ClientService } from 'src/app/core/services/client/client.service';

@Component({
  selector: 'app-gestor-notificacion',
  templateUrl: './gestor-notificacion.component.html',
  styleUrls: ['./gestor-notificacion.component.scss']
})
export class GestorNotificacionComponent {
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

  listNotification:ListNotifications[] = [
    { id_recordatorio: 1, name:'Felipe Lopez', email: 'felipe@gmail.com', phoneNumber: '9452687',fecha:'12/01/1985',   active:true},
    { id_recordatorio: 2, name:'Juliana Ramirez', email: 'juliana@gmail.com', phoneNumber: '98848888',fecha:'12/01/1985',  active:true},
    { id_recordatorio: 3, name:'Susana Cardenas', email: 'susana@gmail.com', phoneNumber: '8818049',  fecha:'12/01/1985', active:true }
  ];
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


  constructor(public dialog: Dialog, public pipe: FilterClientsPipe, private eRef: ElementRef) {
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

    this.currentLargeTextCard = TextLargeWindow.get(15, 20, 15, 25);
    this.currentLargeTextTable = TextLargeWindow.get(15);

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


  public getValueForm = (id: string): string => this.formClient.get(id)?.value;

  public navigate(url: string, event?: any): void {
    if (event?.header === 'Editar')
      this.router.navigate([url, event.id]);
    else if (event?.header === 'Eliminar')
      this.deleteClient(event.id);
    else
      this.router.navigateByUrl(url);
  }

  public deleteClient(id_recordatorio: number) {

  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

