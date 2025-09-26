// form-producto.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormProducto } from './form-producto';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../utils/services/productos.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../../shared/shared.module';
import { Producto } from '../../utils/models/producto.model';

describe('FormProducto', () => {
  let component: FormProducto;
  let fixture: ComponentFixture<FormProducto>;
  let productosService: ProductosService;
  let router: Router;

  const mockProducto: Producto = {
    id: 'uno',
    name: 'Jabones',
    description: 'Jabón líquido de manos',
    logo: 'https://logo.png',
    date_release: new Date('2025-09-25'),
    date_revision: new Date('2026-09-25'),
  };

  const mockProductosService = {
    getProductos: jasmine.createSpy('getProductos').and.returnValue(of([mockProducto])),
    createProductos: jasmine.createSpy('createProductos').and.returnValue(of(mockProducto)),
    updateProduct: jasmine.createSpy('updateProduct').and.returnValue(of(mockProducto)),
    verifyIDProduct: jasmine.createSpy('verifyIDProduct').and.returnValue(of(true)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        SharedComponentsModule,
        FormsModule,
        ReactiveFormsModule,
        FormProducto, // componente standalone
      ],
      providers: [
        { provide: ProductosService, useValue: mockProductosService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: () => 'uno' }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormProducto);
    component = fixture.componentInstance;
    productosService = TestBed.inject(ProductosService);
    router = TestBed.inject(Router);

    fixture.detectChanges(); // dispara ngOnInit
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    component.ingresoForm.patchValue({
      id: mockProducto.id,
      nombre: mockProducto.name,
      descripcion: mockProducto.description,
      logo: mockProducto.logo,
      fechaLiberacion: mockProducto.date_release,
      fechaRevision: mockProducto.date_revision,
    });

    const form = component.ingresoForm;
    expect(form.get('id')?.value).toBe(mockProducto.id);
    expect(form.get('nombre')?.value).toBe(mockProducto.name);
  });

  it('should mark form as invalid if required fields empty', () => {
    component.ingresoForm.get('nombre')?.setValue('');
    expect(component.ingresoForm.valid).toBeFalse();
  });

  it('should call ingresarProducto when guardar is called for new product', fakeAsync(() => {
    component.idProducto = null; // nuevo producto
    component.ingresoForm.setValue({
      id: 'dos',
      nombre: 'Botella',
      descripcion: 'Botella de plástico',
      logo: 'https://logo2.png',
      fechaLiberacion: new Date('2025-09-26'),
      fechaRevision: new Date('2026-09-26'),
    });

    component.idValido = true;

    component.guardar();
    tick();

    expect(productosService.createProductos).toHaveBeenCalled();
  }));

  it('should call editarProducto when guardar is called for existing product', fakeAsync(() => {
    component.idProducto = 'uno'; // producto existente
    component.ingresoForm.setValue({
      id: mockProducto.id,
      nombre: mockProducto.name,
      descripcion: mockProducto.description,
      logo: mockProducto.logo,
      fechaLiberacion: mockProducto.date_release,
      fechaRevision: mockProducto.date_revision,
    });

    component.guardar();
    tick();

    expect(productosService.updateProduct).toHaveBeenCalledWith('uno', jasmine.any(Object));
  }));

  it('should not call createProductos if idValido is false', () => {
    component.idProducto = null;
    component.idValido = false;
    component.guardar();
    expect(productosService.createProductos).not.toHaveBeenCalled();
  });

  it('should compute fechaRevision correctly based on fechaLiberacion', () => {
    const fechaInicio = new Date('2025-01-01');
    component.ingresoForm.get('fechaLiberacion')?.setValue(fechaInicio);
    const fechaRevision = new Date(component.ingresoForm.get('fechaRevision')?.value);
    expect(fechaRevision.getFullYear()).toBe(fechaInicio.getFullYear() + 1);
  });

  it('should reset all fields when limpiarForm is called', () => {
    component.ingresoForm.setValue({
      id: 'abc',
      nombre: 'test',
      descripcion: 'desc',
      logo: 'logo.png',
      fechaLiberacion: new Date(),
      fechaRevision: new Date(),
    });

    component.limpiarForm();

    Object.keys(component.ingresoForm.controls).forEach((key) => {
      expect(component.ingresoForm.get(key)?.value).toBeNull();
    });
  });
});
