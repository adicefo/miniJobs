import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistracijaMenuComponent } from './registracija-menu.component';

describe('RegistracijaMenuComponent', () => {
  let component: RegistracijaMenuComponent;
  let fixture: ComponentFixture<RegistracijaMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistracijaMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistracijaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
