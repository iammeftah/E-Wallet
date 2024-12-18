import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SignInComponent } from '../../components/signing-forms/sign-in/sign-in.component';
import { SignUpAgentComponent } from '../../components/signing-forms/sign-up-agent/sign-up-agent.component';
import { SignUpClientComponent } from '../../components/signing-forms/sign-up-client/sign-up-client.component';
import {DarkmodeTogglerComponent} from '../../components/elements/darkmode-toggler/darkmode-toggler.component';

@Component({
  selector: 'app-authentication-page',
  standalone: true,
  imports: [CommonModule, RouterModule, DarkmodeTogglerComponent],
  templateUrl: './authentication-page.component.html',
  styleUrls: ['./authentication-page.component.css']
})
export class AuthenticationPageComponent {
  constructor(private router: Router) {}

  switchView(view: 'signin' | 'signup-agent' | 'signup-client') {
    this.router.navigate(['/auth', view]);
  }
}

