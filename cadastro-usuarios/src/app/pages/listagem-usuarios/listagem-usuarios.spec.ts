import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemUsuarios } from './listagem-usuarios';

describe('ListagemUsuarios', () => {
  let component: ListagemUsuarios;
  let fixture: ComponentFixture<ListagemUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
