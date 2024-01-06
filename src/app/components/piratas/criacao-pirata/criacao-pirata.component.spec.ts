import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriacaoPirataComponent } from './criacao-pirata.component';

describe('CriacaoPirataComponent', () => {
  let component: CriacaoPirataComponent;
  let fixture: ComponentFixture<CriacaoPirataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriacaoPirataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriacaoPirataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
