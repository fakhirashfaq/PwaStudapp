import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountTypeFilterComponent } from './discount-type-filter.component';

describe('DiscountTypeFilterComponent', () => {
  let component: DiscountTypeFilterComponent;
  let fixture: ComponentFixture<DiscountTypeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountTypeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
