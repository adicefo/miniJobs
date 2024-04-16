import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilPoslodavacComponent } from './profil-poslodavac.component';

describe('ProfilPoslodavacComponent', () => {
  let component: ProfilPoslodavacComponent;
  let fixture: ComponentFixture<ProfilPoslodavacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilPoslodavacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilPoslodavacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
