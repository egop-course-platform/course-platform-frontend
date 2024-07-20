import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CodeEditorComponent} from "./components/code-editor/code-editor.component";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [CodeEditorComponent],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [CodeEditorComponent]
})
export class SharedModule {
}
