import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Empleado {
  matricula: string;
  nombre: string;
  correo: string;
  edad: number;
  horasTrabajadas: number;
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleados.component.html'
})
export default class EmpleadosComponent {

  empleados: Empleado[] = [];

  nuevoEmpleado: Empleado = {
    matricula: '',
    nombre: '',
    correo: '',
    edad: 0,
    horasTrabajadas: 0
  };

  mensaje: string = '';
  mensajeTipo: string = ''; 

  editando: boolean = false;
  matriculaOriginal: string = '';

  matriculaBuscar: string = '';  

  constructor() {
    this.cargarEmpleados(); 
  }

  registrarEmpleado() {
    if (this.editando) {
      const index = this.empleados.findIndex(emp => emp.matricula === this.matriculaOriginal);
      if (index !== -1) {
        this.empleados[index] = { ...this.nuevoEmpleado }; 
        this.mensaje = 'Empleado modificado con éxito.';
        this.mensajeTipo = 'exito';
      } else {
        this.mensaje = 'No se encontró el empleado para modificar.';
        this.mensajeTipo = 'error';
      }
      this.editando = false;
      this.matriculaOriginal = '';
    } else {
      this.empleados.push({ ...this.nuevoEmpleado }); 
      this.mensaje = 'Empleado registrado con éxito.';
      this.mensajeTipo = 'exito';
    }
    this.guardarEmpleados(); 
    this.limpiarFormulario();
  }

  modificarEmpleadoPorMatricula() {
    const empleado = this.empleados.find(emp => emp.matricula === this.matriculaBuscar);
    if (empleado) {
      this.nuevoEmpleado = { ...empleado };
      this.editando = true;
      this.matriculaOriginal = empleado.matricula;
      this.mensaje = 'Empleado listo para modificar.';
      this.mensajeTipo = 'advertencia';
    } else {
      this.mensaje = 'Empleado no encontrado.';
      this.mensajeTipo = 'error';
    }
  }

  eliminarEmpleadoPorMatricula() {
    const index = this.empleados.findIndex(emp => emp.matricula === this.matriculaBuscar);
    if (index !== -1) {
      this.empleados.splice(index, 1); 
      this.mensaje = 'Empleado eliminado con éxito.';
      this.mensajeTipo = 'exito';
      this.guardarEmpleados(); 
    } else {
      this.mensaje = 'Empleado no encontrado.';
      this.mensajeTipo = 'error';
    }
  }

  calcularPago(empleado: Empleado): number {
    const tarifaNormal = 70;
    const tarifaExtra = 140;
    const horasExtra = empleado.horasTrabajadas > 40 ? empleado.horasTrabajadas - 40 : 0;
    const horasNormales = empleado.horasTrabajadas - horasExtra;
    return (horasNormales * tarifaNormal) + (horasExtra * tarifaExtra);
  }

  calcularTotalPago(): number {
    return this.empleados.reduce((total, empleado) => total + this.calcularPago(empleado), 0);
  }

  calcularHorasNormales(empleado: Empleado): number {
    return empleado.horasTrabajadas > 40 ? 40 : empleado.horasTrabajadas;
  }

  calcularHorasExtras(empleado: Empleado): number {
    return empleado.horasTrabajadas > 40 ? empleado.horasTrabajadas - 40 : 0;
  }

  guardarEmpleados() {
    localStorage.setItem('empleados', JSON.stringify(this.empleados));
  }

  cargarEmpleados() {
    const empleadosGuardados = localStorage.getItem('empleados');
    if (empleadosGuardados) {
      this.empleados = JSON.parse(empleadosGuardados);
    }
  }

  limpiarFormulario() {
    this.nuevoEmpleado = { matricula: '', nombre: '', correo: '', edad: 0, horasTrabajadas: 0 };
    this.matriculaBuscar = ''; 
  }
}
