import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProfPicComponent } from './upload-prof-pic.component';

describe('UploadProfPicComponent', () => {
  let component: UploadProfPicComponent;
  let fixture: ComponentFixture<UploadProfPicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadProfPicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProfPicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
