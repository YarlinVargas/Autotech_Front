import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, filter, finalize, takeUntil, tap } from 'rxjs';
import { TextLargeWindow } from 'src/app/core/constants/textLargeWindow';
import { openModals } from 'src/app/core/global/modals/openModal';
import { ToggleListEnum } from 'src/app/core/models/enums/toggleList.enum';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { FilterClientsPipe } from 'src/app/core/pipes/filter/filter-clients.pipe';
import { ClientService, Cliente } from 'src/app/core/services/client/client.service';

@Component({
  selector: 'app-gestor-cliente',
  templateUrl: './gestor-cliente.component.html',
  styleUrls: ['./gestor-cliente.component.scss']
})
export class GestorClienteComponent {

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

  listClients:Cliente[] = [];
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
    if (localStorage.getItem('perfilUser')) {
      this.perfilUser = JSON.parse(localStorage.getItem('perfilUser')!);
    }
    this.getClientes();
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
      this.deleteCliente(event.id);
    else
      this.router.navigateByUrl(url);
  }

 // Eliminar cliente
 public deleteCliente(idCliente: number) {
  const currentCliente = this.listClients.find((cliente: Cliente) => cliente.id_cliente == idCliente);
  if (!currentCliente) return;

  const dialog = this.openModal.OpenLogout(
    [`El cliente "${currentCliente?.nombres}" no podrá acceder al sistema`],
    '30rem',
    '¿Esta seguro que desea eliminar este cliente?',
    'Esta acción es permanente'
  );

  dialog.componentInstance!.logoutEvent?.subscribe(_ => {
    this.clientService.deleteClienteById(currentCliente.id_cliente)
    .subscribe((r: any) => {
          this.openModal.Open(1, [],`Cliente "${currentCliente?.nombres}" eliminado correctamente!`, '25rem');
          this.getClientes();
      });
  });
}

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
