# Portafolio web — Jenny Vásquez

Portafolio personal de **Jenny Vásquez**, estudiante de Ingeniería en Software en la Universidad Estatal de Milagro (UNEMI), Ecuador.

Sitio estático construido con **HTML5, CSS y JavaScript puro**, sin librerías ni frameworks.

🔗 **Demo:** https://Jenny2003-roc.github.io/Mi-Portafolio-Web/

---

## Características

- Diseño oscuro azul marino con acento naranja y **tema claro/oscuro** (se guarda en `localStorage`).
- **Design System documentado** dentro del mismo sitio: colores, tipografía, espaciado y componentes.
- Diseño **responsive** (móvil, tablet y escritorio) con menú colapsable.
- Navegación que resalta la sección visible.
- **Filtro de proyectos** por tecnología y **modal** con el detalle de cada uno.
- **Formulario de contacto** con envío real de mensajes (Web3Forms) y respaldo por correo (`mailto`).
- Fondo animado de nodos en el hero (canvas).
- Accesibilidad: HTML semántico, enlace "saltar al contenido", foco visible y soporte de `prefers-reduced-motion`.

## Secciones

1. Inicio
2. Sobre mí
3. Habilidades
4. Proyectos
5. Design System
6. Contacto

## Proyectos destacados

| Proyecto | Descripción |
|---|---|
| **Lista de Tareas — Técnica de Programación** | Aplicación web para crear, organizar y marcar tareas como completadas. |
| **TechCheck Pro** | Sistema para auditar la viabilidad tecnológica de una organización bajo el modelo TOE (Tecnología, Organización, Entorno). |
| **BanaIA** | Herramienta de inteligencia artificial para el monitoreo de cultivos de banano: apoya la detección temprana de enfermedades. |

## Tecnologías

- HTML5 semántico
- CSS3 (Custom Properties, Grid, Flexbox)
- JavaScript (ES6+)
- Google Fonts: Inter y JetBrains Mono
- [Web3Forms](https://web3forms.com) para el envío del formulario de contacto

## Estructura del proyecto

```
├── index.html
├── README.md
├── img/
│   ├── Yo.jpeg
│   ├── ListadeTareas.png
│   ├── TechCheckPro.jpeg
│   └── BanaIA.jpeg
├── css/
│   ├── tokens.css        # Variables del sistema (colores, tipografía, espaciado)
│   ├── base.css          # Reset, tipografía y layout
│   ├── components.css    # Botones, cards, formularios, modal, etc.
│   └── sections.css      # Estilos por sección + responsive
└── js/
    └── script.js         # Tema, menú, filtro, modal, validación, canvas
```

## Ejecutar en local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Jenny2003-roc/Mi-Portafolio-Web.git
   ```
2. Abre `index.html` en el navegador, o usa una extensión como *Live Server* en VS Code.

No requiere instalación de dependencias.

## Publicar en GitHub Pages

1. Ve a **Settings → Pages**.
2. En **Source**, elige la rama `main` y la carpeta `/ (root)`.
3. Guarda y espera a que se genere el enlace.

## Contacto

- Correo: jvasquezl4@unemi.edu.ec
- GitHub: https://github.com/Jenny2003-roc

## Autora

**Jenny Vásquez** — Ingeniería en Software, UNEMI © 2026