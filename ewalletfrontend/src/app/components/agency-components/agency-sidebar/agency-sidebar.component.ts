import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface MenuItem {
  name: string;
  view: string;
  icon: string;
}

@Component({
  selector: 'app-agency-sidebar',
  templateUrl: './agency-sidebar.component.html',
  styleUrls: ['./agency-sidebar.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AgencySidebarComponent {
  @Output() viewChange = new EventEmitter<string>();
  currentView: string = 'clients';

  menuItems: MenuItem[] = [
    { name: 'Client List', view: 'clients', icon: 'fas fa-users' },
    { name: 'Client Registration Requests', view: 'client-registration-requests', icon: 'fas fa-user-plus' },
    { name: 'Activity Log', view: 'history', icon: 'fas fa-history' }
  ];

  constructor(private router: Router) {}

  changeView(view: string) {
    this.currentView = view;
    this.viewChange.emit(view);
  }
}

