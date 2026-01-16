import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Evaluacion } from "./evaluacion/evaluacion";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Evaluacion],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'RamosJavier_Prueba2P';
}
