import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyInstitutionComponent } from './verify-institution.component';

describe('VerifyInstitutionComponent', () => {
  let component: VerifyInstitutionComponent;
  let fixture: ComponentFixture<VerifyInstitutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyInstitutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
