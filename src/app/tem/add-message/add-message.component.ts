import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Asegúrate de importar ReactiveFormsModule
import { MessageserviceService } from '../messageservice.service';

@Component({
  selector: 'app-add-message',
  standalone: true,
  imports: [ReactiveFormsModule], // Incluye ReactiveFormsModule en el arreglo de imports
  templateUrl: './add-message.component.html',
  styles: []
})
export class AddMessageComponent implements OnInit {
  formGroup!: FormGroup; // Utiliza el operador ! para indicar que será inicializado posteriormente

  constructor(private fb: FormBuilder, public messageService: MessageserviceService) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      nombre: ['', Validators.required],  // FormControl para el nombre
    });
  }

  addAlumno() {
    if (this.formGroup.valid) {
      const alumno = this.formGroup.value.nombre;  // Obtiene el valor del FormControl 'nombre'
      this.messageService.add(alumno);  // Envía el nombre al servicio
      this.formGroup.reset();  // Resetea el formulario después de enviar los datos
    }
  }
}
