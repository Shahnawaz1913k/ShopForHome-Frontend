import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistPanel } from './wishlist-panel';

describe('WishlistPanel', () => {
  let component: WishlistPanel;
  let fixture: ComponentFixture<WishlistPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishlistPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
