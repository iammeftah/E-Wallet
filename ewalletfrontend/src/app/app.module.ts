import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationPageComponent } from './pages/authentication-page/authentication-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { DarkmodeTogglerComponent } from './components/elements/darkmode-toggler/darkmode-toggler.component';
import { SignInComponent } from './components/signing-forms/sign-in/sign-in.component';
import { SignUpAgentComponent } from './components/signing-forms/sign-up-agent/sign-up-agent.component';
import { SignUpClientComponent } from './components/signing-forms/sign-up-client/sign-up-client.component';
import {ReactiveFormsModule} from '@angular/forms';
import { WalletOrbitComponent } from './components/three/wallet-orbit/wallet-orbit.component';
import { BackofficePageComponent } from './pages/backoffice-page/backoffice-page.component';
import { SidebarComponent } from './components/backoffice-components/sidebar/sidebar.component';
import { AgentListComponent } from './components/backoffice-components/agent-list/agent-list.component';
import { RegistrationRequestsComponent } from './components/backoffice-components/registration-requests/registration-requests.component';
import { ClientListComponent } from './components/backoffice-components/client-list/client-list.component';
import { AccountTerminationComponent } from './components/backoffice-components/account-termination/account-termination.component';
import { HistoryComponent } from './components/backoffice-components/history/history.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { AgencyPageComponent } from './pages/agency-page/agency-page.component';
import { AgencyHistoryComponent } from './components/agency-components/agency-history/agency-history.component';
import { AgencySidebarComponent } from './components/agency-components/agency-sidebar/agency-sidebar.component';
import { ClientRegistrationRequestsComponent } from './components/agency-components/client-registration-requests/client-registration-requests.component';



@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NotFoundPageComponent,
    WalletOrbitComponent,







  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderComponent,
    ReactiveFormsModule,
    DarkmodeTogglerComponent,
    SignInComponent,
    SignUpAgentComponent,
    SignUpClientComponent,
    AuthenticationPageComponent,
    SidebarComponent,
    AgentListComponent,
    BackofficePageComponent,
    RegistrationRequestsComponent,
    ClientListComponent,
    AccountTerminationComponent,
    HistoryComponent,
    ProfilePageComponent,
    AgencyPageComponent,
    AgencySidebarComponent,
    ClientRegistrationRequestsComponent,
    AgencyHistoryComponent,


  ],
  providers: [],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
