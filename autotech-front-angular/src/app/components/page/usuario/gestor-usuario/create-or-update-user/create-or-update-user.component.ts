import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { ListModel } from 'src/app/core/models/general/general.model';
import { GeneralService } from '../../../../../core/services/gen/general.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RespService } from 'src/app/core/models/general/resp-service.model';
import { Subject, distinctUntilChanged, filter, finalize, forkJoin, map, switchMap, takeUntil, tap } from 'rxjs';
import { UserService } from 'src/app/core/services/user/user.service';
import { Company } from 'src/app/core/models/general/company.model';
import { CreateUpdateUser } from 'src/app/core/services/user/models/create-update-user.model';
import { PlansByCompany } from 'src/app/core/services/user/models/plans-by-company.model';
import { Dialog } from '@angular/cdk/dialog';
import { openModals } from 'src/app/core/global/modals/openModal';
import { SpinnerService } from 'src/app/core/services/gen/spinner.service';
import { TootilpOption } from 'src/app/core/models/tooltip-options.model';
import { TextLargeWindow } from 'src/app/core/constants/textLargeWindow';

interface FiltersContracts {
  waitingResult: boolean;
  partialResult: boolean;
  finishedResult: boolean;
  [key: string]: boolean;
}

@Component({
  selector: 'app-create-or-update-user',
  templateUrl: './create-or-update-user.component.html',
  styleUrls: ['./create-or-update-user.component.scss']
})
export class CreateOrUpdateUserComponent implements OnInit, OnDestroy {

  public listDocument!: ListModel[];
  public listThird!: Company[];
  public listPlans: ListModel[] = [];
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

  public userToUpdate: CreateUpdateUser = {
    id_usuario: 0,
    cedula:'',
    nombres: '',
    apellidos: '',
    celular: '',
    correo: '',
    direccion:'',
    id_tipo_documento: 0,
    id_perfil: 0,
    id_estado: 0,
    login:'',
    password:''


  };
  public form: FormGroup = new FormGroup({});

  private genSvc = inject(GeneralService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private spinnerSvc = inject(SpinnerService);

  public allPlans: any[] = [];

  public openModal: openModals = new openModals(this.dialog);
  public currentLargeText = 10;

  constructor(public dialog: Dialog) {
    this.setFormUser(this.userToUpdate);
    const allDocuments = this.genSvc.getTiposDocumento();
    const allCompanies = this.genSvc.ListCompanies();

    forkJoin([allDocuments, allCompanies])
      .subscribe(([resp1, resp2]: RespService[]) => {
        this.listDocument = resp1.data;
        this.listThird = resp2.data;
      });
  }

  public ngOnInit(): void {
    this.currentLargeText = TextLargeWindow.get(15);

    if (this.router.url.includes('updateUser')) {
      this.isEdit = true;
      this.GetUser();
    }

    this.validateUser();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.currentLargeText = TextLargeWindow.get(15);
  }

  public changeSelectCompany(evt: any) {
    if (evt == this.lastIndexCompany) return ;

    this.lastIndexCompany = evt;
    this.setCompanyNit(evt);
  }



  public validateUser() {
    this.form.get('cedula')?.statusChanges
      .pipe(
        takeUntil(this.destroy$),
        filter((status) => status === 'VALID'),
      )
      .subscribe((status) => {
        this.form.get('id_tipo_documento')?.setErrors({ 'showWithoutMessage': null });
        this.form.get('id_tipo_documento')?.updateValueAndValidity();
      });
  }

  public setCompanyNit(id: string | any) {
    this.currentCompanyNit = this.listThird?.find(company => company.id === id)?.NIT || '';
  }

  private GetUser(): void {
    const idUser = this.activatedRoute.snapshot.paramMap.get('id');

    if (!idUser)
      this.router.navigateByUrl('/gestionUsuario');

    this.spinnerSvc.show();
    this.userService.GetUser(idUser!)
      .pipe(
        tap((resp: RespService) => {
          if (!Object.keys(resp.data).length)
            this.router.navigateByUrl('/gestionUsuario');
          else {
            this.userToUpdate = resp.data;
            this.setFormUser(this.userToUpdate);
          }
        }),

        finalize(() => {
          this.spinnerSvc.hide();
        })
      )
      .subscribe((resp2: any) => {

        this.filters['waitingResult'] = this.allFilterSelected('waitingResult');
        this.filters['partialResult'] = this.allFilterSelected('partialResult');
        this.filters['finishedResult'] = this.allFilterSelected('finishedResult');
        this.validateLinks();
        this.setFormUser(this.userToUpdate);

      });
  }

  public setFormUser(user: CreateUpdateUser) {
    this.form = this.fb.group({
      id_usuario: [user.id_usuario],
      cedula: [user.cedula, Validators.required],
      nombres: [user.nombres, [Validators.required, Validators.minLength(1)]],
      apellidos: [user.apellidos, [Validators.required, Validators.minLength(1)]],
      celular: [user.celular, Validators.required],
      correo: [
        user.correo,
        [
          Validators.required,
          Validators.email,
        ]
      ],
      direccion: [user.direccion, Validators.required],
      id_tipo_documento: [user.id_tipo_documento == null || user.id_tipo_documento == undefined ? '' : user.id_tipo_documento, [Validators.required]],
      id_perfil: [user.id_perfil],
      id_estado: [user.id_estado],
      login: [user.login, Validators.required],
      password: [user.password, Validators.required],
    });
    debugger
  }

  public back = () => this.router.navigateByUrl('gestionUsuario');

  public updateOrCreateUser(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }


    let request: CreateUpdateUser = this.form.value;

    this.spinnerSvc.show();
    this.userService.CreateOrUpate(request)
      .pipe(
        finalize(() => {
          this.spinnerSvc.hide();
        })
      )
      .subscribe((resp: RespService) => {
        let message = '';
        let status = 1;

        if (this.isEdit) {
          if (resp.ok === true)
            message = '¡Usuario actualizado correctamente!';
          else {
            status = 3;

            if (resp.message.trim().toLowerCase() === 'username already exists') {
              message = '¡Los datos del usuario ya existen! Por favor verifique e intente de nuevo';
              this.form.get('identificationNumber')?.setErrors({ 'IdentificationExists': true });
              this.form.get('idIdentificationType')?.setErrors({ 'showWithoutMessage': true });
            } else if (resp.message.trim().toLowerCase() === 'email already exists') {
              this.form.get('email')?.setErrors({ 'EmailIsTaken': true });
            }
          }
        } else {
          if (resp.ok === true)
            message = '¡Usuario creado correctamente!';
          else {
            status = 3;

            if (resp.message.trim().toLowerCase() === 'username already exists') {
              message = '¡Los datos del usuario ya existen! Por favor verifique e intente de nuevo';
              this.form.get('identificationNumber')?.setErrors({ 'IdentificationExists': true });
              this.form.get('idIdentificationType')?.setErrors({ '': true });
            } else if (resp.message.trim().toLowerCase() === 'email already exists') {
              this.form.get('email')?.setErrors({ 'EmailIsTaken': true });
            }
          }
        }

        if (message) {
          const dialogRef = this.openModal.Open(
            status,
            [],
            message,
            '25rem',
            status === 3 ? 'amber400': ''
          );

          dialogRef.componentInstance!.acceptEvent?.subscribe(_ => {
            if (status === 1)
              this.router.navigateByUrl(`/gestionUsuario`);
            dialogRef.close();
          });
        }
      });
  }

