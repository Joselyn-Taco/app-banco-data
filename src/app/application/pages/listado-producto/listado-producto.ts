import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { SharedComponentsModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Producto } from '../../utils/models/producto.model';
import { ProductosService } from '../../utils/services/productos.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-listado-producto',
  standalone: true,
  imports: [CommonModule, SharedComponentsModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './listado-producto.html',
  styleUrl: './listado-producto.scss',
})
export class ListadoProducto implements OnInit {
  router = inject(Router);
  productosService = inject(ProductosService);

  itemProd: Producto[] = [];

  productos: Producto[] = [];

  menuAbierto: string | null = null;
  searchQuery: string | null = null;
  totalProd: number = 0;

  //paginacion
  dataPaginada: Producto[] = [];
  pageSizeOptions: number[] = [5, 10, 20];
  pageSize: number = 5;
  totalFiltrados: number = 0;
  currentPage: number = 1;

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productosService.getProductos().subscribe(
      (response: any) => {
        console.log('data ' + response.data);
        this.itemProd = response.data; // array completo
        this.productos = [...this.itemProd];
        this.totalProd = this.productos.length <= 2 ? 1 : 2;
        this.paginacionProductos();
      },
      (error) => {
        console.error('Servicio no disponible, inténtelo más tarde.');
      }
    );
  }

  filtrarReportes() {
    const q = this.searchQuery ? this.searchQuery.toLowerCase().trim() : '';

    if (!q) {
      this.productos = [...this.itemProd]; // resetear si no hay búsqueda
      return;
    }

    this.productos = this.itemProd.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.logo.toLowerCase().includes(q) ||
        item.id.toString().includes(q)
    );

    this.currentPage = 1;
    this.paginacionProductos();
  }

  paginacionProductos() {
    const startNumRegist = (this.currentPage - 1) * this.pageSize;
    let endNumRegist = Math.ceil(Number(startNumRegist) + Number(this.pageSize)); //Nos aseguramos que sean numeros para sumarlos
    console.log('Entro a get' + this.productos.length);
    this.dataPaginada = this.productos.slice(startNumRegist, endNumRegist);
  }

  get totalPages() {
    return Math.ceil(this.productos.length / this.pageSize);
  }

  get totalProductos() {
    return Math.ceil(this.productos.length);
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.paginacionProductos();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginacionProductos();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginacionProductos();
    }
  }

  @HostListener('document:click', ['$event'])
  clickFuera(event: Event) {
    const target = event.target as HTMLElement;
    const dentroDropdown = target.closest('.dropdown');

    // si se hace clic fuera de cualquier dropdown → cerrar
    if (!dentroDropdown) {
      this.menuAbierto = null;
    }
  }

  redirigirRuta(ruta: string) {
    this.router.navigate(['/' + ruta]);
  }

  toggleMenu(id: string) {
    this.menuAbierto = this.menuAbierto === id ? null : id;
  }

  editar(product: Producto) {
    console.log('Editar:', product);
    this.menuAbierto = null;
    this.redirigirRuta('editar_producto/' + product.id);
  }

  eliminar(product: Producto) {
    console.log('Eliminar:', product);
    this.menuAbierto = null;
  }
}
