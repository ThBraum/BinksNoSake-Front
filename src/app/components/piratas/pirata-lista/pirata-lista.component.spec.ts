import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PirataListaComponent } from './pirata-lista.component';

describe('PirataListaComponent', () => {
  let component: PirataListaComponent;
  let fixture: ComponentFixture<PirataListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PirataListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PirataListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
