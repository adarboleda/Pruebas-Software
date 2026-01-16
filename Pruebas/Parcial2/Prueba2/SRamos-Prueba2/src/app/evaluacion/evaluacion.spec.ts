import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Evaluacion } from './evaluacion';

describe('Evaluacion', () => {
  let component: Evaluacion;
  let fixture: ComponentFixture<Evaluacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Evaluacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Evaluacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe verificar que el campo nombre sea Su Nombre', () => {
    const nombreInput = fixture.nativeElement.querySelector('#nombre');
    expect(nombreInput.value).toEqual('Javier');
  });

  it('debe verificar que nota1 sea menor que nota2', () => {
    const nota1Input = fixture.nativeElement.querySelector('#nota1');
    const nota2Input = fixture.nativeElement.querySelector('#nota2');
    expect(Number(nota1Input.value)).toBeLessThan(Number(nota2Input.value));
  });

  it('debe verificar que el textarea contenga Universidad de las Fuerzas Armadas ESPE', () => {
    const comentariosInput = fixture.nativeElement.querySelector('#comentarios');
    expect(comentariosInput.value).toMatch('Universidad de las Fuerzas Armadas ESPE');
  });

  it('debe verificar que dado retorna true para un número par', () => {
    const resultado = component.dado();
    fixture.detectChanges();
    const resultadoDado = fixture.nativeElement.querySelector('p');
    expect(resultado).toBeTruthy(); 
    expect(resultadoDado.textContent).toContain('Par'); 
  });

  it('debe verificar que el h1 contenga Evaluación Segundo Parcial', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Evaluación Segundo Parcial'); 
  });
});
