import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  name: string;
  view: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-client-space-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-space-sidebar.component.html'
})
export class ClientSpaceSidebarComponent {
  menuItems: MenuSection[] = [
    {
      title: 'Account',
      items: [
        { name: 'Portfolio', view: 'portfolio' },
        { name: 'New Subscription', view: 'new-subscription' },
        { name: 'Subscription plans', view: 'subscription-plans' },
      ]
    },
    {
      title: 'Payments',
      items: [
        { name: 'Recurring Payments', view: 'recurring-payments' },
        { name: 'Bills', view: 'bills' },
        { name: 'Send money', view: 'send-money' },
        { name: 'Donation', view: 'donation' }
      ]
    },
    {
      title: 'Partners',
      items: [
        { name: 'Merchant Partners', view: 'merchant-partners' }
      ]
    }
  ];
}

