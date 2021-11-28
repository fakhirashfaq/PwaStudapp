import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StubudButtonComponent } from './stubud-button.component';

describe('StubudButtonComponent', () => {
  let component: StubudButtonComponent;
  let fixture: ComponentFixture<StubudButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StubudButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StubudButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
