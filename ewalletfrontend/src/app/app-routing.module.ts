import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {AuthenticationPageComponent} from './pages/authentication-page/authentication-page.component';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';


const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'auth', component: AuthenticationPageComponent },
  { path: '*', component: NotFoundPageComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

