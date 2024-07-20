import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import mirrorsharp, {MirrorSharpInstance} from "mirrorsharp-codemirror-6-preview";
import {environment} from "src/environments/environment";
import {HttpClient} from "@angular/common/http";
import {
  fadeInRightOnEnterAnimation, fadeOutRightOnLeaveAnimation,
  rotateInOnEnterAnimation, rotateOutOnLeaveAnimation,
  tadaOnEnterAnimation
} from 'angular-animations';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
  animations: [tadaOnEnterAnimation(), rotateInOnEnterAnimation(), rotateOutOnLeaveAnimation(), fadeInRightOnEnterAnimation(), fadeOutRightOnLeaveAnimation()],
})
export class CodeEditorComponent implements OnInit, AfterViewInit {

  @ViewChild('editorcontainer') editorContainer: ElementRef<HTMLElement> = null!;

  @Input('code') code: string = '';

  private mirrorsharp: MirrorSharpInstance<{ "x-mode": any; } | {}> | undefined;

  outputLines: string[] = [];

  sendStatus: string = 'none';
  buildStatus: string = 'none';
  runStatus: string = 'none';
  failed: boolean = false;

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
    this.outputLines = [];
    this.buildStatus = 'none';
    this.runStatus = 'none';
    this.sendStatus = 'none';

    const ws = new WebSocket(`wss://${environment.apiUrl}/coderunner/runner`);
    const code = this.mirrorsharp!.getText();

    this.sendStatus = 'sending';
    ws.onopen = ev => {
      ws.send(JSON.stringify({command: 'run', code: code}));
      this.sendStatus = 'pending';
    }
    ws.onmessage = ev => {
      const response = JSON.parse(ev.data);
      switch (response.action) {
        case 'build': {
          this.buildStatus = response.result;
          if (response.result === 'failed'){
            this.failed = true;
            this.outputLines = response.errorLines;
          }
          break;
        }
        case 'run': {
          this.runStatus = response.result;
          if (response.result === 'failed'){
            this.failed = true;
            this.outputLines = response.errorLines;
          }
        }
      }
      if (response.outputLines !== undefined) {
        this.outputLines = response.outputLines;
      }
    };
    ws.onclose = ev => {
      this.sendStatus = 'finished';
    };
  }

  animState = false;

  animDone() {
    this.animState = !this.animState;
  }

  resetRun() {
    this.outputLines = [];
    this.buildStatus = 'none';
    this.runStatus = 'none';
    this.sendStatus = 'none';
    this.failed = false;
  }
}
