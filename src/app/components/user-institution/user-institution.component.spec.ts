import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInstitutionComponent } from './user-institution.component';

describe('UserInstitutionComponent', () => {
  let component: UserInstitutionComponent;
  let fixture: ComponentFixture<UserInstitutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInstitutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
