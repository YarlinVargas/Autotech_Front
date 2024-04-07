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
import { Producto } from 'src/app/core/models/productos/producto.model';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { ListUser, ListUsuario } from 'src/app/core/models/user/list-user.model';
import { FilterUsersPipe } from 'src/app/core/pipes/filter/filter-users.pipe';
import { SpinnerService } from 'src/app/core/services/gen/spinner.service';
import { ProductoService } from 'src/app/core/services/productos/productos.service';
import { Usuario, UsuarioService } from 'src/app/core/services/usuario/usuario.service';
import { ModalDetalleUsuarioComponent } from 'src/app/core/shared/modals/modal-detalle-usuario/modal-detalle-usuario.component';

@Component({
  selector: 'app-gestor-productos',
  templateUrl: './gestor-productos.component.html',
  styleUrls: ['./gestor-productos.component.scss']
})
export class GestorProductosComponent {
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
  private productoService = inject(ProductoService);
  private spinnerSvc = inject(SpinnerService);

  public listProductos: Producto[] = [];

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

  public ngOnInit(): void {
    this.getProductos();
  }
  public OpenMenu(){
    this.isOpen = !this.isOpen;
  }


  public getProductos(){
    this.productoService.getProducts().subscribe((r: any) => {
        if (r.length > 0) {
          this.listProductos = r;

        } else {
          console.log("No hay productos registrados en el sistema");
        }
      });
  }
}
