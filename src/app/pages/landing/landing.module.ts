import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {LandingComponent} from "./landing.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent
  }
]

@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class LandingModule { }
