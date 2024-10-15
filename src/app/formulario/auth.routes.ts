import { Routes } from "@angular/router";

export default [
    {
        path: 'ejemplo1',
        loadComponent: () => import('./ejemplo1').then(m => m.Ejemplo1Component),
    }
] as Routes;
