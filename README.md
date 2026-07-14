# Invitación Digital de Casamiento

Invitación de casamiento 100% frontend construida con **Astro + React + TypeScript + Tailwind CSS**. Sin backend, sin base de datos, sin autenticación. Todo el sitio se genera de forma estática y queda listo para desplegar en Vercel.

## Stack

- [Astro](https://astro.build/) (output estático)
- [React](https://react.dev/) (solo en componentes con interactividad: cuenta regresiva y botón de copiar)
- TypeScript en modo `strict`
- Tailwind CSS
- ESLint + Prettier

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre `http://localhost:4321`. La ruta `/` redirige automáticamente a la primera variante de invitación configurada.

## Build de producción

```bash
npm run build
```

Ejecuta `astro check` (chequeo de tipos) y genera el sitio estático en `dist/`. Previsualizar el build con:

```bash
npm run preview
```

## Lint y formato

```bash
npm run lint        # ESLint
npm run lint:fix     # ESLint con autofix
npm run format       # Prettier (escribe cambios)
npm run format:check # Prettier (solo verifica)
```

## Despliegue en Vercel

1. Subí el repositorio a GitHub/GitLab/Bitbucket.
2. En Vercel, importá el repo. Framework Preset: **Astro** (se detecta automáticamente).
3. Build Command: `npm run build` — Output Directory: `dist`.
4. No se requieren variables de entorno.

## Estructura del proyecto

```
src/
  components/   Componentes Astro y React (una responsabilidad por componente)
  layouts/      Layout.astro (head, SEO, meta tags)
  pages/        index.astro, 404.astro, invitacion/[codigo].astro
  config/       wedding.ts — única fuente de verdad de todos los datos editables
  hooks/        useCountdown, useClipboard, useInView (React hooks)
  utils/        formatDate, formatCurrency, links (Maps/WhatsApp), generateIcs
  styles/       global.css (Tailwind + animaciones)
public/         favicon.svg, og-image.svg
```

## Variantes de invitación

Existe una sola aplicación con tres variantes, cada una con su propia URL:

| Código | URL | Contenido de pago |
|---|---|---|
| `a7km2` | `/invitacion/a7km2` | Sin sección de pago |
| `r9px4` | `/invitacion/r9px4` | Entrada bonificada + tabla + alias |
| `t3vn8` | `/invitacion/t3vn8` | Entrada completa + tabla + alias |

Cualquier código no definido en `src/config/wedding.ts` muestra la página `404.astro`.

## Cómo editar la información (`src/config/wedding.ts`)

Todo el contenido sale de este único archivo. **No hay datos hardcodeados en los componentes.**

### Nombres, fecha y hora

```ts
coupleNames: { partnerOne: 'Lautaro', partnerTwo: 'Belén' },
eventDateISO: '2027-02-27T21:30:00-03:00', // formato ISO 8601, zona Argentina (único horario oficial del evento)
eventTimeTitle: 'Recepción y Ceremonia Civil',
eventTimeLabel: '21:30 hs',
```

### Fotografía

Todavía no existe una fotografía real. Cuando la tengas:

1. Colocá el archivo en `src/assets/` (o `public/`).
2. En `wedding.ts`, cambiá:

```ts
photo: { src: '/ruta/a/tu-foto.jpg', alt: 'Descripción de la foto' },
```

Mientras `src` sea `null`, se muestra un marco elegante vacío.

### Salón, ciudad y dirección

```ts
venue: {
  name: 'Espacio Nikkei',
  city: 'Córdoba Capital',
  address: 'Celso Barrios 3500, Córdoba Capital',
  mapsQuery: 'Espacio Nikkei, Celso Barrios 3500, Córdoba, Argentina', // fallback si no hay mapsUrl
  mapsUrl: 'https://share.google/XePuYWYYyEQOyi80Z', // link directo, tiene prioridad sobre mapsQuery
},
```

El botón "Cómo llegar" usa `mapsUrl` si está definido; si no, construye el link a partir de `mapsQuery`.

### WhatsApp (confirmar asistencia)

```ts
whatsapp: {
  phoneNumber: '5493515952937', // 54 + 9 + código de área sin el 0 + número sin el 15
},
```

El número se usa únicamente para abrir WhatsApp desde el formulario de confirmación de asistencia (`RsvpForm.tsx`), que construye el mensaje automáticamente. No hay un mensaje fijo en la configuración.

### Datos bancarios y valores de la entrada

```ts
payment: {
  bank: 'Brubank',
  accountHolder: 'LAUTARO GOZALVEZ GARAY',
  cuit: '20394464180',
  alias: 'boda.lautaro.belen',
  cbu: '1430001713020019030012',
  accountNumber: '1302001903001',
  pricingPeriods: [
    {
      label: 'Julio - Agosto',
      startDate: '2026-07-01T00:00:00-03:00',
      endDate: '2026-08-31T23:59:59-03:00',
      reducedAmount: 90000,
      generalAmount: 127000,
    },
    // ... Septiembre - Octubre, Noviembre - Diciembre, Enero - Febrero
  ],
},
```

Cada variante de invitación (`entryType: 'reduced' | 'general'`) elige automáticamente la columna de montos correspondiente (`reducedAmount`/`generalAmount`). El período vigente se calcula solo según la fecha actual (`src/utils/pricingPeriod.ts`) y se destaca en la tabla; los montos se formatean con `Intl.NumberFormat('es-AR')` (`src/utils/formatCurrency.ts`), nunca como texto hardcodeado.

**Importante — privacidad de variantes:** los valores `'reduced'`/`'general'` son identificadores internos que nunca se muestran en la interfaz, mensajes de WhatsApp, metadatos ni URLs. La UI solo dice "Valores de la entrada".

### Regalos

```ts
gifts: {
  message: 'Su presencia es el mejor regalo que podemos recibir.\n\nSi además desean...',
},
```

El resto de los datos (banco, titular, alias, CBU) se reutilizan directamente de `payment.*` — no se duplican. Esta sección se muestra en las 3 variantes y nunca menciona precios, bonificaciones ni categorías de invitado.

### Dress code

```ts
dressCode: {
  title: 'Código de vestimenta',
  description: 'Texto libre...',
},
```

### Crear una nueva variante de invitación

En `invitationVariants`, agregá una nueva entrada con un código único (usar códigos técnicos sin significado visible, ej. `a7km2`):

```ts
export const invitationVariants: Record<string, InvitationVariant> = {
  a7km2: { code: 'a7km2', showPayment: false },
  r9px4: { code: 'r9px4', showPayment: true, entryType: 'reduced' },
  t3vn8: { code: 't3vn8', showPayment: true, entryType: 'general' },
  nuevo1: { code: 'nuevo1', showPayment: true, entryType: 'general' }, // ejemplo
};
```

La ruta `/invitacion/nuevo1` se genera automáticamente al hacer build (`getStaticPaths` en `src/pages/invitacion/[codigo].astro` lee este mapa).

## Funcionalidades incluidas

- Portada animada con nombres, fecha y botón de continuar.
- Espacio reservado para fotografía (placeholder elegante).
- Cuenta regresiva en tiempo real (días/horas/minutos/segundos), zona horaria Argentina.
- Detalles del evento (fecha, horario único "Recepción y Ceremonia Civil — 21:30 hs", lugar, dirección con código postal).
- Botón "Cómo llegar" a Google Maps (sin mapa incrustado).
- Botón "Agregar al calendario" que descarga un archivo `.ics`.
- Sección de dress code con texto configurable.
- Sección de pago condicional: tabla de valores por período (destaca automáticamente el vigente, tabla en desktop / tarjetas en mobile) y tarjeta de datos bancarios completa (banco, titular, CUIT/CUIL, alias, CBU, número de cuenta) con botones copiar Alias/CBU (Clipboard API, sin `alert()`). Los términos internos de variante nunca se muestran en la UI.
- Formulario de confirmación de asistencia (`RsvpForm.tsx`): responsable, lista dinámica de asistentes (agregar/quitar sin límite), restricciones alimentarias opcionales, validaciones amigables sin `alert()`, y botón "Confirmar por WhatsApp" que construye el mensaje automáticamente y abre WhatsApp. No guarda datos ni usa backend.
- Sección "Regalos" (`GiftsSection.astro`), visible en las 3 variantes, independiente del pago de entrada: mensaje sin obligación, alias y CBU con botones copiar (reutiliza `CopyButton.tsx`). Nunca menciona precios ni variantes.
- Indicador flotante de scroll (`ScrollHint.tsx`) en la portada: "Deslizá para ver más", se oculta al bajar, click hace scroll suave, respeta `prefers-reduced-motion`.
- Animaciones suaves con IntersectionObserver, respetando `prefers-reduced-motion`.
- SEO: title, description, Open Graph, favicon, theme-color.
- Página 404 personalizada para códigos de invitación inválidos.

## Explícitamente no incluido (por diseño)

Música, galería de fotos, sugerencias de canciones, backend, login, base de datos, panel administrativo. El formulario de confirmación de asistencia sólo construye un mensaje de WhatsApp: no persiste datos en ningún lado.
