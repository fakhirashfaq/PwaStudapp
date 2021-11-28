import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DnDFUploaderComponent } from './dn-d-f-uploader.component';

describe('DnDFUploaderComponent', () => {
  let component: DnDFUploaderComponent;
  let fixture: ComponentFixture<DnDFUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DnDFUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DnDFUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
