import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantPartnersComponent } from './merchant-partners.component';

describe('MerchantPartnersComponent', () => {
  let component: MerchantPartnersComponent;
  let fixture: ComponentFixture<MerchantPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MerchantPartnersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
