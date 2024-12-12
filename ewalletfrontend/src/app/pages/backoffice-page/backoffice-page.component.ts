import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/backoffice-components/sidebar/sidebar.component';
import { AgentListComponent } from '../../components/backoffice-components/agent-list/agent-list.component';
import { RegistrationRequestsComponent } from '../../components/backoffice-components/registration-requests/registration-requests.component';
import { ClientListComponent } from '../../components/backoffice-components/client-list/client-list.component';
import { AccountTerminationComponent } from '../../components/backoffice-components/account-termination/account-termination.component';
import { HistoryComponent } from '../../components/backoffice-components/history/history.component';
import {HeaderComponent} from '../../components/layout/header/header.component';

@Component({
  selector: 'app-backoffice-page',
  templateUrl: './backoffice-page.component.html',
  styleUrls: ['./backoffice-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    AgentListComponent,
    RegistrationRequestsComponent,
    ClientListComponent,
    AccountTerminationComponent,
    HistoryComponent,
    HeaderComponent
  ]
})
export class BackofficePageComponent {
  currentView: string = 'agents';

  setCurrentView(view: string) {
    this.currentView = view;
  }
}

