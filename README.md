# Inkode

**Guardá, organizá y visualizá tu código en un solo lugar.**

Inkode es una herramienta web para developers que permite guardar y anotar bloques de código en un **canvas infinito**, similar a Figma o n8n. La diferencia clave con otras herramientas es que las anotaciones viven en una **capa separada** del código, por lo que el código siempre se puede copiar limpio.

---

## ¿Por qué Inkode?

| Problema | Solución |
|---|---|
| Guardar código en Notion lo ensucia con las anotaciones | Capa de anotaciones separada del código |
| GitHub Gist es lento y no tiene canvas | Canvas infinito con navegación fluida |
| No hay herramienta que combine canvas + código | Inkode combina ambos en una sola app |

---

## Features

- **Canvas infinito** — organizá tus bloques de código libremente en el espacio
- **Editor de código** con syntax highlighting (Monaco Editor, el mismo de VS Code)
- **Detección automática de lenguaje** — reconoce JS, TS, Python, Go, Rust, SQL, y más
- **Dos modos**: modo código para escribir, modo dibujo para anotar con flechas y texto
- **Copia limpia** — el botón Copiar siempre te da el código sin las anotaciones
- **Persistencia automática** — el canvas se guarda en tiempo real en Firestore
- **Auth con Google** — accedé con un click, sin registro manual

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 + TypeScript |
| Estilos | CSS Modules |
| Canvas | tldraw |
| Editor de código | Monaco Editor |
| Auth | Firebase Auth (Google) |
| Base de datos | Firebase Firestore |
| Deploy | Vercel |

---

## Instalación local

### Prerequisitos

- Node.js 18+
- Una cuenta de Firebase con Firestore y Authentication habilitados

### Pasos

1. Cloná el repositorio:

```bash
git clone https://github.com/TFango/inkode-web.git
cd inkode-web
```

2. Instalá las dependencias:

```bash
npm install
```

3. Creá un archivo `.env.local` en la raíz con tus credenciales de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

4. Corré el servidor de desarrollo:

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Uso

1. Iniciá sesión con tu cuenta de Google
2. Creá un tablero nuevo
3. Dentro del tablero, usá el botón **+** para agregar bloques de código
4. Escribí tu código — el lenguaje se detecta automáticamente
5. Cambiá a **modo dibujo** para agregar flechas, texto y anotaciones encima
6. Usá el botón **Copiar** para copiar el código limpio, sin anotaciones
7. Todo se guarda automáticamente

---

## Autor

Creado por **Emanuel Bustos**

- [LinkedIn](https://www.linkedin.com/in/facundo-emanuel-jimenez-bustos-49207136b)
- [GitHub](https://github.com/TFango)

---

## Licencia

MIT