import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PirataDetalhesComponent } from './pirata-detalhes.component';

describe('PirataDetalhesComponent', () => {
  let component: PirataDetalhesComponent;
  let fixture: ComponentFixture<PirataDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PirataDetalhesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PirataDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
