import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, filter, finalize, takeUntil, tap } from 'rxjs';
import { TextLargeWindow } from 'src/app/core/constants/textLargeWindow';
import { openModals } from 'src/app/core/global/modals/openModal';
import { ToggleListEnum } from 'src/app/core/models/enums/toggleList.enum';
import { RespService } from 'src/app/core/models/general/resp-service.model';
import { dataModal } from 'src/app/core/models/modals/moda-data.model';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { ListUser, ListUsuario } from 'src/app/core/models/user/list-user.model';
import { FilterUsersPipe } from 'src/app/core/pipes/filter/filter-users.pipe';
import { SpinnerService } from 'src/app/core/services/gen/spinner.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ModalDetalleUsuarioComponent } from 'src/app/core/shared/modals/modal-detalle-usuario/modal-detalle-usuario.component';

@Component({
  selector: 'app-gestor-usuario',
  templateUrl: './gestor-usuario.component.html',
  styleUrls: ['./gestor-usuario.component.scss']
})
export class GestorUsuarioComponent implements OnInit, OnDestroy {

  public currentView:boolean=true;
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
  private userService = inject(UserService);
  private spinnerSvc = inject(SpinnerService);

  public listUsers: ListUser[] = [];

  listUsusarios:ListUsuario[] = [
    { idUser: 1, userName:'ximena.vargas', name: 'ximena', lastName: 'vargas', identificationNumber: '111111', dateBirthday: '26/10/1994', email: 'yarlin@hotmail.com', active:true},
    { idUser: 2, userName:'daniela.agudelo',name: 'Daniela', lastName: 'agudelo', identificationNumber: '222222', dateBirthday: '26/10/1994', email: 'daniela@hotmail.com', active:true},
    { idUser: 3, userName:'melissa.arias',name: 'melissa', lastName: 'arias', identificationNumber: '333333', dateBirthday: '26/10/1994', email: 'melissa@hotmail.com', active:true }
  ];
  public optionsSearch: string[] = [];

  public currentLargeTextCard = 10;
  public currentLargeTextTable = 10;
  public openModal: openModals = new openModals(this.dialog);
  public destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('Detalle')
  Detalle!: TemplateRef<any>;

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


  constructor(public dialog: Dialog, public pipe: FilterUsersPipe, private eRef: ElementRef) {
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
    this.form.get('search')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((value: string) => {
          this.optionsSearch = [];
        }),
        filter((value: string) => value.length > 2),
      )
      .subscribe((value: string) => {
        var resultPipe: any = this.pipe.transform(this.listUsusarios, value);
        this.optionsSearch = resultPipe.results.map((user: any) =>
          resultPipe.foundFields.map((field: string) => user[field])
        ).flat();
      });

    this.currentLargeTextCard = TextLargeWindow.get(15, 20, 15, 25);
    this.currentLargeTextTable = TextLargeWindow.get(15);

