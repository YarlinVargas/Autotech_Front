import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faBuilding, faUserGroup, faGear } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthModel } from 'src/app/core/models/auth/auth.model';
import { ListModel } from 'src/app/core/models/general/general.model';
import { Dialog } from '@angular/cdk/dialog';
import { openModals } from 'src/app/core/global/modals/openModal';
import { ValueSelect } from 'src/app/core/models/general/value-select.model';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public allOptions: ValueSelect[] = [];

  // # TABS
  openTab = 1;

  //ICONOS
  faBuilding = faBuilding;
  faUserGroup = faUserGroup;
  faGear = faGear;

  //CAPTCHA
  captcha: string = ''

  //FORMULARIO
  form!: FormGroup;

  //LISTAS
  listDocument!: ListModel[];

  //IMAGEN EMPRESA
  imgEnterprise = "";
  //Modal
  openModal: openModals = new openModals(this.dialog);

  tabs = [
    { id: 1, title: 'Pacientes', colorT: 'text-sky500', colorB: 'bg-sky500', icon: faUserGroup, hover: 'hover:text-cyan400 hover:underline', rememberData: false },
    { id: 2, title: 'Empresas', colorT: 'text-teal500', colorB: 'bg-teal500', icon: faBuilding, hover: 'hover:text-teal400 hover:underline', rememberData: false },
    { id: 3, title: 'Usuarios', colorT: 'text-sky700', colorB: 'bg-sky700', icon: faGear, hover: 'hover:text-sky500 hover:underline', rememberData: false }
  ]


  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialog: Dialog,
    private _usuarioService: UsuarioService
  ) {
    this.initialForm();
    if (localStorage.getItem('remember') !=null) {
      const data = this.ValidRemember();

      if (data) {
        this.openTab = data.id;
debugger
        if (this.openTab === data.id) {
          this.form.controls['idIdentificationType'].setValue(data.idIdentificationType);
          this.form.controls['userName'].setValue(data.userName);
        }
      }
    }


  }

  ngOnInit(): void {
    // this.indexDbService.getAllImages().then((r: any) => {
    //   if (!r?.length) {
        // this.genSvc.ImgEnterprise().subscribe((r: RespService) => {
        //   this.indexDbService.addImage(r.data);
        //   debugger
        //   this.imgEnterprise = r.data;
        // })
      // } else {
      //   this.imgEnterprise = r[0].data;
      // }
    // });
    // this.genSvc.ListFiltersConsult().subscribe((r: RespService) => {
    //   this.listDocument = r.data;
    // });
    //this.ListFiltersConsult();
  }



  private initialForm() {
    this.form = this.fb.group({
      idIdentificationType: [''],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      recaptchaReactive: [null, Validators.required]
    });
  }

  toggleTabs($tabNumber: number) {
    this.initialForm();
    this.openTab = $tabNumber;

    const data = this.ValidRemember();
    if (data) {
      if (this.openTab === data.id) {
        this.form.controls['idIdentificationType'].setValue(data.idIdentificationType);
        this.form.controls['userName'].setValue(data.userName);
      }
    }
  }

  resolved(captchaResponse: string) {
  }

  Auth() {

      const data: AuthModel = {...this.form.value};

    this._usuarioService.authenticateUsuario(data.userName, data.password).subscribe((r: any) => {
        debugger
        if (r != null) {
          localStorage.setItem('perfilUser', JSON.stringify(r.usuario.id_perfil));
        console.log('Usuario logueado correctamente');
        this.router.navigateByUrl(`conocenos`);
        }
      },
      error => {
        console.error('Error al loguear el usuario', error);
      }
    );

  }

  public RecoverPassword() {
    this.router.navigate(['/recoverPassword', this.openTab == 1 ? 3 : this.openTab == 3 ? 1 : this.openTab]);
  }

  private ValidRemember() {

    if (localStorage.getItem('remember')) {
      const data = JSON.parse(localStorage.getItem('remember')!);
      this.tabs.forEach(element => {
        if (element['id'] === data.id) {
          element['rememberData'] = true;
        } else {
          element['rememberData'] = false;
        }
      });

      return data;
    }

    return null;
  }

  public Checked(id: number, $event: any) {
    this.tabs.forEach(element => {
      if (element['id'] === id) {
        element['rememberData'] = $event.checked;
      } else {
        element['rememberData'] = false;
      }
    });
  }

  private RememberData(id: number, checked: boolean) {
    if (checked) {
      localStorage.setItem('remember', JSON.stringify({ id: id, idIdentificationType: this.form.value.idIdentificationType, userName: this.form.value.userName }));
    } else {
      localStorage.removeItem('remember');
    }
  }
}
