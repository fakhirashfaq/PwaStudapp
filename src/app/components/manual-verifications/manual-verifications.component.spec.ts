import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualVerificationsComponent } from './manual-verifications.component';

describe('ManualVerificationsComponent', () => {
  let component: ManualVerificationsComponent;
  let fixture: ComponentFixture<ManualVerificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualVerificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualVerificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
