import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserInsEmailComponent } from './edit-user-ins-email.component';

describe('EditUserInsEmailComponent', () => {
  let component: EditUserInsEmailComponent;
  let fixture: ComponentFixture<EditUserInsEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUserInsEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserInsEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
