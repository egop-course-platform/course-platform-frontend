import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'course-platform-frontend';

  constructor(private _httpClient: HttpClient) {
  }

  textChanged($event: KeyboardEvent) {
    this._httpClient.post<string[]>('http://localhost:5200/completion2', {code: ($event.target as any).value })
      .subscribe(x => console.log(x))
  }
}