  public getForm = (control: string) => this.form.get(control);

  public quantityPlansActive = (): number => this.allPlans?.length | 0;

  public activeOrInactivePlan(event: any) {
    this.allPlans.splice(this.allPlans.findIndex(plan => plan.code === event), 1);
    this.validateLinks();
  }

  public selectAllOrNonePlans = (action: 'all' | 'none') => {
    if (action === 'all') {
      this.listPlans.forEach((plan: ListModel) => {
        const existPlan = this.allPlans.find(plans => plans.code === plan.id.toString());

        if (!existPlan) {
          this.allPlans.push({
            code: plan.id.toString(),
            plan: plan.name,
            waitingResult: true,
            finishedResult: true,
            partialResult: true,
          });
        }
      });
    } else
      this.allPlans = [];

    this.filters['waitingResult'] = this.allFilterSelected('waitingResult');
    this.filters['partialResult'] = this.allFilterSelected('partialResult');
    this.filters['finishedResult'] = this.allFilterSelected('finishedResult');

    this.validateLinks();
  }

  public filters: FiltersContracts = { waitingResult: false, partialResult: false, finishedResult: false };

  public changeStatus(event: any, type: 'waitingResult' | 'partialResult' | 'finishedResult') {
    setTimeout(() => {
      this.allPlans.map((plan: any) => plan[type] = event);
      this.filters[type] = event;
    }, 50);
  }

  public changeToggle(event: any) {
    setTimeout(() => {
      this.allPlans[event[1]][event[2]] = event[0];
      this.filters[event[2]] = this.allFilterSelected(event[2]);
    }, 50);
  }

  public allFilterSelected(campo: string) {
    if (!this.allPlans.length) return false;

    return this.allPlans.every((plan: any) => plan[campo]);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }



  private validateLinks(): void {
    const planSelected = this.quantityPlansActive();

    if (planSelected === this.listPlans.length)
      this.colorsLinks = {
        associate: 'neutral',
        disassociate: 'amber400'
      };
    else
      this.colorsLinks = {
        associate: 'cyan',
        disassociate: planSelected == 0 ? 'neutral' : 'amber400'
      }
  }
}
