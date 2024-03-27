import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { WelcomeComponent } from './paciente/welcome/welcome.component';
// import { WelcomeCompanyComponent } from './empresa/welcome-company/welcome-company.component';
// import { ListResultadosPatientComponent } from './paciente/list-resultados-patient/list-resultados-patient.component';
// import { PerfilComponent } from './perfil/perfil.component';
import { GestorUsuarioComponent } from './usuario/gestor-usuario/gestor-usuario.component';
// import { ResultComponent } from './paciente/result/result.component';
// import { ListResultadosCompanyComponent } from './empresa/list-resultados-company/list-resultados-company.component';
// import { DetailResultComponent } from './empresa/detail-result/detail-result.component';
import { CreateOrUpdateUserComponent } from './usuario/gestor-usuario/create-or-update-user/create-or-update-user.component';
import { GestorClienteComponent } from './usuario/cliente/gestor-cliente/gestor-cliente.component';
import { GestorTrabajadorComponent } from './usuario/trabajador/gestor-trabajador/gestor-trabajador.component';
import { GestorNotificacionComponent } from './usuario/notificacion/gestor-notificacion/gestor-notificacion.component';
import { GestorRequerimientosComponent } from './usuario/requerimiento/gestor-requerimientos.component';
import { GestorOrdenTrabajoComponent } from './usuario/orden-trabajo/gestor-orden-trabajo/gestor-orden-trabajo.component';
import { ConocenosMasComponent } from './usuario/conocenos-mas/conocenos-mas/conocenos-mas.component';
import { CreateOrUpdateRequirenmentComponent } from './usuario/requerimiento/create-or-update-requirenment/create-or-update-requirenment/create-or-update-requirenment.component';

const routes: Routes = [
  // {
  //   path: 'welcomePatient',
  //   component: WelcomeComponent,
  //   title: 'Bienvenid@ paciente'
  // },
  // {
  //   path:'welcomeCompany',
  //   component: WelcomeCompanyComponent,
  //   title: 'Bienvenido'
  // },
  // {
  //   path:'patientResult',
  //   component: ListResultadosPatientComponent,
  //   title: 'Resultado paciente'
  // },
  // {
  //   path:'result/:id:/:request',
  //   component: ResultComponent,
  //   title: 'Detalle resultado'
  // },
  // {
  //   path:'listcompanyResult',
  //   component: ListResultadosCompanyComponent,
  //   title: 'Lista empresas'
  // },
  // {
  //   path:'detailResultCompany/:id/:request/:status',
  //   component: DetailResultComponent,
  //   title: 'Detalle resultado'
  // },
  // {
  //   path:'perfil',
  //   component: PerfilComponent,
  //   title: 'Perfil'
  // },
  {
    path: 'gestionUsuario',
    component: GestorUsuarioComponent,
    title: 'Gestion Usuario'
  },
  {
    path: 'createUser',
    component: CreateOrUpdateUserComponent,
    title: 'Crear Usuario'
  },
  {
    path: 'updateUser/:id',
    component: CreateOrUpdateUserComponent,
    title: 'Editar Usuario'
  },
  {
    path: 'client',
    component: GestorClienteComponent,
    title: 'Vista cliente'
  },
  {
    path: 'worker',
    component: GestorTrabajadorComponent,
    title: 'Vista trabajador'
  },
  {
    path: 'notification',
    component: GestorNotificacionComponent,
    title: 'Vista notificaciones'
  },
  {
    path: 'requirement',
    component: GestorRequerimientosComponent,
    title: 'Vista requerimientos'
  },
  {
    path: 'createRequirement',
    component: CreateOrUpdateRequirenmentComponent,
    title: 'Crear Requerimiento'
  },
  {
    path: 'updateRequirement/:id',
    component: CreateOrUpdateRequirenmentComponent,
    title: 'Editar Requerimiento'
  },
  {
    path: 'orders',
    component: GestorOrdenTrabajoComponent,
    title: 'Vista ordenes de trabajo'
  },
  {
    path: 'conocenos',
    component: ConocenosMasComponent,
    title: 'Vista conocenos mas'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
