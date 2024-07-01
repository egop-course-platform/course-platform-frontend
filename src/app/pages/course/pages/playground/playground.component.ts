import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {

  // language=C#
  defaultCode: string = 'using System;\n' +
    '\n' +
    'Console.WriteLine("Hello world");\n';

  constructor(private _httpClient: HttpClient) {
  }

  ngOnInit(): void {

  }
}
