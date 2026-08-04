# SGES — Sistema de Gestión de Encuestas de Salud

**SGES** (Sistema de Gestión de Encuestas de Salud) es una plataforma de software diseñada con una arquitectura **Offline-First**, que permite la recolección, administración y sincronización de datos de encuestas médicas y demográficas en áreas con conectividad limitada o nula. Es ideal para brigadas de salud y encuestadores de campo que operan en zonas rurales o urbanas.

---

## 📌 Características Principales

*   **Arquitectura Offline-First:** Los encuestadores pueden registrar información sin conexión a internet. Los datos se almacenan en una base de datos local SQLite y se sincronizan con el servidor central una vez que se restablece la conexión.
*   **Gestión Integral de Personas:** Registro detallado de ciudadanos, incluyendo tipo de documento, información demográfica, EPS afiliada y estado de salud.
*   **Sincronización Inteligente:** Panel de control para monitorear registros sincronizados, pendientes y errores de sincronización, con soporte para reintentos automáticos y resolución de conflictos.
*   **Reportes PDF:** Generación dinámica de reportes en formato PDF en el backend utilizando `pdfkit`.
*   **Seguridad:** Autenticación robusta basada en JSON Web Tokens (JWT) y cifrado de contraseñas con `bcrypt`.
*   **Multiplataforma (Web y Móvil Nativo):** Interfaz web moderna adaptable a móviles y compilable de forma nativa para Android usando Capacitor.

---

## 🛠️ Stack Tecnológico

### Frontend (Cliente)
*   **Lógica:** JavaScript Nativo (ES6 Modular).
*   **Estilos:** CSS3 Moderno (diseño premium, flexible y completamente responsivo, estructurado con variables CSS).
*   **Almacenamiento Local (Offline):** `@capacitor-community/sqlite` con fallback interactivo mediante `sql.js` para navegadores web estándar.
*   **Empaquetador y Servidor Dev:** [Vite](https://vitejs.dev/) para desarrollo rápido y optimización del bundle.
*   **Compilador Móvil:** [Capacitor](https://capacitorjs.com/) para empaquetado nativo en Android.

### Backend (Servidor)
*   **Framework:** [NestJS](https://nestjs.com/) (Node.js con TypeScript).
*   **ORM:** [TypeORM](https://typeorm.io/) para la abstracción de consultas y modelado de datos.
*   **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) como servidor centralizado de datos relacionales.
*   **Librerías Adicionales:** `pdfkit` (generación de reportes), `passport` + `jwt` (autenticación y protección de endpoints) y `ngrok` (túnel de desarrollo para pruebas móviles).

---

## 📂 Estructura del Proyecto

El repositorio está estructurado en los siguientes módulos principales:

```text
PROYECTO3/
│
├── backend/                             # API Servidor NestJS
│   ├── src/
│   │   ├── core/                        # Configuraciones de base de datos y utilidades comunes
│   │   └── modules/                     # Módulos de dominio del negocio
│   │       ├── autenticacion/           # Control de acceso y sesiones (JWT)
│   │       ├── personas/                # CRUD de ciudadanos y encuestas de salud
│   │       ├── sincronizacion/          # Lógica de sincronización offline/online
│   │       ├── historial/               # Logs de operaciones realizadas
│   │       └── reportes/                # Generación de reportes PDF y estadísticas
│   └── package.json
│
├── frontend/                            # Aplicación Cliente (Web & Android)
│   ├── css/                             # Estilos CSS premium y layouts
│   ├── js/                              # Servicios y controladores modularizados
│   │   ├── sqlite.service.js            # Servicio de base de datos offline (SQLite/sql.js)
│   │   ├── auth.service.js              # Manejo de tokens y sesión
│   │   └── sync.service.js              # Controlador de sincronización cliente-servidor
│   ├── index.html                       # Interfaz de usuario principal estructurada
│   ├── capacitor.config.ts              # Configuración nativa móvil
│   └── package.json
│
├── DBN.sql / bd.sql                     # Scripts de creación y datos de prueba de la base de datos PostgreSQL
├── DIAGRAMA.png                         # Diagrama de Entidad-Relación de la base de datos
├── SECUENCIA.png                        # Diagrama de Secuencia del proceso de sincronización
├── COMPONENTES.png                      # Diagrama de Componentes de la arquitectura del software
├── despliegue.png                       # Diagrama de Despliegue de infraestructura
└── Documento de Análisis.docx           # Documento formal de requisitos y especificaciones del sistema (SRS)
```

---

## 🚀 Guía de Instalación y Ejecución

### Requisitos Previos
*   **Node.js** (Versión 18 o superior recomendada)
*   **PostgreSQL** (Servidor de base de datos activo)

---

### 1. Configuración del Backend

1.  Navega a la carpeta del servidor:
    ```bash
    cd backend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Crea un archivo `.env` en la raíz de la carpeta `backend/` basado en la siguiente plantilla:
    ```env
    DB_HOST=localhost
    DB_PORT=5400
    DB_USERNAME=postgres
    DB_PASSWORD=tu_contraseña
    DB_DATABASE=sges_db
    JWT_SECRET=super_secreto_para_firmas
    PORT=3000
    ```
4.  Crea la base de datos en PostgreSQL e importa las tablas usando el archivo `bd.sql` ubicado en la raíz del proyecto.
5.  Inicia el servidor en modo desarrollo:
    ```bash
    npm run start:dev
    ```

---

### 2. Configuración del Frontend

1.  Navega a la carpeta del cliente:
    ```bash
    cd ../frontend
    ```
2.  Instala las dependencias necesarias:
    ```bash
    npm install
    ```
3.  Configura las direcciones URL de conexión al backend en el archivo `frontend/js/config.js` si es necesario.
4.  Inicia el servidor de desarrollo local con Vite:
    ```bash
    npm run dev
    ```
5.  Abre tu navegador en la URL indicada por consola (usualmente `http://localhost:5173`).

---

## 📱 Compilación Móvil (Android) con Capacitor

Para empaquetar la aplicación frontend y correrla en un dispositivo Android:

1.  Genera la versión optimizada de producción del frontend:
    ```bash
    npm run build
    ```
2.  Sincroniza los recursos web con el proyecto nativo de Android:
    ```bash
    npx cap sync
    ```
3.  Abre el proyecto en Android Studio:
    ```bash
    npx cap open android
    ```
4.  Desde Android Studio, compila e instala la aplicación en tu emulador o dispositivo físico configurado.

---

## 📊 Diagramas del Sistema

Para comprender a fondo la arquitectura, puedes consultar las siguientes imágenes incluidas en la raíz del proyecto:
*   **Arquitectura de Datos:** Consúltese [DIAGRAMA.png](file:///c:/Users/TechnoSmart/OneDrive/Desktop/ADSO/Arquitectura-yanguas/PROYECTO3/DIAGRAMA.png) para ver el diseño de la base de datos relacional.
*   **Flujo de Sincronización:** Consúltese [SECUENCIA.png](file:///c:/Users/TechnoSmart/OneDrive/Desktop/ADSO/Arquitectura-yanguas/PROYECTO3/SECUENCIA.png) para entender cómo opera el protocolo de envío y confirmación de datos offline.
*   **Modelo Físico/Infraestructura:** Consúltese [despliegue.png](file:///c:/Users/TechnoSmart/OneDrive/Desktop/ADSO/Arquitectura-yanguas/PROYECTO3/despliegue.png) y [COMPONENTES.png](file:///c:/Users/TechnoSmart/OneDrive/Desktop/ADSO/Arquitectura-yanguas/PROYECTO3/COMPONENTES.png).
