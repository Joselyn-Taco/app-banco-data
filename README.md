# AppBancoData

Este proyecto fue generado utilizando [Angular CLI](https://github.com/angular/angular-cli) version 20.3.2.

## Servidor de desarrollo

Para iniciar un servidor de desarrollo local, ejecuta:

```bash
ng serve
```

Una vez que el servidor esté en funcionamiento, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que modifiques cualquiera de los archivos fuente.

## La aplicación se recargará automáticamente cada vez que modifiques cualquiera de los archivos fuente.

Angular CLI incluye potentes herramientas de scaffolding. Para generar un nuevo componente, ejecuta:

```bash
ng generate component component-name
```

Para ver la lista completa de esquemas disponibles (como `components`, `directives`, o `pipes`), ejecuta:

```bash
ng generate --help
```

## Building

Para compilar el proyecto, ejecuta:

```bash
ng build
```

Esto compilará tu proyecto y almacenará los artefactos de construcción en el directorio `dist/`. Por defecto, la compilación de producción optimiza tu aplicación para rendimiento y velocidad.

## Running unit tests

Para ejecutar las pruebas unitarias con el [Karma](https://karma-runner.github.io) test runner Karma, usa el siguiente comando:
```bash
ng test
```

## Configuración de CORS en el Backend

Es importante que en el backend se configuren los CORS (Cross-Origin Resource Sharing),
ya que el frontend (Angular) y el backend suelen correr en distintos puertos o dominios.
De lo contrario, el navegador bloqueará las solicitudes HTTP.

```bash
cors: {
    origin: 'http://localhost:4200', // o "*" si quieres permitir todo
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
```
Si no tienes instalada la dependencia puedes ejecutar:
```bash
npm install cors
```

