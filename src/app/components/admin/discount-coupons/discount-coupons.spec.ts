import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountCoupons } from './discount-coupons';

describe('DiscountCoupons', () => {
  let component: DiscountCoupons;
  let fixture: ComponentFixture<DiscountCoupons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountCoupons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountCoupons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
