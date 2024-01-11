import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitaoCriacaoComponent } from './capitao-criacao.component';

describe('CapitaoCriacaoComponent', () => {
  let component: CapitaoCriacaoComponent;
  let fixture: ComponentFixture<CapitaoCriacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapitaoCriacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapitaoCriacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
