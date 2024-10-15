import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface Usuario{
  nombre: string;
  edad: number;
  email:string;
}

@Component({
  selector: 'app-ejemplo1',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ejemplo1.component.html',
  styles: ``
})
export class Ejemplo1Component implements OnInit {
  formGroup!: FormGroup;
  nombre:string="Citlali Gtz"

  persona:Usuario={
    nombre:'',
    edad:0,
    email:''
  }

  constructor(private readonly fb: FormBuilder){}

  ngOnInit(): void {
    this.formGroup = this.initForm();
  }
  initForm():FormGroup{
    return this.fb.group({
      nombre:[''],
      edad:[''],
      email:['']
    })
  }
  onSubmit():void{
    const {nombre, edad, email}= this.formGroup.value;
    this.persona.nombre=nombre
    this.persona.edad=edad
    this.persona.email=email

    let personaJSON = JSON.stringify(this.persona);

    localStorage.setItem("persona", personaJSON);

    //localStorage.setItem("nombre",this.nombre);
  }

  subImprime():void{
    const usuarioGuardado = localStorage.getItem('persona');
    if (usuarioGuardado){
      const usuarioRecuperado: Usuario = JSON.parse(usuarioGuardado);
      this.persona=usuarioRecuperado;
    }
  }
}
