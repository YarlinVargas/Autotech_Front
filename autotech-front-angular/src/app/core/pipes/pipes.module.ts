import { NgModule } from "@angular/core";
import { SafePipe } from "./safe/safe.pipe";
import { CommonModule } from "@angular/common";
import { ShortTextPipe } from "./short/short-text.pipe";
import { FilterUsersPipe } from './filter/filter-users.pipe';

@NgModule({
  providers: [
    FilterUsersPipe
  ],
  declarations: [
    SafePipe,
    ShortTextPipe,
    FilterUsersPipe
  ],
  imports: [CommonModule],
  exports: [
    SafePipe,
    ShortTextPipe,
    FilterUsersPipe
  ]
})
export class PipesModule { }
