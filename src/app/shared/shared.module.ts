import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CodeEditorComponent} from "./components/code-editor/code-editor.component";


@NgModule({
  declarations: [CodeEditorComponent],
  imports: [
    CommonModule
  ],
  exports: [CodeEditorComponent]
})
export class SharedModule {
}
