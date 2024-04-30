import { NgModule } from "@angular/core";
import { SafePipe } from "./safe/safe.pipe";
import { CommonModule } from "@angular/common";
import { ShortTextPipe } from "./short/short-text.pipe";
import { FilterUsersPipe } from './filter/filter-users.pipe';
import { FilterRequerimentsPipe } from "./filter/filter-requirenments.pipe";
import { FilterClientsPipe } from "./filter/filter-clients.pipe";
import { FilterProductoPipe } from "./filter/filter_product.pipe";
import { FilterOrdenPipe } from "./filter/filter_orden.pipe";
import { FilterNotificationPipe } from "./filter/filter-notification.pipe";

@NgModule({
  providers: [
    FilterUsersPipe,
    FilterRequerimentsPipe,
    FilterClientsPipe,
    FilterProductoPipe,
    FilterOrdenPipe,
    FilterNotificationPipe
  ],
  declarations: [
    SafePipe,
    ShortTextPipe,
    FilterUsersPipe,
    FilterRequerimentsPipe,
    FilterClientsPipe,
    FilterProductoPipe,
    FilterOrdenPipe,
    FilterNotificationPipe
  ],
  imports: [CommonModule],
  exports: [
    SafePipe,
    ShortTextPipe,
    FilterUsersPipe,
    FilterRequerimentsPipe,
    FilterClientsPipe,
    FilterProductoPipe,
    FilterOrdenPipe,
    FilterNotificationPipe
  ]
})
export class PipesModule { }
