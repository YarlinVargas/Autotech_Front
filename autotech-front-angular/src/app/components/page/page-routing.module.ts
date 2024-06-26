import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestorUsuarioComponent } from './usuario/gestor-usuario/gestor-usuario.component';
import { CreateOrUpdateUserComponent } from './usuario/gestor-usuario/create-or-update-user/create-or-update-user.component';
import { GestorClienteComponent } from './usuario/cliente/gestor-cliente/gestor-cliente.component';
import { GestorNotificacionComponent } from './usuario/notificacion/gestor-notificacion/gestor-notificacion.component';
import { GestorRequerimientosComponent } from './usuario/requerimiento/gestor-requerimientos.component';
import { GestorOrdenTrabajoComponent } from './usuario/orden-trabajo/gestor-orden-trabajo/gestor-orden-trabajo.component';
import { ConocenosMasComponent } from './usuario/conocenos-mas/conocenos-mas/conocenos-mas.component';
import { CreateOrUpdateRequirenmentComponent } from './usuario/requerimiento/create-or-update-requirenment/create-or-update-requirenment/create-or-update-requirenment.component';
import { CreateOrUpdateClientComponent } from './usuario/cliente/create-or-update-client/create-or-update-client/create-or-update-client.component';
import { GestorProductosComponent } from './usuario/productos/gestor-productos/gestor-productos.component';
import { CreateOrUpdateProductComponent } from './usuario/productos/create-or-update-product/create-or-update-product/create-or-update-product.component';
import { CreateOrUpdateOrdenComponent } from './usuario/orden-trabajo/create-or-update-orden/create-or-update-orden/create-or-update-orden.component';
import { ReportesComponent } from './usuario/reportes/reportes.component';
import { CreateOrUpdateNotificacionComponent } from './usuario/notificacion/create-or-update-notificacion/create-or-update-notificacion/create-or-update-notificacion.component';

const routes: Routes = [
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
    path: 'createClient',
    component: CreateOrUpdateClientComponent,
    title: 'Crear Cliente'
  },
  {
    path: 'updateClient/:id',
    component: CreateOrUpdateClientComponent,
    title: 'Editar Cliente'
  },
  {
    path: 'notification',
    component: GestorNotificacionComponent,
    title: 'Vista notificaciones'
  },
  {
    path: 'createNotification',
    component: CreateOrUpdateNotificacionComponent,
    title: 'Crear Notificacion'
  },
  {
    path: 'updateNotification/:id',
    component: CreateOrUpdateNotificacionComponent,
    title: 'Editar Notificacion'
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
    path: 'createOrdenes',
    component: CreateOrUpdateOrdenComponent,
    title: 'Crear orden trabajo'
  },
  {
    path: 'updateordenes/:id',
    component: CreateOrUpdateOrdenComponent,
    title: 'Editar orden trabajo'
  },
  {
    path: 'conocenos',
    component: ConocenosMasComponent,
    title: 'Vista conocenos mas'
  },
  {
    path:'productos',
    component: GestorProductosComponent,
    title:'Lista de productos'
  },
  {
    path: 'createProduct',
    component: CreateOrUpdateProductComponent,
    title: 'Crear Producto'
  },
  {
    path:'updateProduct/:id',
    component:CreateOrUpdateProductComponent,
    title:'Crear un producto'
  },
  {
    path:'reportes',
    component:ReportesComponent,
    title:'Crear un reporte'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
