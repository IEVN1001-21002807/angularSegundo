import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Definición de la interfaz para el empleado
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

  // Lista de empleados
  empleados: Empleado[] = [];

  // Objeto para el nuevo empleado o el que está siendo editado
  nuevoEmpleado: Empleado = {
    matricula: '',
    nombre: '',
    correo: '',
    edad: 0,
    horasTrabajadas: 0
  };

  // Variables para mensajes de retroalimentación
  mensaje: string = '';
  mensajeTipo: string = ''; // 'exito', 'error', 'advertencia'

  // Variables para manejo de edición de empleado
  editando: boolean = false;
  matriculaOriginal: string = '';

  // Variable para buscar empleado por matrícula
  matriculaBuscar: string = '';  

  constructor() {
    this.cargarEmpleados(); // Cargar empleados almacenados en localStorage al inicializar el componente
  }

  // Registrar o modificar empleado
  registrarEmpleado() {
    if (this.editando) {
      const index = this.empleados.findIndex(emp => emp.matricula === this.matriculaOriginal);
      if (index !== -1) {
        this.empleados[index] = { ...this.nuevoEmpleado }; // Modificar empleado existente
        this.mensaje = 'Empleado modificado con éxito.';
        this.mensajeTipo = 'exito';
      } else {
        this.mensaje = 'No se encontró el empleado para modificar.';
        this.mensajeTipo = 'error';
      }
      this.editando = false;
      this.matriculaOriginal = '';
    } else {
      this.empleados.push({ ...this.nuevoEmpleado }); // Registrar nuevo empleado
      this.mensaje = 'Empleado registrado con éxito.';
      this.mensajeTipo = 'exito';
    }
    this.guardarEmpleados(); // Guardar en localStorage
    this.limpiarFormulario(); // Limpiar el formulario después de registrar
  }

  // Modificar empleado encontrado por matrícula
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

  // Eliminar empleado encontrado por matrícula
  eliminarEmpleadoPorMatricula() {
    const index = this.empleados.findIndex(emp => emp.matricula === this.matriculaBuscar);
    if (index !== -1) {
      this.empleados.splice(index, 1); // Eliminar empleado
      this.mensaje = 'Empleado eliminado con éxito.';
      this.mensajeTipo = 'exito';
      this.guardarEmpleados(); // Actualizar localStorage
    } else {
      this.mensaje = 'Empleado no encontrado.';
      this.mensajeTipo = 'error';
    }
  }

  // Calcular el pago de un empleado
  calcularPago(empleado: Empleado): number {
    const tarifaNormal = 70;
    const tarifaExtra = 140;
    const horasExtra = empleado.horasTrabajadas > 40 ? empleado.horasTrabajadas - 40 : 0;
    const horasNormales = empleado.horasTrabajadas - horasExtra;
    return (horasNormales * tarifaNormal) + (horasExtra * tarifaExtra);
  }

  // Calcular el total a pagar a todos los empleados
  calcularTotalPago(): number {
    return this.empleados.reduce((total, empleado) => total + this.calcularPago(empleado), 0);
  }

  // Guardar empleados en localStorage
  guardarEmpleados() {
    localStorage.setItem('empleados', JSON.stringify(this.empleados));
  }

  // Cargar empleados desde localStorage
  cargarEmpleados() {
    const empleadosGuardados = localStorage.getItem('empleados');
    if (empleadosGuardados) {
      this.empleados = JSON.parse(empleadosGuardados);
    }
  }

  // Limpiar el formulario para registrar un nuevo empleado
  limpiarFormulario() {
    this.nuevoEmpleado = { matricula: '', nombre: '', correo: '', edad: 0, horasTrabajadas: 0 };
    this.matriculaBuscar = ''; // Limpiar la búsqueda también
  }
}
