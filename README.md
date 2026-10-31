# Java Lab — Plataforma educativa de Java desde cero

Ruta interactiva para aprender Java y POO desde cero: 8 módulos, lecciones
completas, trazas de ejecución paso a paso, práctica guiada con pistas,
ejercicios con criterios de verificación y evaluación explicada.

Abrir `index.html` en el navegador (funciona desde `file://`, sin servidor ni
dependencias externas).

---

## Arquitectura (contenido separado de la interfaz)

| Archivo | Responsabilidad |
| --- | --- |
| `content/module-01.js` | Contenido educativo del módulo 1 (5 lecciones completas). Cada módulo futuro se añade como `content/module-XX.js` y se registra en `content/curriculum.js`. |
| `content/curriculum.js` | Modelo de datos de la ruta: 8 módulos, umbral de desbloqueo, mapa de migración y límites de almacenamiento. **No contiene lógica de interfaz.** |
| `js/progress.js` | Motor de progreso: persistencia, requisitos por lección, desbloqueo por porcentaje, migración y recuperación de datos. Acepta el `storage` como parámetro para ser testeable. |
| `js/checkers.js` | Utilidades puras: resaltador de sintaxis Java (escapa HTML), verificación de código por reglas declarativas y corrección de evaluaciones con explicación por opción. |
| `js/renderer.js` | Dibuja los bloques de la lección y sus componentes interactivos (traza, práctica, ejercicios, evaluación, requisitos). |
| `js/app.js` | Enrutado por hash (`#/ruta`, `#/leccion/m1l1`), navegación por módulos, estados de bloqueo y avisos. |
| `css/styles.css` | Sistema visual (se conservó el diseño original y se extendió). |
| `tests/` | Pruebas ejecutables con Node, sin dependencias. |

## Estándar de cada lección

1. Objetivos verificables · 2. Explicación desde cero · 3. Analogía ·
4. Reglas detalladas (tabla/concepto) · 5. Código Java real · 6. Explicación
línea por línea · 7. Traza paso a paso con estado de variables y salida
acumulada · 8. Salida esperada y por qué · 9. Errores frecuentes (causa y
corrección) · 10. Ejemplos progresivos · 11. Práctica guiada con escalera de
pistas y solución accesible solo tras el primer intento · 12. Ejercicios
independientes con casos de prueba y verificación obligatoria · 13. Aplicación
práctica · 14. Resumen · 15. Evaluación con explicación de cada opción.

El test `tests/content.test.cjs` valida este estándar antes de publicar.

## Reglas de progreso (y por qué no se «trampa»)

- Una lección solo se marca dominada cuando cumple **sus tres requisitos**:
  evaluación ≥ 75 %, práctica guiada superada y al menos 1 ejercicio
  verificado. Abrir la lección no cuenta.
- Para verificar un ejercicio hay que marcar **todos** sus criterios.
- Se puede reintentar la evaluación y repetir la lección sin límite.
- El módulo N+1 se desbloquea con un **80 %** de lecciones dominadas del N-1.
- Un módulo sin lecciones publicadas aparece como «En preparación»: nunca se
  simula contenido que no existe.

### Límites del almacenamiento (localStorage)

- Se guarda **solo en este navegador y dispositivo** (por origen). No hay
  servidor: el progreso **no se sincroniza** entre equipos ni con la nube.
- Capacidad típica de ~5 MB por origen, API síncrona, y el usuario o el
  navegador pueden borrarlo (modo privado, «borrar datos del sitio»).
- Si el almacenamiento falla, la app sigue funcionando en memoria y avisa
  explícitamente de que el progreso no quedará guardado.
- Si los datos están dañados o en un formato antiguo, se guarda una copia de
  seguridad (`javaLab.progress.corrupt`), se informa con un aviso y se empieza
  de cero. El progreso de la versión anterior de la guía (`java-01`) se migra
  automáticamente a `m1l1`.
- **No se ejecuta Java del usuario**: la comprobación de código es una revisión
  estructural del texto, y la interfaz lo dice en cada comprobación.

## Pruebas (Node ≥ 18, sin dependencias)

```bash
node tests/logic.test.cjs      # motor de progreso y verificadores (28)
node tests/content.test.cjs    # estándar pedagógico del currículo (52)
node tests/smoke.test.cjs      # interfaz con stub de DOM: flujo completo (22)
node tests/styles-check.cjs    # clases CSS usadas vs definidas
```

Las pruebas de interfaz ejecutan el flujo real: render de las 5 lecciones,
práctica correcta e incorrecta, evaluación bien y mal respondida, reintento,
verificación de ejercicios, completado de lección, persistencia, navegación
anterior/siguiente y reinicio.

**Límite honesto:** estas pruebas corren sobre un stub de DOM en Node, no sobre
un navegador real. La navegación con el teclado, el responsive y el render de
fuentes no están cubiertos por ellas.

## Currículo completo (8 módulos, 47 lecciones previstas)

1. **Fundamentos y entorno Java** (5 lecciones) — ✅ publicado
2. Variables, tipos de datos y operadores (6) — en preparación
3. Condicionales y lógica (5) — en preparación
4. Ciclos y control de flujo (5) — en preparación
5. Métodos y modularidad (5) — en preparación
6. Arrays, cadenas y colecciones (6) — en preparación
7. POO (8) — en preparación
8. Java profesional y backend (7) — en preparación

Para publicar un módulo: crear `content/module-XX.js` con
`window.MODULES.push({ id, number, title, subtitle, description, lessons: [...] })`
y ejecutar `node tests/content.test.cjs`. Los módulos 2-8 ya tienen su ficha en
`content/curriculum.js`; solo falta el contenido de sus lecciones.

Contexto didáctico **Corporal Fit** (gimnasio) se usa en aplicaciones y
ejercicios desde el módulo 1, sin introducir complejidad antes de tiempo.
