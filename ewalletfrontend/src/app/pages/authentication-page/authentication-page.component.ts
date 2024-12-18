import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {LoaderComponent} from '../../components/elements/loader/loader.component';


@Component({
  selector: 'app-authentication-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  templateUrl: './authentication-page.component.html',
  styleUrls: ['./authentication-page.component.css']
})
export class AuthenticationPageComponent {
  isLoading = false;

  constructor(private router: Router) {}

  switchView(view: 'signin' | 'signup-agent' | 'signup-client') {
    this.isLoading = true;
    this.router.navigate(['/auth', view]).then(() => {
      this.isLoading = false;
    });
  }
}

