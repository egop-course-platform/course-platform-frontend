import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import mirrorsharp from "mirrorsharp-codemirror-6-preview";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit, AfterViewInit {

  @ViewChild('editorcontainer') editorContainer: ElementRef<HTMLElement> = null!;

  constructor(private _httpClient: HttpClient) {
  }

  ngAfterViewInit(): void {

    const initial = this.getLanguageAndCode();
    const ms = mirrorsharp(this.editorContainer.nativeElement, {
      serviceUrl: `ws://${environment.apiUrl}/mirrorsharp`,
      language: initial.language,
      text: initial.code,
      serverOptions: (initial.mode !== 'regular' ? {'x-mode': initial.mode} : {})
    });
    window.addEventListener('hashchange', () => {
      const updated = this.getLanguageAndCode();
      ms.setLanguage(updated.language);
      ms.setServerOptions({'x-mode': updated.mode});
      ms.setText(updated.code);
    });
  }

  getLanguageAndCode = () => {
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
    const code = 'Guid.NewGuid()';

    return {language, mode, code};
  }

  ngOnInit(): void {

  }

  // textChanged($event: KeyboardEvent) {
  //   this._httpClient.post<string[]>('http://localhost:5200/completion2', {code: ($event.target as any).value})
  //     .subscribe(x => console.log(x))
  // }

}
