import { Routes } from '@angular/router';
import { ListadoProducto } from './application/pages/listado-producto/listado-producto';
import { FormProducto } from './application/pages/producto/form-producto';

export const routes: Routes = [
  { path: 'editar_producto/:id', component: FormProducto },
  { path: 'ingreso_producto', component: FormProducto },
  { path: 'productos', component: ListadoProducto },
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: '**', redirectTo: 'productos' },
];
