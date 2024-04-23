import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, filter, finalize, takeUntil, tap } from 'rxjs';
import { TextLargeWindow } from 'src/app/core/constants/textLargeWindow';
import { openModals } from 'src/app/core/global/modals/openModal';
import { ToggleListEnum } from 'src/app/core/models/enums/toggleList.enum';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { ListUsuario } from 'src/app/core/models/user/list-user.model';
import { FilterUsersPipe } from 'src/app/core/pipes/filter/filter-users.pipe';
import { SpinnerService } from 'src/app/core/services/gen/spinner.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { Usuario, UsuarioService } from 'src/app/core/services/usuario/usuario.service';

@Component({
  selector: 'app-gestor-usuario',
  templateUrl: './gestor-usuario.component.html',
  styleUrls: ['./gestor-usuario.component.scss']
})
export class GestorUsuarioComponent implements OnInit, OnDestroy {

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
  private userService = inject(UserService);
  private spinnerSvc = inject(SpinnerService);

  public listUsuarios: ListUsuario[] = [];
  public listUser: Usuario[] = [];

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


  constructor(public dialog: Dialog, public pipe: FilterUsersPipe, private eRef: ElementRef, private _usuarioService: UsuarioService) {
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
//inicializar componente
  public ngOnInit(): void {
    this.getUsuarios();
    this.form.get('search')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((value: string) => {
          this.optionsSearch = [];
        }),
        filter((value: string) => value.length > 2),
      )
      .subscribe((value: string) => {
        var resultPipe: any = this.pipe.transform(this.listUser, value);
        this.optionsSearch = resultPipe.results.map((user: any) =>
          resultPipe.foundFields.map((field: string) => user[field])
        ).flat();
      });

    this.currentLargeTextCard = TextLargeWindow.get(15, 20, 15, 25);
    this.currentLargeTextTable = TextLargeWindow.get(15);

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
      this.deleteUser(event.id);
    else
      this.router.navigateByUrl(url);
  }
// Eliminar usuario
  public deleteUser(idUser: number) {
    const currentUser = this.listUser.find((user: Usuario) => user.id_usuario == idUser);
    if (!currentUser) return;

    const dialog = this.openModal.OpenLogout(
      [`El usuario "${currentUser?.login}" no podrá acceder al sistema`],
      '30rem',
      '¿Esta seguro que desea eliminar este usuario?',
      'Esta acción es permanente'
    );

    dialog.componentInstance!.logoutEvent?.subscribe(_ => {
      this._usuarioService.deleteUsuarioById(currentUser.id_usuario)
      .subscribe((r: any) => {
            this.openModal.Open(1, [],`Usuario "${currentUser?.login}" eliminado correctamente!`, '25rem');
            this.getUsuarios();
        });
    });
  }


  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
