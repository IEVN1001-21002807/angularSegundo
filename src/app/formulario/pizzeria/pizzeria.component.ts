import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface OrdenPizza {
  id?: number;
  clienteNombre: string;
  clienteDireccion: string;
  clienteTelefono: string;
  fechaCompra: string;
  detallePedido: {
    tamano: string;
    ingredientes: string[];
    cantidad: number;
  };
  precioTotal: number;
}

interface PedidoCompleto {
  fechaPedido: string;
  nombreCliente: string;
  direccionCliente: string;
  telefonoCliente: string;
  listaPedidos: OrdenPizza[];
  totalPedido: number;
}

@Component({
  selector: 'app-pizzeria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pizzeria.component.html',
})
export default class PizzeriaComponent implements OnInit {
  @ViewChild('fechaVentas') fechaVentas!: ElementRef;
  formularioPedido!: FormGroup;
  pedidos: OrdenPizza[] = [];
  opcionesIngredientes = ['Jamon', 'Piña', 'Champiñones'];
  opcionesTamanos = ['Pequeña', 'Mediana', 'Grande'];
  totalPedido: number = 0;
  ventasDelDia: PedidoCompleto[] = [];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    try {
      this.iniciarFormulario();
      this.cargarPedidosDeLocalStorage();
      console.log('Formulario inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar el formulario', error);
    }
  }

  private iniciarFormulario() {
    try {
      const fechaActual = new Date().toISOString().split('T')[0]; // Obtener fecha actual en formato YYYY-MM-DD
      this.formularioPedido = this.formBuilder.group({
        clienteNombre: ['', Validators.required],
        clienteDireccion: ['', Validators.required],
        clienteTelefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        fechaCompra: [{ value: fechaActual, disabled: false }, Validators.required],
        tamano: ['', Validators.required],
        ingredientes: this.formBuilder.group({
          Jamon: [false],
          Piña: [false],
          Champiñones: [false]
        }),
        cantidad: [1, [Validators.required, Validators.min(1)]]
      });
      console.log('Formulario de pedido creado con éxito');
    } catch (error) {
      console.error('Error al crear el formulario', error);
    }
  }

  private calcularPrecio(tamano: string, ingredientes: string[], cantidad: number): number {
    let precio = 0;
    switch (tamano) {
      case 'Pequeña':
        precio = 40;
        break;
      case 'Mediana':
        precio = 80;
        break;
      case 'Grande':
        precio = 120;
        break;
    }
    precio += ingredientes.length * 10;
    return precio * cantidad;
  }

  onSubmit() {
    try {
      if (this.formularioPedido.valid) {
        const ingredientesSeleccionados = Object.entries(this.formularioPedido.value.ingredientes)
          .filter(([_, seleccionado]) => seleccionado)
          .map(([ingrediente]) => ingrediente);

        const nuevoPedido: OrdenPizza = {
          clienteNombre: this.formularioPedido.value.clienteNombre,
          clienteDireccion: this.formularioPedido.value.clienteDireccion,
          clienteTelefono: this.formularioPedido.value.clienteTelefono,
          fechaCompra: this.formularioPedido.get('fechaCompra')?.value,
          detallePedido: {
            tamano: this.formularioPedido.value.tamano,
            ingredientes: ingredientesSeleccionados,
            cantidad: this.formularioPedido.value.cantidad
          },
          precioTotal: this.calcularPrecio(this.formularioPedido.value.tamano, ingredientesSeleccionados, this.formularioPedido.value.cantidad)
        };

        if (this.pedidos.length > 0) {
          const ultimoPedido = this.pedidos[0];
          if (
            ultimoPedido.clienteNombre !== nuevoPedido.clienteNombre ||
            ultimoPedido.clienteDireccion !== nuevoPedido.clienteDireccion ||
            ultimoPedido.clienteTelefono !== nuevoPedido.clienteTelefono
          ) {
            alert('Finaliza el pedido actual primero');
            return;
          }
        }

        this.pedidos.push(nuevoPedido);
        this.totalPedido += nuevoPedido.precioTotal;
        console.log('Pedido agregado correctamente', nuevoPedido);

        // Guardar pedidos en el almacenamiento local
        this.guardarPedidosEnLocalStorage();

        // Resetear solo los campos específicos de pizza, manteniendo la información del cliente
        this.formularioPedido.patchValue({
          tamano: '',
          ingredientes: {
            Jamon: false,
            Piña: false,
            Champiñones: false
          },
          cantidad: 1
        });
      } else {
        console.warn('Formulario inválido');
      }
    } catch (error) {
      console.error('Error al agregar pedido', error);
    }
  }

  eliminarPedido(indice: number) {
    try {
      this.totalPedido -= this.pedidos[indice].precioTotal;
      this.pedidos.splice(indice, 1);
      console.log('Pedido eliminado correctamente', indice);

      // Guardar cambios en el almacenamiento local
      this.guardarPedidosEnLocalStorage();
    } catch (error) {
      console.error('Error al eliminar pedido', error);
    }
  }

  enviarPedido() {
    if (this.pedidos.length > 0) {
      const pedidoCompleto: PedidoCompleto = {
        fechaPedido: this.formularioPedido.get('fechaCompra')?.value,
        nombreCliente: this.formularioPedido.value.clienteNombre,
        direccionCliente: this.formularioPedido.value.clienteDireccion,
        telefonoCliente: this.formularioPedido.value.clienteTelefono,
        listaPedidos: this.pedidos,
        totalPedido: this.totalPedido
      };

      const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
      pedidosGuardados.push(pedidoCompleto);
      localStorage.setItem('pedidos', JSON.stringify(pedidosGuardados));

      alert('Pedido guardado exitosamente en el almacenamiento local');
      this.pedidos = []; // Limpiar pedidos después del envío exitoso
      this.totalPedido = 0; // Resetear el total
      this.formularioPedido.reset(); // Reiniciar formulario
      this.iniciarFormulario(); // Re-inicializar el formulario para poner la fecha actual

      // Guardar pedidos actualizados en el almacenamiento local
      this.guardarPedidosEnLocalStorage();
    } else {
      alert('No hay pedidos para enviar');
    }
  }

  obtenerVentasDelDia() {
    const fechaSeleccionada = this.fechaVentas.nativeElement.value;
    console.log('Obteniendo ventas del día para', fechaSeleccionada);
    try {
      const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
      this.ventasDelDia = pedidosGuardados.filter((pedido: any) => pedido.fechaPedido === fechaSeleccionada);
      console.log('Ventas del día obtenidas correctamente', this.ventasDelDia);
    } catch (error) {
      console.error('Error al obtener las ventas del día', error);
      alert('Error al obtener las ventas del día');
    }
  }

  private guardarPedidosEnLocalStorage() {
    localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
  }

  private cargarPedidosDeLocalStorage() {
    const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
    this.pedidos = pedidosGuardados;
    this.totalPedido = this.pedidos.reduce((total, pedido) => total + pedido.precioTotal, 0);
  }
}
