import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MenuItem {
  name: string;
  view: string;
  icon: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule]
})
export class SidebarComponent {
  @Output() viewChange = new EventEmitter<string>();
  currentView: string = 'agents';

  menuItems: MenuSection[] = [
    { title: 'Agent Space', items: [
        { name: 'Agent List', view: 'agents', icon: 'fas fa-users' },
        { name: 'Registration Requests', view: 'registration-requests', icon: 'fas fa-user-plus' }
      ]},
    { title: 'Client Space', items: [
        { name: 'Client List', view: 'clients', icon: 'fas fa-address-book' },
        { name: 'Account Termination', view: 'account-termination', icon: 'fas fa-user-times' }
      ]},
    { title: 'History', items: [
        { name: 'Activity Log', view: 'history', icon: 'fas fa-history' }
      ]}
  ];

  changeView(view: string) {
    this.currentView = view;
    this.viewChange.emit(view);
  }
}

