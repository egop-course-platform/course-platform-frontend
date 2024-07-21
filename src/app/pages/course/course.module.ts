import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlaygroundComponent} from './pages/playground/playground.component';
import {RouterModule, Routes} from "@angular/router";
import {LandingComponent} from "../landing/landing.component";
import {AppModule} from "../../app.module";
import {SharedModule} from "../../shared/shared.module";
import {IntroductionComponent} from './pages/introduction/introduction.component';

const routes: Routes = [
  {
    path: 'playground',
    loadChildren: () => import('./pages/playground/playground.module').then(x => x.PlaygroundModule)
  },
  {
    path: 'introduction',
    loadChildren: () => import('./pages/introduction/introduction.module').then(x => x.IntroductionModule)
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CourseModule {
}
