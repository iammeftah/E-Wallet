import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Creditor {
  id: number;
  name: string;
  logo: string;
  description: string;
}

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donation.component.html'
})
export class DonationComponent {
  creditors: Creditor[] = [
    {
      id: 1,
      name: 'ALCS',
      logo: 'https://via.placeholder.com/150?text=ALCS',
      description: 'Association de Lutte Contre le Sida - Fighting against AIDS in Morocco'
    },
    {
      id: 2,
      name: 'AMH',
      logo: 'https://via.placeholder.com/150?text=AMH',
      description: 'Association Marocaine des Handicapés - Supporting people with disabilities'
    },
    {
      id: 3,
      name: 'SOS Villages d\'Enfants Maroc',
      logo: 'https://via.placeholder.com/150?text=SOS',
      description: 'Providing care and support for orphaned and abandoned children'
    },
    {
      id: 4,
      name: 'Fondation Mohammed V pour la Solidarité',
      logo: 'https://via.placeholder.com/150?text=FMV',
      description: 'Supporting social development and humanitarian initiatives'
    },
    {
      id: 5,
      name: 'Association Insaf',
      logo: 'https://via.placeholder.com/150?text=Insaf',
      description: 'Supporting single mothers and abandoned children'
    },
    {
      id: 6,
      name: 'Amicale Marocaine des Handicapés',
      logo: 'https://via.placeholder.com/150?text=AMH',
      description: 'Providing support and services for people with disabilities'
    },
    {
      id: 7,
      name: 'Association Marocaine de Soutien et d\'Aide aux personnes Trisomiques',
      logo: 'https://via.placeholder.com/150?text=AMSAT',
      description: 'Supporting individuals with Down syndrome and their families'
    },
    {
      id: 8,
      name: 'Bayti',
      logo: 'https://via.placeholder.com/150?text=Bayti',
      description: 'Working to protect and rehabilitate street children'
    },
    {
      id: 9,
      name: 'Association Solidarité Féminine',
      logo: 'https://via.placeholder.com/150?text=ASF',
      description: 'Supporting single mothers and promoting women\'s rights'
    }
  ];

  selectedCreditor: Creditor | null = null;
  amount: number = 0;
  motif: string = '';
  currentStep: number = 1;

  selectCreditor(creditor: Creditor) {
    this.selectedCreditor = creditor;
    this.currentStep = 2;
  }

  proceedToCheckout() {
    if (this.selectedCreditor && this.amount > 0) {
      console.log(`Donating ${this.amount} MAD to ${this.selectedCreditor.name}`);
      console.log(`Motif: ${this.motif}`);
      // Implement actual donation logic here
    }
  }

  goBack() {
    this.currentStep = 1;
    this.selectedCreditor = null;
    this.amount = 0;
    this.motif = '';
  }
}
