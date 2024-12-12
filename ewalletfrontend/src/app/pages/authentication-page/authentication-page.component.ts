import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpAgentComponent } from '../../components/signing-forms/sign-up-agent/sign-up-agent.component';
import {SignInComponent} from '../../components/signing-forms/sign-in/sign-in.component';
import {SignUpClientComponent} from '../../components/signing-forms/sign-up-client/sign-up-client.component';



@Component({
  selector: 'app-authentication-page',
  standalone: true,
  imports: [CommonModule, SignInComponent, SignUpClientComponent, SignUpAgentComponent],
  templateUrl: './authentication-page.component.html',
  styleUrls: ['./authentication-page.component.css']
})
export class AuthenticationPageComponent {
  currentView: 'signin' | 'signup-agent' | 'signup-client' = 'signin';

  switchView(view: 'signin' | 'signup-agent' | 'signup-client') {
    this.currentView = view;
  }
}

