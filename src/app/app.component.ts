import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddMessageComponent } from './tem/add-message/add-message.component'; 
import { ListMessageComponent } from './tem/list-message/list-message.component';
import { CapturaPedidoComponent } from './pizzeria/captura-pedido/captura-pedido.component';
import { DetallePedidoComponent } from './pizzeria/detalle-pedido/detalle-pedido.component';
import { VentasDiaComponent } from './pizzeria/ventas-dia/ventas-dia.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, AddMessageComponent, ListMessageComponent, ReactiveFormsModule, CapturaPedidoComponent, DetallePedidoComponent, VentasDiaComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularSegundo';
}
