import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitaoListaComponent } from './capitao-lista.component';

describe('CapitaoListaComponent', () => {
  let component: CapitaoListaComponent;
  let fixture: ComponentFixture<CapitaoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapitaoListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapitaoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
