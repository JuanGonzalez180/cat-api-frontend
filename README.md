# Cat API Frontend

Frontend Angular 20 con PrimeNG para la aplicación de catálogos de gatos. Incluye autenticación JWT, gestión de usuarios y visualización de razas de gatos.

## 🚀 Tecnologías

- **Angular 20** - Framework frontend
- **TypeScript** - Lenguaje tipado
- **PrimeNG** - Componentes UI
- **Aura Theme** - Tema visual
- **Tailwind CSS** - Utilidades CSS
- **RxJS** - Programación reactiva
- **Karma/Jasmine** - Testing
- **Docker** - Containerización
- **Nginx** - Servidor web

## 📋 Requisitos

- Node.js 20+
- npm o yarn
- Docker (para containerizar)

## ⚙️ Configuración

### 1. Instalación de Dependencias

```bash
npm install
```

### 2. Configurar API Backend

Editar `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  apiUrl: 'http://localhost:3000/api' // URL de tu backend
};
```

## 🏃 Ejecutar

### Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Build Producción

```bash
npm run build
```

Los archivos compilados estarán en `dist/cat-api-frontend/browser`

## 🧪 Tests Unitarios

Ejecutar pruebas con Karma/Jasmine:

```bash
npm test                    # Modo watch interactivo
npm test -- --watch=false  # Una sola ejecución
```

**Cobertura de tests:**
- ✅ AuthService - 12 tests
- ✅ auth.interceptor - 5 tests
- ✅ LoginComponent - 11 tests
- ✅ RegisterComponent - 11 tests
- ✅ ProfileComponent - 7 tests
- ✅ BreedsComponent - 14 tests
- ✅ **Total: 58 tests PASANDO**

## 🐳 Docker

### Con Docker Compose

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Reconstruir imagen
docker-compose up -d --build
```

El docker-compose inicia:
- **Frontend** (puerto 80)
- Container: `xpert-group`
- Network: `xpert-network`

### Con Docker manualmente

```bash
# Construir imagen
docker build -t cat-api-frontend .

# Ejecutar contenedor
docker run -p 80:80 \
  --name xpert-group \
  cat-api-frontend
```

### Dockerfile

El Dockerfile usa multi-stage build:
1. **Build stage**: Compila la aplicación Angular
2. **Production stage**: Sirve con Nginx

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

### Nginx Configuration

El `nginx.conf` está configurado para:
- Servir SPA Angular
- Rutas client-side
- Gzip compression
- Cache headers

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── services/          # AuthService, CatsService
│   │   ├── interceptors/      # auth.interceptor
│   │   ├── models/            # Tipos/Interfaces
│   │   ├── constants/         # Rutas, API endpoints
│   │   └── guards/            # Route guards
│   ├── features/
│   │   ├── auth/              # Login, Register, Profile
│   │   └── breeds/            # Visualización de razas
│   ├── shared/                # Componentes compartidos
│   └── app.config.ts          # Configuración Angular
├── environments/              # Configuración por entorno
├── styles.scss               # Estilos globales
└── main.ts                   # Entry point
```

## 🔐 Autenticación

### Flow de Autenticación

1. **Login/Register** → Obtener JWT token
2. **HTTP Interceptor** → Inyecta token en headers
3. **JWT en localStorage** → Persistencia
4. **401 Error** → Logout automático
5. **Router Guards** → Proteger rutas

### Endpoints de Auth

```typescript
POST /api/auth/login       // Iniciar sesión
POST /api/auth/register    // Registrarse
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "_id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## 🎨 Temas y Estilos

### PrimeNG Aura Theme

Configurado en `app.config.ts`:

```typescript
providePrimeNG({
  theme: {
    preset: Aura
  }
})
```

### Tailwind CSS

Utilidades para responsive design y flexbox. En `styles.scss`:

```scss
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

## 📡 Comunicación con Backend

### API Service

```typescript
// src/app/core/services/cats.service.ts
getBreeds(limit: number, page: number): Observable<BreedResponse>
searchBreeds(query: string): Observable<BreedResponse>
getImagesByBreedId(breedId: string): Observable<ImageResponse>
```

### HTTP Interceptor

Automáticamente agrega:
- `Authorization: Bearer <token>` header
- Manejo de errores 401
- Logout en sesión expirada

## 🚀 Deploy

### Vercel / Netlify

```bash
npm run build
# Subir carpeta dist/cat-api-frontend/browser
```

### Docker Hub

```bash
docker build -t tu-usuario/cat-api-frontend:latest .
docker push tu-usuario/cat-api-frontend:latest
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cat-api-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cat-api-frontend
  template:
    metadata:
      labels:
        app: cat-api-frontend
    spec:
      containers:
      - name: frontend
        image: tu-usuario/cat-api-frontend:latest
        ports:
        - containerPort: 80
```

## 🛠️ Desarrollo

### Crear componente

```bash
ng generate component features/my-component
```

### Crear servicio

```bash
ng generate service core/services/my-service
```

### Crear guard

```bash
ng generate guard core/guards/auth
```

## 📊 Performance

- Bundle size optimizado con tree-shaking
- Lazy loading de rutas
- OnPush change detection
- Image optimization
- Gzip compression con Nginx

## 🐛 Solución de Problemas

### Problemas de CORS

Verificar `MONGODB_URI` en backend y `apiUrl` en frontend:

```typescript
// src/environments/environment.ts
apiUrl: 'http://localhost:3000/api'
```

### Token expirado

El interceptor automáticamente:
1. Detecta 401 Unauthorized
2. Limpia localStorage
3. Redirige a login

### Nginx 404 en reload

El `nginx.conf` redirige todas las rutas a `index.html` para SPA routing.

## 📝 Licencia

MIT

## 👤 Autor

XpertGroup
