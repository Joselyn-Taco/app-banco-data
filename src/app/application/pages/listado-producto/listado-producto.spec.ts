import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListadoProducto } from './listado-producto';
import { ProductosService } from '../../utils/services/productos.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('ListadoProducto', () => {
  let component: ListadoProducto;
  let fixture: ComponentFixture<ListadoProducto>;
  let productosServiceMock: any;
  let routerMock: any;

  const mockProductos = [
    {
      id: 'uno',
      name: 'jabones',
      description: 'Jabo',
      logo: '',
      date_release: new Date('2025-09-25'),
      date_revision: new Date('2026-09-25'),
    },
    {
      id: 'dos',
      name: 'botellas',
      description: 'Botella',
      logo: '',
      date_release: new Date('2025-09-26'),
      date_revision: new Date('2026-09-26'),
    },
    {
      id: 'tres',
      name: 'lapicero',
      description: 'Lapices',
      logo: '',
      date_release: new Date('2025-09-27'),
      date_revision: new Date('2026-09-27'),
    },
  ];

  beforeEach(async () => {
    productosServiceMock = {
      getProductos: jasmine.createSpy('getProductos').and.returnValue(of(mockProductos)),
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ListadoProducto],
      declarations: [],
      providers: [
        { provide: ProductosService, useValue: productosServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoProducto);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', fakeAsync(() => {
    fixture.detectChanges(); // dispara ngOnInit

    tick(); // deja que se resuelvan las suscripciones
    fixture.detectChanges();

    expect(productosServiceMock.getProductos).toHaveBeenCalled();
    expect(component.productos.length).toBe(3);
    expect(component.dataPaginada.length).toBe(3); // pageSize=5 y solo 3 items
  }));

  it('should filter products correctly', () => {
    component.itemProd = [
      {
        id: 'uno',
        name: 'jabones',
        description: 'Jabo',
        logo: '',
        date_release: new Date(),
        date_revision: new Date(),
      },
      {
        id: 'dos',
        name: 'botellas',
        description: 'Botella',
        logo: '',
        date_release: new Date(),
        date_revision: new Date(),
      },
      {
        id: 'tres',
        name: 'lapicero',
        description: 'Lapices',
        logo: '',
        date_release: new Date(),
        date_revision: new Date(),
      },
    ];

    component.productos = [...component.itemProd]; // inicializar también productos
    component.currentPage = 1;

    // Caso: encuentra 1 producto
    component.searchQuery = 'jabones';
    component.filtrarReportes();
    expect(component.productos.length).toBe(1);
    expect(component.productos[0].id).toBe('uno');

    // Caso: no encuentra ninguno
    component.searchQuery = 'no-existe';
    component.filtrarReportes();
    expect(component.productos.length).toBe(0);
  });

  it('should paginate correctly', () => {
    component.ngOnInit();
    component.productos = [
      {
        id: 'uno',
        name: 'jabones',
        description: 'Jabo',
        logo: '',
        date_release: new Date('2025-09-25'),
        date_revision: new Date('2026-09-25'),
      },
      {
        id: 'dos',
        name: 'botellas',
        description: 'Botella',
        logo: '',
        date_release: new Date('2025-09-26'),
        date_revision: new Date('2026-09-26'),
      },
      {
        id: 'tres',
        name: 'lapicero',
        description: 'Lapices',
        logo: '',
        date_release: new Date('2025-09-27'),
        date_revision: new Date('2026-09-27'),
      },
    ];
    component.pageSize = 2;
    component.currentPage = 1;
    component.paginacionProductos();
    expect(component.dataPaginada.length).toBe(2);

    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(component.dataPaginada.length).toBe(1);

    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should toggle dropdown menu', () => {
    component.toggleMenu('uno');
    expect(component.menuAbierto).toBe('uno');

    component.toggleMenu('uno');
    expect(component.menuAbierto).toBeNull();
  });

  it('should redirect on editar', () => {
    component.editar(mockProductos[0]);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/editar_producto/' + mockProductos[0].id]);
    expect(component.menuAbierto).toBeNull();
  });

  it('should clear menuAbierto on eliminar', () => {
    component.menuAbierto = 'uno';
    component.eliminar(mockProductos[0]);
    expect(component.menuAbierto).toBeNull();
  });
});
