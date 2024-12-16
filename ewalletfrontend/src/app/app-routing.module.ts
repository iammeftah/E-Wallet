import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {AuthenticationPageComponent} from './pages/authentication-page/authentication-page.component';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {BackofficePageComponent} from './pages/backoffice-page/backoffice-page.component';
import {AgentListComponent} from './components/backoffice-components/agent-list/agent-list.component';
import {ProfilePageComponent} from './pages/profile-page/profile-page.component';
import {ClientListComponent} from './components/backoffice-components/client-list/client-list.component';
import {
  RegistrationRequestsComponent
} from './components/backoffice-components/registration-requests/registration-requests.component';
import {
  AccountTerminationComponent
} from './components/backoffice-components/account-termination/account-termination.component';
import {HistoryComponent} from './components/backoffice-components/history/history.component';
import { AgencyPageComponent } from './pages/agency-page/agency-page.component';
import {
  ClientRegistrationRequestsComponent
} from './components/agency-components/client-registration-requests/client-registration-requests.component';
import {AgencyHistoryComponent} from './components/agency-components/agency-history/agency-history.component';
import { ClientSpacePageComponent } from './pages/client-space-page/client-space-page.component';
import { PortfolioComponent } from './components/client-space-components/portfolio/portfolio.component';
import { SubscriptionPlansComponent } from './components/subscription-plans/subscription-plans.component';
import { RecurringPaymentsComponent } from './components/client-space-components/recurring-payments/recurring-payments.component';
import { BillsComponent } from './components/client-space-components/bills/bills.component';
import { SendMoneyComponent } from './components/client-space-components/send-money/send-money.component';
import { MerchantPartnersComponent } from './components/client-space-components/merchant-partners/merchant-partners.component';
import { DonationComponent } from './components/client-space-components/donation/donation.component';
import {
  NewSubscriptionComponent
} from './components/client-space-components/new-subscription/new-subscription.component';


const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'auth', component: AuthenticationPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  {
    path: 'backoffice',
    component: BackofficePageComponent,
    children: [
      { path: '', redirectTo: 'agents', pathMatch: 'full' },
      { path: 'agents', component: AgentListComponent },
      { path: 'clients', component: ClientListComponent },
      { path: 'registration-requests', component: RegistrationRequestsComponent },
      { path: 'account-termination', component: AccountTerminationComponent },
      { path: 'history', component: HistoryComponent }
    ]
  },
  {
    path: 'agency',
    component: AgencyPageComponent,
    children: [
      { path: '', redirectTo: 'clients', pathMatch: 'full' },
      { path: 'clients', component: ClientListComponent },
      { path: 'client-registration-requests', component: ClientRegistrationRequestsComponent },
      { path: 'history', component: AgencyHistoryComponent }
    ]
  },
  {
    path: 'client-space',
    component: ClientSpacePageComponent,
    children: [
      { path: 'portfolio', component: PortfolioComponent },
      { path: 'subscription-plans', component: SubscriptionPlansComponent },
      { path: 'recurring-payments', component: RecurringPaymentsComponent },
      { path: 'bills', component: BillsComponent },
      { path: 'send-money', component: SendMoneyComponent },
      { path: 'merchant-partners', component: MerchantPartnersComponent },
      { path: '', redirectTo: 'portfolio', pathMatch: 'full' },
    ],
  },
  {
    path: 'client-space',
    component: ClientSpacePageComponent,
    children: [
      { path: 'portfolio', component: PortfolioComponent },
      { path: 'subscription-plans', component: SubscriptionPlansComponent },
      { path: 'recurring-payments', component: RecurringPaymentsComponent },
      { path: 'bills', component: BillsComponent },
      { path: 'send-money', component: SendMoneyComponent },
      { path: 'merchant-partners', component: MerchantPartnersComponent },
      { path: 'donation', component: DonationComponent },
      { path: 'new-subscription', component: NewSubscriptionComponent },
      { path: '', redirectTo: 'portfolio', pathMatch: 'full' },
    ],
  },
  { path: '*', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

