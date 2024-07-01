import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaygroundComponent } from './pages/playground/playground.component';
import {RouterModule, Routes} from "@angular/router";
import {LandingComponent} from "../landing/landing.component";
import {AppModule} from "../../app.module";
import {SharedModule} from "../../shared/shared.module";

const routes: Routes = [
  {
    path: 'playground',
    component: PlaygroundComponent
  }
]

@NgModule({
  declarations: [
    PlaygroundComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ]
})
export class CourseModule { }
