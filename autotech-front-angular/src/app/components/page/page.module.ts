import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRoutingModule } from './page-routing.module';

import { SharedModule } from 'src/app/core/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GestorUsuarioComponent } from './usuario/gestor-usuario/gestor-usuario.component';
import { CreateOrUpdateUserComponent } from './usuario/gestor-usuario/create-or-update-user/create-or-update-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { TooltipModule } from '@cloudfactorydk/ng2-tooltip-directive';
import { GestorClienteComponent } from './usuario/cliente/gestor-cliente/gestor-cliente.component';
import { GestorTrabajadorComponent } from './usuario/trabajador/gestor-trabajador/gestor-trabajador.component';
import { GestorNotificacionComponent } from './usuario/notificacion/gestor-notificacion/gestor-notificacion.component';
import { GestorRequerimientosComponent } from './usuario/requerimiento/gestor-requerimientos.component';
import { GestorOrdenTrabajoComponent } from './usuario/orden-trabajo/gestor-orden-trabajo/gestor-orden-trabajo.component';
import { ConocenosMasComponent } from './usuario/conocenos-mas/conocenos-mas/conocenos-mas.component';
import { CreateOrUpdateClientComponent } from './usuario/cliente/create-or-update-client/create-or-update-client/create-or-update-client.component';
import { CreateOrUpdateRequirenmentComponent } from './usuario/requerimiento/create-or-update-requirenment/create-or-update-requirenment/create-or-update-requirenment.component';



@NgModule({
  declarations: [
    GestorUsuarioComponent,
    CreateOrUpdateUserComponent,
    GestorClienteComponent,
    GestorTrabajadorComponent,
    GestorNotificacionComponent,
    GestorRequerimientosComponent,
    GestorOrdenTrabajoComponent,
    ConocenosMasComponent,
    CreateOrUpdateClientComponent,
    CreateOrUpdateRequirenmentComponent,
  ],
  imports: [
    CommonModule,
    PageRoutingModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    DirectivesModule,
    PipesModule,
    TooltipModule
  ]
})
export class PageModule { }
