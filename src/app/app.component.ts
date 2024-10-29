import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddMessageComponent } from './tem/add-message/add-message.component'; 
import { ListMessageComponent } from './tem/list-message/list-message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, AddMessageComponent, ListMessageComponent, ReactiveFormsModule], // Asegúrate de que ReactiveFormsModule está aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularSegundo';
}
