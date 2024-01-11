import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitaoDetalhesComponent } from './capitao-detalhes.component';

describe('CapitaoDetalhesComponent', () => {
  let component: CapitaoDetalhesComponent;
  let fixture: ComponentFixture<CapitaoDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapitaoDetalhesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapitaoDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
