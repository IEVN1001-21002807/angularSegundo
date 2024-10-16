import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-resistencias',
  standalone: true,
  imports: [FormsModule, CommonModule],  
  templateUrl: './resistencias.component.html',
  styleUrls: ['./resistencias.component.css']
})
export default class ResistenciasComponent {
  banda1: number = 0;
  banda2: number = 0;
  banda3: number = 0; 
  tolerancia: number = 5;
  valor: number = 0;
  valorMax: number = 0;
  valorMin: number = 0;
  mostrarTabla: boolean = false;

  calcularResistencia() {
    const banda1Valor = this.banda1.toString();
    const banda2Valor = this.banda2.toString();
    this.valor = parseInt(banda1Valor + banda2Valor) * this.getMultiplicador(this.banda3);

    const toleranciaPorcentaje = this.tolerancia / 100;
    this.valorMax = this.valor + this.valor * toleranciaPorcentaje;
    this.valorMin = this.valor - this.valor * toleranciaPorcentaje;

    localStorage.setItem('resistencia', JSON.stringify({
      banda1: this.banda1,
      banda2: this.banda2,
      banda3: this.banda3,
      tolerancia: this.tolerancia,
      valor: this.valor,
      valorMax: this.valorMax,
      valorMin: this.valorMin
    }));

    this.mostrarTabla = true;
  }

  getMultiplicador(banda: number): number {
    const multiplicadores = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];
    return multiplicadores[banda] || 1;
  }
  getColorName(banda: number): string {
    const colores = ['Negro', 'Café', 'Rojo', 'Naranja', 'Amarillo', 'Verde', 'Azul', 'Violeta', 'Gris', 'Blanco'];
    return colores[banda] || '';
  }
  getColorCode(banda: number): string {
    const colores = ['#000000', '#8B4513', '#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#EE82EE', '#808080', '#FFFFFF'];
    return colores[banda] || '#000000'; 
  }


}
