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
import { ClientService, Cliente } from 'src/app/core/services/client/client.service';
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
  public formRequerimiento: FormGroup = new FormGroup({});
  public tooltip: TootilpOption = {
    enable: true,
    placement: 'top',
    showDelay: 0,
    hideDelay: 0,
  };

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private requirenmentService = inject(RequirenmentService);

  listRequerimientos:Requirenment[] = [];
  public optionsSearch: string[] = [];
  public listUser: Usuario[] = [];
  public listClients:Cliente[] = [];

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


  constructor(public dialog: Dialog, public pipe: FilterRequerimentsPipe, private eRef: ElementRef) {
    this.formRequerimiento = this.fb.group({
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
    this.getRequerimientos();
    this.formRequerimiento.get('search')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((value: string) => {
          this.optionsSearch = [];
        }),
        filter((value: string) => value.length > 2),
      )
      .subscribe((value: string) => {
        var resultPipe: any = this.pipe.transform(this.listRequerimientos, value);
        this.optionsSearch = resultPipe.results.map((requirenment: any) =>
          resultPipe.foundFields.map((field: string) => requirenment[field])
        ).flat();
      });

    this.currentLargeTextCard = TextLargeWindow.get(15, 20, 15, 25);
    this.currentLargeTextTable = TextLargeWindow.get(15);

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

  public setSuggestion(event: any) {
    this.formRequerimiento.get('search')?.setValue(event);
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
        [`El requerimiento "${this.listRequerimientos[event[1]].id_requerimiento}" no podrá ser accesible en el sistema`],
        '30rem',
        '¿Esta seguro de deshabilitar este requerimiento?',
      );

      dialog.componentInstance!.logoutEvent?.subscribe(_ => {
        this.ActiveOrDeactiveRequerimiento(event[1], event[0]);
      });
    } else this.ActiveOrDeactiveRequerimiento(event[1], event[0]);
  }

  public ActiveOrDeactiveRequerimiento(index: number, status: boolean): void {

  }

  public getValueForm = (id: string): string => this.formRequerimiento.get(id)?.value;

  public navigate(url: string, event?: any): void {
    if (event?.header === 'Editar')
      this.router.navigate([url, event.id]);
    else if (event?.header === 'Eliminar')
      this.deleteRequirenment(event.id);
    // else if (event?.header === 'Detalles')
    //   this.showDetails(event.id);
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

