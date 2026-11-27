# CRUD de Estudiantes (HTML + CSS + JavaScript puro)

Proyecto académico para practicar **Git** y **Git Flow**. Es un CRUD completo
(Crear, Leer, Actualizar, Eliminar) de estudiantes, con persistencia en `localStorage`.
No necesita servidor, base de datos ni instalar nada.

## Cómo ejecutarlo

1. Descarga o clona el repositorio.
2. Abre el archivo `index.html` con doble clic (o arrástralo a tu navegador).
3. ¡Listo! Los datos se guardan en el navegador y permanecen al recargar.

> Para reiniciar los datos: DevTools (F12) → Application → Local Storage → elimina `crud_estudiantes_v1`.

## Funcionalidades

- **Crear** estudiantes con un formulario.
- **Leer** el listado en una tabla con buscador y contador.
- **Actualizar** un estudiante existente.
- **Eliminar** con ventana de confirmación.
- **Validaciones**: campos obligatorios, formatos y duplicados (matrícula y correo).

## Estructura

```
crud-estudiantes/
├── index.html
├── README.md
├── css/
│   └── styles.css
└── js/
    ├── storage.js      # localStorage y utilidades compartidas
    ├── validation.js   # validaciones de campos
    ├── create.js       # lógica de CREAR
    ├── read.js         # lógica de LEER / listar
    ├── update.js       # lógica de ACTUALIZAR
    └── delete.js       # lógica de ELIMINAR
```

## Flujo de ramas (Git Flow)

| Etapa | Rama                        | Contenido                         |
|-------|-----------------------------|-----------------------------------|
| 0     | `main`                      | Estructura base                   |
| 1     | `feature/create-record`     | Crear registros (`js/create.js`)  |
| 2     | `feature/read-list`         | Listar registros (`js/read.js`)   |
| 3     | `feature/update-record`     | Editar registros (`js/update.js`) |
| 4     | `feature/delete-record`     | Eliminar con confirmación         |
| 5     | `hotfix/input-validation`   | Validaciones (`js/validation.js`) |

## Tecnologías

HTML5, CSS3 y JavaScript (ES6+) sin librerías externas.

## Autor

_Brayan Osoria_