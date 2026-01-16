import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-evaluacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluacion.html',
  styleUrl: './evaluacion.css'
})
export class Evaluacion {
  nombre: string = 'Javier';
  nota1: number | null = 4;
  nota2: number | null = 7;
  comentarios: string = 'Universidad de las Fuerzas Armadas ESPE sede';
  resultadoDado: string | null = null;

  dado(): boolean {
    const num = Math.floor(Math.random() * 6) + 1;
    this.resultadoDado = `Número: ${num} - ${num % 2 === 0 ? 'Par' : 'Impar'}`;
    return num % 2 === 0;
  }

}