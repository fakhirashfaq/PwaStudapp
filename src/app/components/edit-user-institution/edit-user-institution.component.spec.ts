import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserInstitutionComponent } from './edit-user-institution.component';

describe('EditUserInstitutionComponent', () => {
  let component: EditUserInstitutionComponent;
  let fixture: ComponentFixture<EditUserInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUserInstitutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
