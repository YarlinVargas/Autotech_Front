import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, filter, finalize, takeUntil, tap } from 'rxjs';
import { TextLargeWindow } from 'src/app/core/constants/textLargeWindow';
import { openModals } from 'src/app/core/global/modals/openModal';
import { ToggleListEnum } from 'src/app/core/models/enums/toggleList.enum';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { FilterRequerimentsPipe } from 'src/app/core/pipes/filter/filter-requirenments.pipe';
import { ClientService, Cliente, ClienteReq } from 'src/app/core/services/client/client.service';
import { ListRequirenment, Requirenment } from 'src/app/core/services/requirenment/models/requirenment';
import { RequirenmentService } from 'src/app/core/services/requirenment/requirenment.service';
import { Usuario, UsuarioService } from 'src/app/core/services/usuario/usuario.service';



@Component({
  selector: 'app-gestor-requerimientos',
  templateUrl: './gestor-requerimientos.component.html',
  styleUrls: ['./gestor-requerimientos.component.scss']
})
export class GestorRequerimientosComponent {
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
  private requirenmentService = inject(RequirenmentService);
  private clientService = inject(ClientService);
  private usuarioService = inject(UsuarioService);

  listRequerimientos:Requirenment[] = [];
  listReq:ListRequirenment[] = [];
  listaReq:ListRequirenment[] = [];
  public optionsSearch: string[] = [];
  public listUser: Usuario[] = [];
  public listClients:ClienteReq[] = [];

  public currentLargeTextCard = 10;
  public currentLargeTextTable = 10;
  public openModal: openModals = new openModals(this.dialog);
  public destroy$: Subject<boolean> = new Subject<boolean>();

  cliente:string= "";
  usuario:string= "";

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


  constructor(public dialog: Dialog, public pipe: FilterRequerimentsPipe, private eRef: ElementRef) {
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
        var resultPipe: any = this.pipe.transform(this.listaReq, value);
        this.optionsSearch = resultPipe.results.map((requirenment: any) =>
          resultPipe.foundFields.map((field: string) => requirenment[field])
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
        this.getUsuarios();
      } else {
        console.log("No hay clientes registrados en el sistema");
      }
    });
}

// trae la lista de usuarios
public getUsuarios(){
  this.usuarioService.getUsuarios().subscribe((r: any) => {
      if (r.length > 0) {
        this.listUser = r;
        this.getRequerimientos();
      } else {
        console.log("No hay usuarios registrados en el sistema");
      }
    });
}

//trae la lista de requerimientos
public getRequerimientos(){

  this.requirenmentService.getRequerimientos().subscribe((r: any) => {
      if (r.length > 0) {
        this.listRequerimientos = r;

        for (let index = 0; index < this.listRequerimientos.length; index++) {
          for (let c = 0; c < this.listClients.length; c++) {
            if(this.listClients[c].id_cliente == this.listRequerimientos[index].id_cliente){
              this.cliente = this.listClients[c].nombres + " " + this.listClients[c].apellidos;
            }
          }

          for (let u = 0; u < this.listUser.length; u++) {
            if(this.listUser[u].id_usuario == this.listRequerimientos[index].id_usuario){
            this.usuario = this.listUser[u].nombres + " " + this.listUser[u].apellidos;
            }
          }

          this.listReq.push({id_requerimiento:this.listRequerimientos[index].id_requerimiento, fecha:this.listRequerimientos[index].fecha ,cliente:this.cliente, usuario:this.usuario, descripcion_requerimiento:this.listRequerimientos[index].descripcion_requerimiento});
          this.listaReq=this.listReq;
        }
      } else {
        console.log("No hay requerimientos registrados en el sistema");
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
      this.deleteRequirenment(event.id);
    else
      this.router.navigateByUrl(url);
  }

  // Eliminar usuario
  public deleteRequirenment(idRequirenment: number) {
    const currentReq = this.listRequerimientos.find((requirenment: Requirenment) => requirenment.id_requerimiento == idRequirenment);
    if (!currentReq) return;

    const dialog = this.openModal.OpenLogout(
      [`El requerimiento "${currentReq?.id_requerimiento}" no podrá acceder al sistema`],
      '30rem',
      '¿Esta seguro que desea eliminar este requerimiento?',
      'Esta acción es permanente'
    );

    dialog.componentInstance!.logoutEvent?.subscribe(_ => {
      this.requirenmentService.deleteRequerimientoById(currentReq.id_requerimiento)
      .subscribe((r: any) => {
            this.openModal.Open(1, [],`Requerimiento "${currentReq?.id_requerimiento}" eliminado correctamente!`, '25rem');
            this.getRequerimientos();
        });
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

