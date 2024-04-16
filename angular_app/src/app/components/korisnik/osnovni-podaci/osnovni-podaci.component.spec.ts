import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsnovniPodaciComponent } from './osnovni-podaci.component';

describe('OsnovniPodaciComponent', () => {
  let component: OsnovniPodaciComponent;
  let fixture: ComponentFixture<OsnovniPodaciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OsnovniPodaciComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OsnovniPodaciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
