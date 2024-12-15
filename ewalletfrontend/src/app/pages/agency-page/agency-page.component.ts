import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { AgencySidebarComponent } from '../../components/agency-components/agency-sidebar/agency-sidebar.component';
import { ClientListComponent } from '../../components/backoffice-components/client-list/client-list.component';
import { ClientRegistrationRequestsComponent } from '../../components/agency-components/client-registration-requests/client-registration-requests.component';
import { AgencyHistoryComponent } from '../../components/agency-components/agency-history/agency-history.component';

@Component({
  selector: 'app-agency-page',
  templateUrl: './agency-page.component.html',
  styleUrls: ['./agency-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    AgencySidebarComponent,
    ClientListComponent,
    ClientRegistrationRequestsComponent,
    AgencyHistoryComponent
  ]
})
export class AgencyPageComponent {
  currentView: string = 'clients';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.firstChild?.url.subscribe(segments => {
      if (segments.length > 0) {
        this.currentView = segments[0].path;
      }
    });
  }

  setCurrentView(view: string) {
    this.currentView = view;
    this.router.navigate(['/agency', view]).then(() => {
      // Navigation complete
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }
}

