import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-resistencias',
  standalone: true,
  imports: [FormsModule, CommonModule],  
  templateUrl: './resistencias.component.html',
})
export default class ResistenciasComponent {
  banda1: number = 0;
  banda2: number = 0;
  banda3: number = 0; 
  tolerancia: string = 'Dorado'; 
  valor: number = 0;
  valorMax: number = 0;
  valorMin: number = 0;
  mostrarTabla: boolean = false;

  resistenciasRegistradas: any[] = [];

  calcularResistencia() {
    const banda1Valor = this.banda1.toString();
    const banda2Valor = this.banda2.toString();
    this.valor = parseInt(banda1Valor + banda2Valor) * this.getMultiplicador(this.banda3);

    const toleranciaPorcentaje = this.tolerancia === 'Dorado' ? 0.05 : 0.1; 
    this.valorMax = this.valor + this.valor * toleranciaPorcentaje;
    this.valorMin = this.valor - this.valor * toleranciaPorcentaje;

    this.resistenciasRegistradas.push({
      banda1: this.getColorName(this.banda1),
      banda2: this.getColorName(this.banda2),
      banda3: this.getColorName(this.banda3),
      tolerancia: this.tolerancia,
      valor: this.valor,
      valorMax: this.valorMax,
      valorMin: this.valorMin
    });

    const resistenciaParaGuardar = {
      banda1: this.getColorName(this.banda1),
      banda2: this.getColorName(this.banda2),
      banda3: this.getColorName(this.banda3),
      tolerancia: this.tolerancia
    };

    localStorage.setItem('resistencia', JSON.stringify(resistenciaParaGuardar));

    this.mostrarTabla = true;
  }

  setTolerancia(opcion: string) {
    this.tolerancia = opcion;
  }

  getMultiplicador(banda: number): number {
    const multiplicadores = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];
    return multiplicadores[banda] || 1;
  }

  getColorName(banda: number): string {
    const colores = ['Negro', 'Café', 'Rojo', 'Naranja', 'Amarillo', 'Verde', 'Azul', 'Violeta', 'Gris', 'Blanco', 'Dorado', 'Plata'];
    return colores[banda] || '';
  }

  getColorCode(color: string): string {
    const colores: { [key: string]: string } = { 
      'Negro': '#000000',
      'Café': '#8B4513',
      'Rojo': '#FF0000',
      'Naranja': '#FFA500',
      'Amarillo': '#FFFF00',
      'Verde': '#008000',
      'Azul': '#0000FF',
      'Violeta': '#EE82EE',
      'Gris': '#808080',
      'Blanco': '#FFFFFF',
      'Dorado': '#FFD700',
      'Plata': '#BEBEBE'
    };
    return colores[color] || '#000000';
  }
}
