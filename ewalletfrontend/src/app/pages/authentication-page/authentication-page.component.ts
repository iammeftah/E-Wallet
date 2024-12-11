import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from '../../components/SigningForms/sign-in/sign-in.component';
import { SignUpClientComponent } from '../../components/SigningForms/sign-up-client/sign-up-client.component';
import { SignUpAgentComponent } from '../../components/SigningForms/sign-up-agent/sign-up-agent.component';
import { HeaderComponent } from '../../components/layout/header/header.component';

@Component({
  selector: 'app-authentication-page',
  standalone: true,
  imports: [CommonModule, SignInComponent, SignUpClientComponent, SignUpAgentComponent, HeaderComponent],
  templateUrl: './authentication-page.component.html',
  styleUrls: ['./authentication-page.component.css']
})
export class AuthenticationPageComponent {
  currentView: 'signin' | 'signup-agent' | 'signup-client' = 'signin';

  switchView(view: 'signin' | 'signup-agent' | 'signup-client') {
    this.currentView = view;
  }
}

