import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import mirrorsharp, {MirrorSharpInstance} from "mirrorsharp-codemirror-6-preview";
import {environment} from "src/environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit, AfterViewInit {

  @ViewChild('editorcontainer') editorContainer: ElementRef<HTMLElement> = null!;

  @Input('code') code: string = '';

  private mirrorsharp: MirrorSharpInstance<{ "x-mode": any; } | {}> | undefined;

  constructor(private _http: HttpClient) {
  }

  ngOnInit(): void {
  }

  getLanguageAndCode() {
    const params = window.location.hash.replace(/^\#/, '').split('&').reduce((result, item) => {
      const [key, value] = item.split('=');
      // @ts-ignore
      result[key] = value;
      return result;
    }, {});
    // @ts-ignore
    const language = (params['language'] || 'CSharp').replace('Sharp', '#');
    // @ts-ignore
    const mode = params['mode'] || 'regular';

    return {language, mode, code: this.code};
  }

  ngAfterViewInit(): void {

    const initial = this.getLanguageAndCode();
    this.mirrorsharp = mirrorsharp(this.editorContainer.nativeElement, {
      serviceUrl: `wss://${environment.apiUrl}/mirrorsharp`,
      language: initial.language,
      text: initial.code,
      serverOptions: (initial.mode !== 'regular' ? {'x-mode': initial.mode} : {})
    });
    window.addEventListener('hashchange', () => {
      const updated = this.getLanguageAndCode();
      this.mirrorsharp!.setLanguage(updated.language);
      this.mirrorsharp!.setServerOptions({'x-mode': updated.mode});
      this.mirrorsharp!.setText(updated.code);
    });
  }

  runCode() {
    const code = this.mirrorsharp!.getText();

    this._http
      .post<{ id: string }>(`https://${environment.apiUrl}/coderunner/schedule`, {
        code: code
      })
      .subscribe({
        next: response => {
          console.log(`launched coderun`, response.id)
        }, error: (err) => {
          console.error('launching code run failed ', err)
        }
      })
  }
}
