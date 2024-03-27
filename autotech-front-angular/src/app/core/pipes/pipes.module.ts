import { NgModule } from "@angular/core";
import { SafePipe } from "./safe/safe.pipe";
import { CommonModule } from "@angular/common";
import { ShortTextPipe } from "./short/short-text.pipe";
import { FilterUsersPipe } from './filter/filter-users.pipe';
import { FilterRequerimentsPipe } from "./filter/filter-requirenments.pipe";

@NgModule({
  providers: [
    FilterUsersPipe,
    FilterRequerimentsPipe
  ],
  declarations: [
    SafePipe,
    ShortTextPipe,
    FilterUsersPipe,
    FilterRequerimentsPipe
  ],
  imports: [CommonModule],
  exports: [
    SafePipe,
    ShortTextPipe,
    FilterUsersPipe,
    FilterRequerimentsPipe
  ]
})
export class PipesModule { }
