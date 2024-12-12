import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletOrbitComponent } from './wallet-orbit.component';

describe('WalletOrbitComponent', () => {
  let component: WalletOrbitComponent;
  let fixture: ComponentFixture<WalletOrbitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletOrbitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletOrbitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
