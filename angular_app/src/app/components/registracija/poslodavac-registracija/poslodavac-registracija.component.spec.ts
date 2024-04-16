import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoslodavacRegistracijaComponent } from './poslodavac-registracija.component';

describe('PoslodavacRegistracijaComponent', () => {
  let component: PoslodavacRegistracijaComponent;
  let fixture: ComponentFixture<PoslodavacRegistracijaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoslodavacRegistracijaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoslodavacRegistracijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
