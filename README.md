# Cat API Frontend

Frontend Angular 20 con PrimeNG para la aplicación de catálogos de gatos. Incluye autenticación JWT, gestión de usuarios y visualización de razas de gatos.

## Tecnologías

- Angular 20
- TypeScript
- PrimeNG
- Aura Theme
- Tailwind CSS
- RxJS
- Karma/Jasmine
- Docker
- Nginx

## Requisitos

- Node.js 20+
- npm o yarn
- Docker (opcional)

## Configuración

### Instalación de Dependencias

```bash
npm install
```

### Configurar API Backend

Editar `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  apiUrl: 'http://localhost:3000/api'
};
```

## Ejecución

### Desarrollo

```bash
npm start
```

Disponible en `http://localhost:4200`

### Build Producción

```bash
npm run build
```

Archivos compilados en `dist/cat-api-frontend/browser`

## Tests

Ejecutar pruebas con Karma/Jasmine:

```bash
npm test                    # Modo watch
npm test -- --watch=false  # Una sola ejecución
```

## Docker

### Docker Compose

```bash
docker-compose up -d      # Iniciar
docker-compose down       # Detener
docker-compose logs -f    # Ver logs
docker-compose up -d --build  # Reconstruir
```

### Docker Manual

```bash
docker build -t cat-api-frontend .
docker run -p 80:80 --name xpert-group cat-api-frontend
```

### Build Multi-stage

El Dockerfile compila la aplicación Angular y sirve con Nginx:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/cat-api-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── services/          # AuthService, CatsService
│   │   ├── interceptors/      # auth.interceptor
│   │   ├── models/            # Interfaces (User, Breed, CatImage)
│   │   ├── constants/         # Rutas, API endpoints
│   │   └── guards/            # Route guards
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login/         # LoginComponent
│   │   │   ├── register/      # RegisterComponent
│   │   │   └── profile/       # ProfileComponent
│   │   └── breeds/
│   │       ├── breed-selector/    # BreedSelectorComponent
│   │       ├── breed-detail/      # BreedDetailComponent
│   │       ├── breed-table/       # BreedTableComponent
│   │       └── breeds.component.ts    # Contenedor
│   ├── shared/
│   │   └── components/
│   │       └── header/        # HeaderComponent (reutilizable)
│   └── app.config.ts          # Configuración Angular
├── environments/              # Configuración por entorno
├── styles.scss                # Estilos globales
└── main.ts                    # Entry point
```

## Autenticación

Flow:
1. Login/Register obtiene JWT token
2. HTTP Interceptor inyecta token en headers
3. JWT persiste en localStorage
4. Error 401 genera logout automático
5. Router Guards protege rutas autenticadas

Endpoints:
```typescript
POST /api/auth/login
POST /api/auth/register
```

## Estilos

- PrimeNG con Aura Theme
- Tailwind CSS para utilidades
- Responsive design

## API Service

```typescript
getBreeds(limit: number, page: number): Observable<BreedResponse>
searchBreeds(query: string): Observable<BreedResponse>
getImagesByBreedId(breedId: string): Observable<ImageResponse>
```

HTTP Interceptor agrega:
- Bearer token en headers
- Manejo de errores 401
- Logout en sesión expirada

## Desarrollo

```bash
ng generate component features/my-component
ng generate service core/services/my-service
ng generate guard core/guards/auth
```

## Performance

- Tree-shaking para optimizar bundle
- Lazy loading de rutas
- OnPush change detection
- Gzip compression con Nginx

## Solución de Problemas

CORS: Verificar `apiUrl` en `environment.prod.ts`

Token expirado: El interceptor detecta 401 y redirige a login

Nginx 404: `nginx.conf` redirige rutas a `index.html` para SPA routing

## Licencia

MIT

## Autor

Juan Guillermo Gonzalez
