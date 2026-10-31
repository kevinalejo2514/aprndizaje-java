# Avisos de terceros — Java Lab

## Three.js

- **Archivo:** `assets/vendor/three.min.js`
- **Versión:** r147 (0.147.0)
- **Licencia:** MIT
- **Fuente:** https://unpkg.com/three@0.147.0/build/three.min.js
- **Uso previsto:** escena decorativa 3D del hero (fondo animado no bloqueante).
- **Fecha de comprobación:** 2026-10-30

Texto de la licencia (MIT):

```
The MIT License

Copyright © 2010-2022 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

## Fotografía del hero — Unsplash License

- **Archivo:** `assets/img/hero-circuit.jpg` (1400 px de ancho, JPG)
- **Contenido:** macro de una placa base (circuito impreso) con tonos azules. Se eligió un tema abstracto de hardware para no mostrar código de otro lenguaje en una guía de Java.
- **Autor:** no consta en el archivo descargado. La Unsplash License **no exige atribución**, por lo que no es un requisito para su uso; si más adelante se identifica al autor, conviene añadirlo aquí por cortesía.
- **Licencia:** Unsplash License.
- **Fuente:** `https://images.unsplash.com/photo-1518770660439-4636190af475`
- **Uso previsto:** fondo decorativo de la cabecera (`hero`), atenuado con degradados y sin función informativa (marcado `aria-hidden`).
- **Fecha de descarga y comprobación:** 2026-10-30
- **Verificación realizada:** descarga correcta (233 475 bytes), apertura y revisión visual del contenido antes de integrarlo.

Términos de la Unsplash License (resumen de la licencia vigente):

- Uso gratuito para fines comerciales y no comerciales.
- No es necesario atribuir, aunque se agradece.
- No se puede vender la foto sin modificarla, ni compilar fotos de Unsplash para crear un servicio competidor.
- No se puede usar para identificar a personas de forma ofensiva ni para insinuar el respaldo de una marca.

Texto completo: https://unsplash.com/license

---

## Ilustraciones SVG — obra original

- **Archivos:**
  - Módulos: `assets/img/mod-01.svg` … `assets/img/mod-08.svg`
  - Pasos del wizard: `assets/img/step-objetivos.svg`, `step-teoria.svg`, `step-traza.svg`,
    `step-errores.svg`, `step-aplicacion.svg`, `step-practica.svg`, `step-ejercicios.svg`,
    `step-evaluacion.svg`, `step-resumen.svg`
- **Autoría:** creadas para este proyecto como vectores originales (código SVG escrito a mano).
  No derivan de iconos, ilustraciones ni plantillas de terceros.
- **Licencia:** obra propia del proyecto; sin derechos de terceros.
- **Uso previsto:** ilustración de las tarjetas de módulo e iconos de cabecera de cada paso de la lección.
- **Paleta:** derivada de las variables de la guía (`--blue`, `--blue-dark`, `--blue-soft`, `--purple`,
  `--mint`), sin tipografías incrustadas (solo formas geométricas), por lo que no requieren fuentes externas.
- **Fecha de creación:** 2026-10-30

---

## Fuentes tipográficas

La interfaz usa `Inter` con respaldo en fuentes del sistema (`Segoe UI`, `Arial`). **No** se descargan
archivos de fuente: si `Inter` no está instalada, el navegador usa la alternativa del sistema. No hay,
por tanto, licencia de fuente que declarar.