    // this.spinnerSvc.show();
    //   this.userService.Consult().
    //   pipe(
    //     finalize(() => {
    //       this.spinnerSvc.hide();
    //     })
    //   ).
    // subscribe((resp: RespService) => {
    //   this.listUsers = resp.data;
    // });
  }

  public setSuggestion(event: any) {
    this.form.get('search')?.setValue(event);
    this.optionsSearch = [];
  }

  public toggleView(){
    this.currentView = !this.currentView
  }

  public changeStatus(event: [boolean, number]) {
    if (event[1] == undefined) return;

    if (event[0] == false) {
      const dialog = this.openModal.OpenLogout(
        [`El usuario "${this.listUsusarios[event[1]].userName}" no podrá acceder al sistema`],
        '30rem',
        '¿Esta seguro de deshabilitar este usuario?',
      );

      dialog.componentInstance!.logoutEvent?.subscribe(_ => {
        this.ActiveOrDeactiveUser(event[1], event[0]);
      });
    } else this.ActiveOrDeactiveUser(event[1], event[0]);
  }

  public ActiveOrDeactiveUser(index: number, status: boolean): void {
    this.userService.ActiveOrDeactive(this.listUsusarios[index].idUser)
      .pipe(
        tap((resp: RespService) => {
          if (resp.ok) {
            this.listUsers[index].active = status;
          }
        }),
        finalize(() => {
          this.spinnerSvc.hide();
        })
      )
      .subscribe((resp: RespService) => {
        if (resp.ok == true) {
          if (status)
            this.openModal.Open(1, [], '¡Usuario habilitado con éxito!', '25rem');
          else
            this.openModal.Open(3, [], '¡Usuario deshabilitado correctamente!', '25rem', 'amber');
        } else
          this.openModal.Open(
            2,
            [],
            status ? `¡El usuario no se ha habilitado!`: '¡El usuario no se ha deshabilitado!',
            '25rem'
          );
      });
  }

  public getValueForm = (id: string): string => this.form.get(id)?.value;

  public navigate(url: string, event?: any): void {
    if (event?.header === 'Editar')
      this.router.navigate([url, event.id]);
    else if (event?.header === 'Eliminar')
      this.deleteUser(event.id);
    else if (event?.header === 'Detalles')
      this.showDetails(event.id);
    else
      this.router.navigateByUrl(url);
  }

  public deleteUser(idUser: number) {
    const currentUser = this.listUsers.find((user: ListUser) => user.idUser == idUser);
    if (!currentUser) return;

    const dialog = this.openModal.OpenLogout(
      [`El usuario "${currentUser?.userName}" no podrá acceder al sistema`],
      '30rem',
      '¿Esta seguro que desea eliminar este usuario?',
      'Esta acción es permanente'
    );

    dialog.componentInstance!.logoutEvent?.subscribe(_ => {
      this.userService.Delete(currentUser.idUser)
        .pipe(
          tap((resp: RespService) => {
            if (resp.ok) {
              this.listUsers = this.listUsers.filter((user: ListUser) => user.idUser != idUser);
            }
          }),
          finalize(() => {
            this.spinnerSvc.hide();
          })
        )
        .subscribe((resp: RespService) => {
          if (resp.ok == true)
            this.openModal.Open(1, [], '¡Usuario eliminado correctamente!', '25rem');
          else
            this.openModal.Open(2, [], '¡El usuario no se ha eliminado!', '25rem');
        });
    });
  }

  showDetails(id: number) {
    const dataSend: any = {
      idUser: id,
      firstButton: {
        label: 'Cerrar',
      },
      footer: true
   }

   const isMobile = window.innerWidth < 768;

    const dialogRef = this.dialog.open(ModalDetalleUsuarioComponent, {
      width: '100%',
      height: '100%',
      data: dataSend,
      maxWidth: isMobile ? '90%' : '80%',
      maxHeight: '90%',
      disableClose: true,
    });

    dialogRef.componentInstance!.primaryEvent?.subscribe(() => {
      dialogRef.close();
    });

    // this.Detail(id);
    // const destroy$: Subject<boolean> = new Subject<boolean>();

    // const data: any = {
    //   content: this.Detalle,
    //   btn2: 'Cerrar',
    //   error: false,
    //   footer: true
    // };

    // const dialogRef = this.dialog.open(ModalDetalleUsuarioComponent, { data, width: '80em', disableClose: true });

    // dialogRef.componentInstance!. secondaryEvent?.pipe(takeUntil(destroy$)).subscribe(() => {
    //   dialogRef.close();
    // });
  }

  // Detail(idUser: number) {
  //   this.spinnerSvc.show();
  //   this.userService.GetDetails(idUser)
  //   .pipe(
  //     finalize(() => {
  //       this.spinnerSvc.hide();
  //     })
  //   )
  //   .subscribe((resp: RespService) => {
  //     if (resp.data != null) {
  //       this.listDetail = resp.data.data;
  //       this.listPlans = resp.data.plans;
  //     }
  //   })
  // }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
