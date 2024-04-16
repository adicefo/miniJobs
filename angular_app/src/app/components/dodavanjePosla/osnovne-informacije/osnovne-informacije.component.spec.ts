import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsnovneInformacijeComponent } from './osnovne-informacije.component';

describe('OsnovneInformacijeComponent', () => {
  let component: OsnovneInformacijeComponent;
  let fixture: ComponentFixture<OsnovneInformacijeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OsnovneInformacijeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OsnovneInformacijeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
