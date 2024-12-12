import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationPageComponent } from './pages/authentication-page/authentication-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { DarkmodeTogglerComponent } from './components/elements/darkmode-toggler/darkmode-toggler.component';
import { SignInComponent } from './components/SigningForms/sign-in/sign-in.component';
import { SignUpAgentComponent } from './components/SigningForms/sign-up-agent/sign-up-agent.component';
import { SignUpClientComponent } from './components/SigningForms/sign-up-client/sign-up-client.component';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HomePageComponent,
    NotFoundPageComponent,


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

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
