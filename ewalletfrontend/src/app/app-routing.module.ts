import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {AuthenticationPageComponent} from './pages/authentication-page/authentication-page.component';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {BackofficePageComponent} from './pages/backoffice-page/backoffice-page.component';
import {AgentListComponent} from './components/backoffice-components/agent-list/agent-list.component';


const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'auth', component: AuthenticationPageComponent },
  {
    path: 'backoffice',
    component: BackofficePageComponent,
    children: [
      { path: 'agents', component: AgentListComponent },
      { path: '', redirectTo: 'agents', pathMatch: 'full' }
    ]
  },
  { path: '*', component: NotFoundPageComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

