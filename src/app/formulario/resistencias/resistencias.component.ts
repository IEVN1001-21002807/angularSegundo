import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Importa FormsModule para ngModel

@Component({
  selector: 'app-resistencias',
  standalone: true,
  imports: [FormsModule],  // Asegúrate de importar FormsModule aquí
  templateUrl: './resistencias.component.html',
  styleUrls: ['./resistencias.component.css']
})
export class ResistenciasComponent {
  banda1: number = 0;
  banda2: number = 0;
  multiplicador: number = 1;
  tolerancia: number = 5;
  valor: number = 0;
  valorMax: number = 0;
  valorMin: number = 0;
  mostrarTabla: boolean = false;

  calcularResistencia() {
    const banda1Valor = this.banda1.toString();
    const banda2Valor = this.banda2.toString();
    this.valor = parseInt(banda1Valor + banda2Valor) * this.multiplicador;

    const toleranciaPorcentaje = this.tolerancia / 100;
    this.valorMax = this.valor + this.valor * toleranciaPorcentaje;
    this.valorMin = this.valor - this.valor * toleranciaPorcentaje;

    localStorage.setItem('resistencia', JSON.stringify({
      banda1: this.banda1,
      banda2: this.banda2,
      multiplicador: this.multiplicador,
      tolerancia: this.tolerancia,
      valor: this.valor,
      valorMax: this.valorMax,
      valorMin: this.valorMin
    }));

    this.mostrarTabla = true;
  }
}
