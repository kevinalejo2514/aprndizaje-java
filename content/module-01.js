/**
 * Java Lab — Módulo 1: Fundamentos y entorno Java
 * ------------------------------------------------
 * Contenido educativo puro (sin lógica de interfaz).
 * Estándar de cada lección:
 *   objetivos · explicación desde cero · analogía · reglas · código real ·
 *   línea por línea · traza paso a paso · salida explicada · errores ·
 *   ejemplos progresivos · práctica guiada con pistas · ejercicios con
 *   criterios de verificación · aplicación práctica · resumen · evaluación.
 */
(function (global) {
  "use strict";

  global.MODULES = global.MODULES || [];
  global.MODULES.push({
    id: "m1",
    number: 1,
    title: "Fundamentos y entorno Java",
    subtitle: "Qué es Java, cómo se ejecuta y cómo escribe tu primer programa.",
    description:
      "Salidas, clases, método main, consola, compilación y errores de compilación. " +
      "Al terminar este módulo sabrás crear, compilar y ejecutar un programa Java y leer los errores que el compilador te devuelve.",
    lessons: [
      /* =========================================================
         LECCIÓN 1 — Qué es programar y qué es Java
         ========================================================= */
      {
        id: "m1l1",
        number: 1,
        title: "Qué es programar y qué es Java",
        duration: "25 minutos",
        requirements: { quizScore: 0.75, practice: true, exercisesMin: 1 },
        objectives: [
          "Explicar qué es un programa y por qué la computadora no puede improvisar.",
          "Distinguir <strong>algoritmo</strong>, <strong>código fuente</strong> y <strong>programa en ejecución</strong>.",
          "Identificar en un código Java la clase, el método <code>main</code> y una instrucción de salida.",
          "Predecir la salida de un programa con varias instrucciones <code>System.out.println</code> <em>antes</em> de ejecutarlo."
        ],
        blocks: [
          {
            type: "lead",
            html:
              "Programar consiste en escribir, para una computadora, un conjunto de instrucciones <strong>precisas, ordenadas y finitas</strong> que resuelven un problema. La máquina no piensa ni deduce: ejecuta exactamente lo que le diste, en el orden en que se lo diste. Si tu instrucción no contempla un caso, el programa tampoco lo resolverá."
          },
          {
            type: "analogy",
            title: "Analogía: una receta de cocina",
            html:
              "Imagina que le das una receta a alguien que cocina por primera vez. Tú escribes «un poco de sal» y esa persona entiende. Pero si se lo das a una máquina que mezcla ingredientes, «un poco» no le significa nada: necesita <strong>gramos exactos</strong> y el orden exacto de pasos. Programar es escribir así: sin ambigüedades, con el detalle justo."
          },
          { type: "heading", text: "¿Qué es Java, en concreto?" },
          {
            type: "para",
            html:
              "<strong>Java</strong> es un lenguaje de programación creado en 1995 por Sun Microsystems (hoy mantenido por Oracle). Se usa principalmente en el lado del servidor: bancos, tiendas en línea, sistemas de nóminas y servicios web. También se usó mucho en aplicaciones de Android. Tres características te importan ahora mismo:"
          },
          {
            type: "list",
            ordered: false,
            items: [
              "<strong>Orientado a objetos:</strong> organiza el código en piezas llamadas clases (módulo 7 completo).",
              "<strong>Sensible a mayúsculas:</strong> <code>System</code> y <code>system</code> son cosas distintas para Java.",
              "<strong>Multiplataforma:</strong> escribes el código una vez y se ejecuta en Windows, Linux o Mac porque corre dentro de la <em>máquina virtual Java</em> (lo verás en la lección 3)."
            ]
          },
          { type: "heading", text: "Tu primer programa" },
          {
            type: "para",
            html:
              "Este programa muestra un mensaje en pantalla. No intentes memorizarlo todavía: primero observa qué piezas tiene y para qué sirve cada una."
          },
          {
            type: "code",
            file: "HolaMundo.java",
            code:
`public class HolaMundo {
    public static void main(String[] args) {
        System.out.println("Hola, mundo");
        System.out.println("Estoy aprendiendo Java");
    }
}`
          },
          {
            type: "lines",
            title: "Explicación línea por línea",
            items: [
              {
                line: "public class HolaMundo {",
                why:
                  "Declara una <strong>clase</strong> llamada <code>HolaMundo</code>. En Java, todo el código vive dentro de clases; es el «contenedor» del programa."
              },
              {
                line: "public static void main(String[] args) {",
                why:
                  "Declara el <strong>método main</strong>: es el punto de entrada. Cuando ejecutas el programa, Java empieza exactamente aquí. La palabra <code>args</code> guarda los argumentos que nadie te pasó, por eso aparece vacío."
              },
              {
                line: 'System.out.println("Hola, mundo");',
                why:
                  "Muestra el texto entre comillas y después <strong>salta de línea</strong>. <code>System</code> va con <code>S</code> mayúscula y la instrucción termina en <code>;</code>."
              },
              {
                line: 'System.out.println("Estoy aprendiendo Java");',
                why:
                  "Otra instrucción de salida idéntica en estructura. Se ejecuta <strong>después</strong> de la anterior: el orden importa."
              },
              {
                line: "}",
                why:
                  "Cierra el bloque de <code>main</code>. La llave final cierra la clase. Las llaves deben estar balanceadas: una que abre, una que cierra."
              }
            ]
          },
          {
            type: "output",
            lines: ["Hola, mundo", "Estoy aprendiendo Java"],
            why:
              "Por qué se produce: Java entra en <code>main</code>, ejecuta la primera instrucción (imprime y salta de línea) y sigue con la segunda. Al cerrar la última llave, el programa termina sin errores. El orden de las líneas en pantalla <strong>es</strong> el orden en el que aparecieron las instrucciones en el código."
          },
          {
            type: "trace",
            title: "Seguimiento del estado paso a paso",
            intro:
              "Pulsa «Siguiente paso» y observa dos cosas: qué instrucción se está ejecutando y qué cambia (variables y salida acumulada).",
            code:
`public class HolaMundo {
    public static void main(String[] args) {
        System.out.println("Hola, mundo");
        System.out.println("Estoy aprendiendo Java");
    }
}`,
            steps: [
              {
                line: 1,
                note:
                  "Java lee la declaración de la clase. Aún no se imprime nada: solo existe el «molde» del programa.",
                vars: [],
                out: []
              },
              {
                line: 2,
                note:
                  "Se entra en el método <code>main</code>. Este es el único punto donde arranca la ejecución. El parámetro <code>args</code> existe como variable, pero nadie pasó argumentos.",
                vars: [["args", "String[] vacío (sin argumentos)"]],
                out: []
              },
              {
                line: 3,
                note:
                  "Primera instrucción de salida: se escribe «Hola, mundo» y el cursor queda en la línea siguiente.",
                vars: [["args", "String[] vacío (sin argumentos)"]],
                out: ["Hola, mundo"]
              },
              {
                line: 4,
                note:
                  "Segunda instrucción: se añade otra línea de salida. Nada de lo anterior se borra: la salida se acumula.",
                vars: [["args", "String[] vacío (sin argumentos)"]],
                out: ["Hola, mundo", "Estoy aprendiendo Java"]
              },
              {
                line: 5,
                note:
                  "Se cierra <code>main</code> y la clase. El programa termina con código de salida 0, que significa «sin errores».",
                vars: [],
                out: ["Hola, mundo", "Estoy aprendiendo Java"]
              }
            ]
          },
          {
            type: "concept",
            title: "Tres palabras que no debes confundir",
            html:
              "<strong>Algoritmo:</strong> la secuencia de pasos que resuelve el problema (existe en tu cabeza o en papel). " +
              "<strong>Código fuente:</strong> esos pasos escritos en Java, en un archivo <code>.java</code>. " +
              "<strong>Programa en ejecución:</strong> el resultado de que la máquina lo lleve a cabo. " +
              "Un algoritmo puede estar bien y tu código estar mal: por eso se revisa el código, no solo la idea."
          },
          { type: "heading", text: "Ejemplos progresivos" },
          { type: "para", html: "Empieza con lo mínimo y sube un nivel cada vez." },
          {
            type: "code",
            file: "Ejemplo1.java (nivel básico)",
            code:
`public class Ejemplo1 {
    public static void main(String[] args) {
        System.out.println("Hola");
    }
}`
          },
          {
            type: "para",
            html:
              "Una sola instrucción de salida. Ahora añade estructura: un separador visual y varios mensajes, para que la salida se lea como un bloque organizado."
          },
          {
            type: "code",
            file: "Ejemplo2.java (nivel intermedio)",
            code:
`public class Ejemplo2 {
    public static void main(String[] args) {
        System.out.println("---------");
        System.out.println("JAVA LAB");
        System.out.println("---------");
    }
}`
          },
          {
            type: "output",
            lines: ["---------", "JAVA LAB", "---------"],
            why:
              "Tres instrucciones, tres líneas, en el mismo orden. El separador no tiene ningún poder especial: es simplemente texto entre comillas."
          },
          {
            type: "errors",
            title: "Errores frecuentes",
            items: [
              {
                error: "missing ';' expected",
                cause:
                  "Java exige que cada instrucción termine con punto y coma. Es como no cerrar una frase: el compilador no sabe dónde termina.",
                fix:
                  "Añade <code>;</code> al final de la línea que el compilador señala. Si no te señala ninguna, revisa la línea anterior: a veces el error está justo antes."
              },
              {
                error: 'cannot find symbol: class system',
                cause:
                  "Escribiste <code>system</code> en minúscula. Java distingue mayúsculas: para él, <code>system</code> es un nombre que nadie ha declarado.",
                fix:
                  "Cambia a <code>System</code> con <code>S</code> mayúscula y revisa también <code>out</code> y <code>println</code> en minúscula."
              },
              {
                error: "El archivo no hace lo que esperaba",
                cause:
                  "Guardaste el archivo como <code>HolaMundo.txt</code> o en una carpeta distinta de la que estás usando en la terminal.",
                fix:
                  "Guarda como <code>HolaMundo.java</code> (igual que la clase pública) y comprueba con <code>dir</code> o <code>ls</code> en qué carpeta estás parado."
              }
            ]
          },
          {
            type: "tip",
            html:
              "<strong>Regla de oro del principiante:</strong> cuando el compilador marque un error, no corrijas a ciegas. Lee el mensaje, localiza la línea señalada y pregúntate <em>qué esperaba Java ver ahí</em>. El 90% de los errores de este módulo son punto y coma, mayúsculas y llaves."
          },
          {
            type: "application",
            title: "Aplicación práctica: una tarjeta de bienvenida",
            html:
              "Los programas reales suelen empezar así: imprimir la información de una ficha. Aquí tienes un programa completo (sin variables todavía) que imprime la tarjeta de un miembro del gimnasio <strong>Corporal Fit</strong>:",
            file: "TarjetaBienvenida.java",
            code:
`public class TarjetaBienvenida {
    public static void main(String[] args) {
        System.out.println("==========================");
        System.out.println("  CORPORAL FIT - BIENVENIDO");
        System.out.println("==========================");
        System.out.println("Miembro: Kevin Sanchez");
        System.out.println("Plan: Entrenamiento anual");
        System.out.println("Registro: 12 de octubre");
        System.out.println("==========================");
    }
}`,
            output:
`==========================
  CORPORAL FIT - BIENVENIDO
==========================
Miembro: Kevin Sanchez
Plan: Entrenamiento anual
Registro: 12 de octubre
==========================`,
            why:
              "Cada <code>println</code> aporta una línea de la ficha. Aunque el programa es solo texto, ya estás practicando la estructura completa de Java: clase, método main e instrucciones. En el módulo 2 esos datos serán variables y el programa podrá calcular cosas."
          }
        ],
        practice: {
          title: "Tu primera tarjeta personal",
          prompt:
            "Escribe un programa que muestre <strong>tu nombre</strong> en la primera línea, <strong>tu ciudad</strong> en la segunda y una línea de separación de guiones antes de ambas. Debe compilarse como una clase llamada <code>Tarjeta</code>.",
          label: "Pega aquí el contenido completo del archivo Tarjeta.java:",
          startCode:
`public class Tarjeta {
    public static void main(String[] args) {
        // escribe aquí tus instrucciones
    }
}`,
          hints: [
            "Cada línea visible en pantalla necesita su propia instrucción <code>System.out.println( ... );</code>",
            "El separador es solo otro mensaje: <code>System.out.println(\"----------\");</code> y va <em>antes</em> de los otros dos.",
            "Comprueba que los paréntesis se cierran y que cada instrucción termina en <code>;</code>."
          ],
          checks: [
            {
              pattern: "public\\s+class\\s+Tarjeta",
              message: "Falta la declaración de la clase: public class Tarjeta {",
              hint: "El nombre de la clase debe coincidir con el nombre del archivo."
            },
            {
              pattern: "public\\s+static\\s+void\\s+main",
              message: "Falta el método main, el punto de entrada del programa.",
              hint: "Es la línea: public static void main(String[] args) {"
            },
            {
              pattern: "System\\.out\\.println\\(",
              min: 3,
              message: "Necesitas 3 instrucciones println (separador + nombre + ciudad).",
              hint: "Cada dato visible ocupa una instrucción distinta."
            },
            {
              pattern: "\"[^\"]+\"",
              message: "Falta un texto entre comillas dobles.",
              hint: "El mensaje va dentro de comillas: \"Mi nombre es...\""
            },
            {
              pattern: ";",
              min: 3,
              message: "Faltan puntos y coma: cada instrucción dentro de main debe terminar con ;",
              hint: "Necesitas al menos 3 sentencias, cada una cerrada con ;"
            }
          ],
          forbidden: [
            {
              pattern: "System\\.out\\.Println",
              message: "println debe ir todo en minúscula (System.out.println).",
              hint: "Java distingue mayúsculas."
            }
          ],
          solution: {
            code:
`public class Tarjeta {
    public static void main(String[] args) {
        System.out.println("----------");
        System.out.println("Kevin Sanchez");
        System.out.println("Bogota");
    }
}`,
            explanation:
              "Tres instrucciones, en este orden: primero el separador, después tu nombre y por último la ciudad. Java las ejecuta de arriba abajo, así que la salida sale idéntica al orden del código. Cambia solo el texto entre comillas para personalizarlo sin romper nada."
          }
        },
        exercises: [
          {
            id: "m1l1e1",
            level: "Básico",
            statement:
              "Crea el programa <code>Saludo.java</code> que imprima exactamente dos líneas: tu nombre y la frase <code>Aprendo Java desde cero</code>.",
            criteria: [
              "El archivo se llama Saludo.java y declara <code>public class Saludo</code>.",
              "Tiene el método <code>main</code> completo.",
              "Usa dos instrucciones <code>System.out.println</code>.",
              "La segunda línea es exactamente <code>Aprendo Java desde cero</code> (respeta mayúsculas y espacios)."
            ],
            hints: [
              "Si cambias el nombre de la clase, cambia también el nombre del archivo.",
              "El texto debe ir entre comillas dobles y la instrucción cerrar con ;"
            ],
            solution: {
              code:
`public class Saludo {
    public static void main(String[] args) {
        System.out.println("Kevin Sanchez");
        System.out.println("Aprendo Java desde cero");
    }
}`,
              explanation:
                "Dos println = dos líneas. Si tu salida muestra todo en una sola línea, usaste <code>print</code> en lugar de <code>println</code> o escribiste todo dentro de un mismo paréntesis."
            }
          },
          {
            id: "m1l1e2",
            level: "Intermedio",
            statement:
              "Crea <code>Reporte.java</code> que imprima un encabezado de 20 guiones, el título <code>REPORTE SEMANAL</code> y otro encabezado de 20 guiones. Después añade dos líneas de datos inventados (por ejemplo, sesiones realizadas y horas).",
            criteria: [
              "Tiene un bloque de encabezado con dos líneas de guiones idénticas.",
              "Incluye el título exacto entre las dos líneas de guiones.",
              "Incluye dos líneas más con datos (solo texto, sin variables).",
              "La salida final tiene 5 líneas y no queda ninguna en blanco entre medias."
            ],
            hints: [
              "Las dos líneas de guiones deben ser idénticas carácter a carácter.",
              "Cuenta las líneas de salida en tu cabeza antes de ejecutar: deben ser 5."
            ],
            solution: {
              code:
`public class Reporte {
    public static void main(String[] args) {
        System.out.println("--------------------");
        System.out.println("REPORTE SEMANAL");
        System.out.println("--------------------");
        System.out.println("Sesiones: 4");
        System.out.println("Horas: 6");
    }
}`,
              explanation:
                "Orden = salida. El programa no «sabe» que las guiones son un encabezado: simplemente imprime texto. La estructura la pones tú con el orden de las instrucciones."
            }
          },
          {
            id: "m1l1e3",
            level: "Aplicado",
            statement:
              "Programa <code>Membresia.java</code> para Corporal Fit: imprime un bloque con la marca, el nombre del miembro, el tipo de plan y una línea de pie con el teléfono del gimnasio. Debe haber un separador antes y después del bloque completo (7 líneas de salida en total).",
            criteria: [
              "El bloque tiene separador, marca, miembro, plan, teléfono y separador final.",
              "La salida tiene exactamente 7 líneas.",
              "El nombre de la clase coincide con el archivo Membresia.java.",
              "Ninguna instrucción usa print donde se esperaba println (ninguna línea se pega a otra)."
            ],
            hints: [
              "Dibuja primero en papel las 7 líneas que quieres ver; después convierte cada línea en un println.",
              "El teléfono debe ir como texto entre comillas, no como número suelto (aún no hay variables)."
            ],
            solution: {
              code:
`public class Membresia {
    public static void main(String[] args) {
        System.out.println("========================");
        System.out.println("CORPORAL FIT");
        System.out.println("Miembro: Ana Torres");
        System.out.println("Plan: Mensual ilimitado");
        System.out.println("Tel: 555-0134");
        System.out.println("========================");
    }
}`,
              explanation:
                "Dibujar la salida antes de escribir el código es la técnica más útil de esta lección: convierte un problema vago («haz un programa») en una lista concreta de instrucciones."
            }
          }
        ],
        quiz: {
          title: "Evaluación de comprensión — Lección 1",
          passScore: 0.75,
          questions: [
            {
              id: "q1",
              question: "¿Qué hace exactamente la instrucción <code>System.out.println(\"Hola\");</code>?",
              options: [
                { id: "a", text: "Crea una clase nueva llamada Hola." },
                { id: "b", text: "Muestra el texto Hola en la consola y termina la línea." },
                { id: "c", text: "Instala Java en el computador." },
                { id: "d", text: "Guarda Hola en un archivo de texto." }
              ],
              answer: "b",
              why: {
                correct:
                  "Correcto: println escribe el texto entre comillas y añade un salto de línea. Es la operación de salida básica de Java.",
                wrong: {
                  a: "Crear clases se hace con la palabra class, no con println. println solo muestra texto.",
                  c: "Java se instala una sola vez con el JDK; el programa no instala nada al ejecutarse.",
                  d: "println escribe en la consola (pantalla), no en archivos. Para archivos se usan clases de E/S, que verás en el módulo 8."
                }
              }
            },
            {
              id: "q2",
              question: "Tu código dice <code>System.out.println(\"Hola mundo);</code>. ¿Qué ocurre?",
              options: [
                { id: "a", text: "Se imprime Hola mundo sin la comilla final." },
                { id: "b", text: "No compila: falta cerrar la comilla doble." },
                { id: "c", text: "Compila y muestra un error en tiempo de ejecución." },
                { id: "d", text: "Compila perfectamente: las comillas son opcionales." }
              ],
              answer: "b",
              why: {
                correct:
                  "Exacto. La comilla que abre nunca se cierra, así que el texto «se come» el resto de la línea y el compilador no encuentra el final de la cadena: es un error de compilación, Java ni siquiera intenta ejecutar.",
                wrong: {
                  a: "Java no puede «imprimir a medias»: si el archivo no está bien formado, no genera un programa ejecutable.",
                  c: "Los errores en tiempo de ejecución ocurren cuando el programa ya compila (por ejemplo, dividir entre cero). Aquí falla la compilación.",
                  d: "Las comillas delimitan el texto (String). Sin ellas, Java vería símbolos que no existen."
                }
              }
            },
            {
              id: "q3",
              question: "¿Cuál de estas instrucciones es válida en Java?",
              options: [
                { id: "a", text: "system.out.println(\"hola\");" },
                { id: "b", text: "System.Out.Println(\"hola\");" },
                { id: "c", text: "System.out.println(\"hola\");" },
                { id: "d", text: "System.out.println hola;" }
              ],
              answer: "c",
              why: {
                correct:
                  "Bien: la combinación correcta es System mayúscula, out y println en minúscula, texto entre comillas y paréntesis cerrados con ; al final.",
                wrong: {
                  a: "system en minúscula no existe: Java no encontrará el símbolo.",
                  b: "Out y Println en mayúscula también fallan: los nombres de métodos y campos son sensibles a mayúsculas.",
                  d: "Faltan los paréntesis con el texto dentro: println es una llamada a un método y necesita ( )."
                }
              }
            },
            {
              id: "q4",
              question: "Estás en la terminal y ejecutas <code>java HolaMundo.java</code> sin haber compilado nada. ¿Qué esperas?",
              options: [
                { id: "a", text: "Nada: Java solo acepta archivos .class, hay que compilar antes con javac." },
                { id: "b", text: "Funciona igual porque el código fuente ya es el programa." },
                { id: "c", text: "Se borra el archivo." },
                { id: "d", text: "Java crea el archivo .class automáticamente sin avisar." }
              ],
              answer: "a",
              why: {
                correct:
                  "Correcto (y lo verás en detalle en la lección 3): el flujo es javac para compilar y java para ejecutar. Intentar ejecutar sin compilar devuelve un error de clase no encontrada.",
                wrong: {
                  b: "El archivo .java es texto para humanos; el programa ejecutable es el .class generado por el compilador.",
                  c: "Un comando con error no borra tus archivos: solo informa que no pudo hacer lo que pediste.",
                  d: "La generación del .class la hace javac, no el comando java. Ese «atajo» no existe."
                }
              }
            }
          ]
        },
        summary: [
          "Programar es escribir instrucciones <strong>precisas y ordenadas</strong>: la computadora ejecuta lo que hay, no lo que imaginabas.",
          "Java es un lenguaje <strong>sensible a mayúsculas</strong>, orientado a objetos y multiplataforma.",
          "Todo programa Java mínimo tiene: una <strong>clase</strong>, el método <strong>main</strong> como punto de entrada e <strong>instrucciones</strong> terminadas en <code>;</code>.",
          "El orden de los <code>println</code> determina el orden de la salida: léela en el código antes de ejecutar.",
          "Los errores más comunes al principio son punto y coma, mayúsculas y comillas sin cerrar."
        ]
      },

      /* =========================================================
         LECCIÓN 2 — Anatomía de un programa Java
         ========================================================= */
      {
        id: "m1l2",
        number: 2,
        title: "Anatomía de un programa Java: clase, main y sentencias",
        duration: "30 minutos",
        requirements: { quizScore: 0.75, practice: true, exercisesMin: 1 },
        objectives: [
          "Identificar las partes mínimas de un programa Java: clase, método <code>main</code>, sentencias y bloques.",
          "Explicar por qué el nombre del archivo debe coincidir con la clase pública.",
          "Escribir comentarios que expliquen el <em>porqué</em>, no el <em>cómo</em>.",
          "Detectar errores de sintaxis (punto y coma, llaves, mayúsculas) <strong>antes</strong> de ejecutar."
        ],
        blocks: [
          {
            type: "lead",
            html:
              "En la lección 1 imprimiste texto. Ahora vas a entender <strong>la estructura</strong> que lo hace posible. Un programa Java no es una lista suelta de instrucciones: tiene jerarquía, como un libro que tiene capítulos y cada capítulo tiene frases."
          },
          {
            type: "analogy",
            title: "Analogía: un libro",
            html:
              "La <strong>clase</strong> es el libro completo. El <strong>método main</strong> es el capítulo que se lee primero (el punto de entrada). Las <strong>sentencias</strong> son las frases dentro de ese capítulo. Y las <strong>llaves</strong> { } son los límites de cada capítulo: si cierras uno de más o de menos, el libro queda incoherente. El compilador es el editor: no publica nada que no esté bien estructurado."
          },
          {
            type: "table",
            headers: ["Parte", "Ejemplo", "Qué pasa si la rompes"],
            rows: [
              ["Declaración de clase", "<code>public class MiPrograma { ... }</code>", "No compila: el archivo no tiene estructura."],
              ["Método main", "<code>public static void main(String[] args) { ... }</code>", "El programa compila pero no arranca: Java no encuentra por dónde empezar."],
              ["Sentencia", "<code>System.out.println(\"x\");</code>", "Error «';' expected»: no sabe dónde termina la instrucción."],
              ["Bloque", "<code>{ ... }</code>", "Error «illegal start of expression» o llaves sin balancear."],
              ["Comentario", "<code>// esto se ignora</code>", "No afecta: el comentario lo lee una persona, Java lo salta."]
            ]
          },
          { type: "heading", text: "Un programa completo, comentado" },
          {
            type: "code",
            file: "FichaMiembro.java",
            code:
`// Programa que imprime la ficha básica de un miembro de Corporal Fit.
// Autor: Kevin Sanchez
public class FichaMiembro {          // la clase contiene todo el programa

    public static void main(String[] args) {
        // Primero mostramos el encabezado
        System.out.println("FICHA DE MIEMBRO");

        // Después, los datos del gimnasio (todavía sin variables)
        System.out.println("Gimnasio: Corporal Fit");
        System.out.println("Plan: Entrenamiento anual");

        // Cierre visual
        System.out.println("Gracias por entrenar con nosotros");
    }
}`
          },
          {
            type: "lines",
            items: [
              {
                line: "// Programa que imprime la ficha...",
                why:
                  "Comentario de una línea: Java lo <strong>ignora por completo</strong>. Sirve para explicar a otra persona qué hace el archivo. No modifica la salida."
              },
              {
                line: "public class FichaMiembro {",
                why:
                  "La clase se llama igual que el archivo: <code>FichaMiembro.java</code>. La palabra <code>public</code> obliga a esa coincidencia."
              },
              {
                line: "public static void main(String[] args) {",
                why:
                  "Firma exacta del punto de entrada. Si cambias <code>String[] args</code> por otra cosa, el programa dejará de arrancar aunque compile."
              },
              {
                line: "// Primero mostramos el encabezado",
                why:
                  "Comentario que anticipa qué viene. Un buen comentario explica <em>por qué</em> existe algo, no repite lo que ya dice el código."
              },
              {
                line: 'System.out.println("Gimnasio: Corporal Fit");',
                why:
                  "Sentencia: expresión + <code>;</code>. Los dos puntos dentro del texto son solo caracteres, no tienen significado para Java."
              }
            ]
          },
          {
            type: "output",
            lines: [
              "FICHA DE MIEMBRO",
              "Gimnasio: Corporal Fit",
              "Plan: Entrenamiento anual",
              "Gracias por entrenar con nosotros"
            ],
            why:
              "Los comentarios no aparecen en la salida porque no son instrucciones: el compilador los descarta. Solo se ejecutan los <code>println</code>, en el orden en que aparecen."
          },
          {
            type: "trace",
            title: "Anatomía en ejecución",
            intro: "Observa cómo cada bloque { } se abre y se cierra, y cómo la salida crece solo cuando hay sentencias.",
            code:
`public class FichaMiembro {
    public static void main(String[] args) {
        // Primero mostramos el encabezado
        System.out.println("FICHA DE MIEMBRO");
        System.out.println("Plan: Entrenamiento anual");
    }
}`,
            steps: [
              {
                line: 1,
                note: "Se abre el bloque de la clase. Aún no hay ejecución visible: solo la estructura.",
                vars: [],
                out: []
              },
              {
                line: 2,
                note: "Se abre el bloque de <code>main</code> y comienza la ejecución real. Nace la variable <code>args</code>.",
                vars: [["args", "String[] vacío"]],
                out: []
              },
              {
                line: 3,
                note: "Comentario: el motor de ejecución lo <strong>salta</strong>. Ningún cambio de estado.",
                vars: [["args", "String[] vacío"]],
                out: []
              },
              {
                line: 4,
                note: "Primera sentencia ejecutada: aparece una línea de salida.",
                vars: [["args", "String[] vacío"]],
                out: ["FICHA DE MIEMBRO"]
              },
              {
                line: 5,
                note: "Segunda sentencia: se añade debajo. Las sentencias se ejecutan en orden estricto.",
                vars: [["args", "String[] vacío"]],
                out: ["FICHA DE MIEMBRO", "Plan: Entrenamiento anual"]
              },
              {
                line: 6,
                note: "Se cierra main y la clase. Fin del programa, sin errores.",
                vars: [],
                out: ["FICHA DE MIEMBRO", "Plan: Entrenamiento anual"]
              }
            ]
          },
          {
            type: "concept",
            title: "Regla de coincidencia de nombres",
            html:
              "Si la clase es <code>public</code>, el archivo <strong>debe</strong> llamarse igual con la extensión <code>.java</code>: <code>Tarjeta.java</code> para <code>public class Tarjeta</code>. Java distingue mayúsculas: <code>tarjeta.java</code> no sirve. Esta regla existe para que el compilador pueda encontrar la clase que le pides compilar."
          },
          { type: "heading", text: "Ejemplos progresivos" },
          {
            type: "code",
            file: "EjemploA.java (nivel básico: estructura mínima)",
            code:
`public class EjemploA {
    public static void main(String[] args) {
    }
}`
          },
          {
            type: "para",
            html: "Esta estructura vacía <strong>compila y se ejecuta</strong>, pero no imprime nada: main abre, hace «nada» y cierra. Es el esqueleto con el que empiezas cada programa nuevo.",
          },
          {
            type: "code",
            file: "EjemploB.java (nivel intermedio: con comentarios útiles)",
            code:
`public class EjemploB {
    public static void main(String[] args) {
        // 1) Encabezado
        System.out.println("CONTROL DE ACCESO");

        // 2) Datos fijos del gimnasio
        System.out.println("Sucursal: Norte");
        System.out.println("Horario: 06:00 - 22:00");
    }
}`
          },
          {
            type: "errors",
            title: "Errores frecuentes de sintaxis",
            items: [
              {
                error: "';' expected (línea 5)",
                cause:
                  "Falta el punto y coma al final de una sentencia. Java necesita saber exactamente dónde termina cada instrucción.",
                fix: "Añade <code>;</code> en la línea indicada y vuelve a compilar."
              },
              {
                error: "'}' expected / illegal start of expression",
                cause:
                  "Hay una llave que abrió y no cerró (o una de más). El error suele aparecer <strong>al final</strong> del archivo, lejos de la causa real.",
                fix:
                  "Cuenta llaves desde el principio: cada <code>{</code> necesita su <code>}</code>. La indentación (sangría) ayuda a verlo, pero Java no la exige: por eso un código sin sangría compila igual y se lee mal."
              },
              {
                error: "class FichaMiembro is public, should be declared in a file named FichaMiembro.java",
                cause:
                  "El nombre del archivo no coincide con la clase pública (mayúsculas incluidas).",
                fix: "Renombra el archivo exactamente igual que la clase, con <code>.java</code>."
              },
              {
                error: "No se ejecuta nada aunque compila",
                cause:
                  "Cambiaste la firma de <code>main</code> (por ejemplo, quitaste <code>String[] args</code>). Java compila el archivo, pero no encuentra el punto de entrada.",
                fix:
                  "Restaura la línea completa: <code>public static void main(String[] args) {</code>. Es la firma que Java busca literalmente."
              }
            ]
          },
          {
            type: "tip",
            html:
              "<strong>Orden recomendado ante un error:</strong> 1) lee la línea que marca el compilador, 2) si no la entiendes, revisa la línea anterior (suele faltar un <code>;</code> o una llave), 3) corrige <em>una sola cosa</em> y vuelve a compilar. Corregir cinco cosas a la vez no te dice cuál era la que rompía el programa."
          },
          {
            type: "application",
            title: "Aplicación práctica: informe de asistencia",
            html:
              "Un programa real de consola para Corporal Fit que imprime un informe con comentarios que explican cada bloque:",
            file: "Asistencia.java",
            code:
`// Informe diario de asistencia - Corporal Fit
public class Asistencia {
    public static void main(String[] args) {
        // Encabezado del informe
        System.out.println("ASISTENCIA DEL DIA");

        // Datos registrados en el turno
        System.out.println("Miembros activos: 42");
        System.out.println("Clases grupales: 6");
        System.out.println("Horas abiertas: 14");

        // Cierre
        System.out.println("Generado por el sistema de reception");
    }
}`,
            output:
`ASISTENCIA DEL DIA
Miembros activos: 42
Clases grupales: 6
Horas abiertas: 14
Generado por el sistema de reception`,
            why:
              "Es el mismo patrón que usarás durante todo el curso: clase → main → bloques comentados → sentencias. Cuando en el módulo 2 aparezcan las variables, solo cambiarán las líneas de datos; la estructura se mantiene."
          }
        ],
        practice: {
          title: "Reconstruye el programa roto",
          prompt:
            "A continuación tienes un programa con <strong>varios errores de sintaxis</strong>. Escribe la versión corregida completa (clase, main e instrucciones). La práctica comprueba la estructura, no el texto exacto de los mensajes.",
          label: "Versión corregida:",
          startCode:
`public class Control {
    public static void main(String[] args)
        System.out.println("CONTROL DE ACCESO"
        System.out.println("Puerta 1 abierta");
    }
}`,
          hints: [
            "Cuenta cuántos <code>{</code> hay y cuántos <code>}</code>: el número debe coincidir.",
            "Busca paréntesis y comillas sin cerrar en la primera instrucción.",
            "Toda sentencia termina en <code>;</code> y la firma de main necesita llaves de apertura."
          ],
          checks: [
            {
              pattern: "public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*\\w*\\s*\\)\\s*\\{",
              message: "La firma de main no está completa o le faltan sus llaves { }.",
              hint: "Debe ser: public static void main(String[] args) {"
            },
            {
              pattern: "System\\.out\\.println\\(\\s*\"[^\"]*\"\\s*\\)\\s*;",
              min: 2,
              message: "Las instrucciones println deben tener su texto entre comillas y cerrar con );",
              hint: "Cada println necesita: paréntesis, comillas dobles alrededor del texto, paréntesis de cierre y ;"
            },
            {
              pattern: "\\{[^{}]*\\}",
              message: "No se ven bloques con llaves balanceadas.",
              hint: "El bloque de main debe abrir { y cerrar }."
            }
          ],
          forbidden: [
            {
              pattern: "System\\.out\\.Println",
              message: "println debe ir en minúscula.",
              hint: "Println con P mayúscula no existe."
            }
          ],
          solution: {
            code:
`public class Control {
    public static void main(String[] args) {
        System.out.println("CONTROL DE ACCESO");
        System.out.println("Puerta 1 abierta");
    }
}`,
            explanation:
              "Tres fallos corregidos: (1) faltaba <code>{</code> tras la firma de main, (2) la primera instrucción no cerraba comillas ni paréntesis y no tenía <code>;</code>, (3) la llave de cierre de main no tenía pareja. Fíjate en cómo el compilador señalaría la <em>línea 3</em> mientras el origen real está en la 2: por eso se revisa siempre la línea anterior."
          }
        },
        exercises: [
          {
            id: "m1l2e1",
            level: "Básico",
            statement:
              "Escribe <code>Horario.java</code>: un programa con <strong>dos comentarios</strong> (uno antes de los datos y otro antes del cierre) que imprima el horario de Corporal Fit en tres líneas.",
            criteria: [
              "Contiene al menos dos comentarios que empiecen por //",
              "Los comentarios NO aparecen en la salida.",
              "La salida son 3 líneas de datos.",
              "La estructura tiene llaves balanceadas."
            ],
            hints: [
              "Un comentario ocupa su propia línea y Java lo salta.",
              "Si en tu salida aparece texto que no querías, revisa si lo escribiste fuera de un comentario."
            ],
            solution: {
              code:
`public class Horario {
    public static void main(String[] args) {
        // Horarios de la semana
        System.out.println("Lunes a viernes: 06:00 - 22:00");
        System.out.println("Sabados: 08:00 - 18:00");
        System.out.println("Domingos: cerrado");

        // Cierre
        System.out.println("Corporal Fit");
    }
}`,
              explanation:
                "Los comentarios no generan salida: solo acompañan al lector humano. Si tu salida muestra los comentarios, es que los escribiste <em>dentro</em> de un println como si fueran texto."
            }
          },
          {
            id: "m1l2e2",
            level: "Intermedio",
            statement:
              "El siguiente programa tiene <strong>3 errores</strong>. Encuéntralos sin ejecutar y escribe la versión corregida: <code>public class Salida { public static void main(String[] args) System.out.println(\"Hola\"); System.out.print(\"Mundo\"); } }</code>",
            criteria: [
              "Tras la firma de main se añade la llave { de apertura.",
              "La primera instrucción termina en );",
              "No queda una llave } sobrante al final."
            ],
            hints: [
              "Cuenta llaves: en el original hay dos de cierre y ninguna de apertura tras main.",
              "Busca la instrucción que no tiene ; al final."
            ],
            solution: {
              code:
`public class Salida {
    public static void main(String[] args) {
        System.out.println("Hola");
        System.out.print("Mundo");
    }
}`,
              explanation:
                "Errores: (1) falta <code>{</code> después de main, (2) falta <code>;</code> tras el primer println, (3) sobraba una <code>}</code> final. Nota: con <code>print</code> (sin ln) la salida sería <code>HolaMundo</code> en la misma línea: eso es intencional en este ejercicio."
            }
          },
          {
            id: "m1l2e3",
            level: "Aplicado",
            statement:
              "Crea <code>InventarioTexto.java</code> para Corporal Fit que imprima un listado fijo de 3 elementos del inventario (toallas, mancuernas, bicicletas) con su cantidad, precedido de un encabezado y acompañado de comentarios que expliquen cada bloque. Debe haber al menos 6 líneas de salida.",
            criteria: [
              "La salida tiene 6 líneas o más (encabezado, 3 productos y cierre).",
              "Tiene comentarios en dos bloques distintos.",
              "Los comentarios no se ven en la salida.",
              "El nombre de la clase coincide con el archivo."
            ],
            hints: [
              "Dibuja primero las líneas de salida y después escribe un println por línea.",
              "Comenta el porqué («listado para revisión semanal»), no el qué («imprimo productos»)."
            ],
            solution: {
              code:
`// Listado fijo de inventario para la revision semanal de Corporal Fit
public class InventarioTexto {
    public static void main(String[] args) {
        // Encabezado
        System.out.println("INVENTARIO SEMANAL");

        // Cantidades registradas a mano
        System.out.println("Toallas: 30");
        System.out.println("Mancuernas: 12");
        System.out.println("Bicicletas: 8");

        // Cierre del listado
        System.out.println("Fin del inventario");
    }
}`,
              explanation:
                "Tres bloques (encabezado, datos, cierre) y comentarios que documentan la intención. Este mismo patrón escalará cuando las cantidades pasen a ser variables y, más adelante, cuando se calculen."
            }
          }
        ],
        quiz: {
          title: "Evaluación de comprensión — Lección 2",
          passScore: 0.75,
          questions: [
            {
              id: "q1",
              question: "¿Cuál es la función del método <code>main</code>?",
              options: [
                { id: "a", text: "Imprimir texto por pantalla." },
                { id: "b", text: "Ser el punto de entrada desde donde arranca la ejecución." },
                { id: "c", text: "Declarar variables del programa." },
                { id: "d", text: "Compilar el archivo .java." }
              ],
              answer: "b",
              why: {
                correct:
                  "Exacto. Java busca literalmente esa firma para empezar a ejecutar. Todo lo demás del programa ocurre porque main lo llama o porque está dentro de él.",
                wrong: {
                  a: "Imprimir lo hace System.out.println, que es una instrucción que puede estar dentro de main (o en otro método).",
                  c: "Declarar variables pueden hacerlo main y cualquier otro método; no es su función exclusiva.",
                  d: "Compilar es tarea de javac, un programa externo del JDK."
                }
              }
            },
            {
              id: "q2",
              question: "Tienes <code>public class Reporte</code> guardada en <code>informe.java</code>. ¿Qué ocurre?",
              options: [
                { id: "a", text: "Compila sin problemas." },
                { id: "b", text: "No compila: el archivo debe llamarse Reporte.java." },
                { id: "c", text: "Se renombra automáticamente." },
                { id: "d", text: "Falla solo al ejecutar, no al compilar." }
              ],
              answer: "b",
              why: {
                correct:
                  "Correcto: la clase pública define el nombre obligatorio del archivo, respetando mayúsculas. Es un error de compilación, no de ejecución.",
                wrong: {
                  a: "Java exige la coincidencia exacta para poder localizar la clase.",
                  c: "Ninguna herramienta renombra tus archivos: el compilador solo informa del problema.",
                  d: "El compilador rechaza el archivo antes de generar el .class, así que nunca llega a ejecutarse."
                }
              }
            },
            {
              id: "q3",
              question: "¿Qué ocurre con los comentarios <code>// ...</code> cuando se ejecuta el programa?",
              options: [
                { id: "a", text: "Se imprimen en pantalla." },
                { id: "b", text: "Provocan error si no están bien escritos." },
                { id: "c", text: "Se ignoran por completo: no aparecen en la salida." },
                { id: "d", text: "Solo funcionan dentro de main." }
              ],
              answer: "c",
              why: {
                correct:
                  "Los comentarios se descartan durante la compilación. Su destinatario es quien lee el código, no la máquina.",
                wrong: {
                  a: "Para que se vean en pantalla tendrían que estar dentro de un println como texto entre comillas.",
                  b: "Un comentario mal escrito no rompe el programa: lo único importante es no dejar una // abierta que «coma» el resto del código.",
                  d: "Puedes comentar en cualquier lugar del archivo: antes de la clase, dentro o fuera de main."
                }
              }
            },
            {
              id: "q4",
              question: "El compilador marca <code>'}' expected</code> en la última línea. ¿Dónde miras primero?",
              options: [
                { id: "a", text: "En la última línea: seguro que falta una llave ahí." },
                { id: "b", text: "En las líneas anteriores: lo más probable es que falte una { de apertura." },
                { id: "c", text: "Borras el archivo y empiezas de cero." },
                { id: "d", text: "En los comentarios, porque no deben tener llaves." }
              ],
              answer: "b",
              why: {
                correct:
                  "Muy bien razonado: el mensaje aparece donde el compilador se queda sin poder continuar, pero la causa suele estar antes. Cuenta las llaves desde la primera línea.",
                wrong: {
                  a: "Suele ser justo al revés: la llave de cierre está, falta la de apertura en un bloque anterior.",
                  c: "Es una solución desproporcionada: primero diagnostica. Reescribir esconde el error en lugar de entenderlo.",
                  d: "Los comentarios no participan en el balance de llaves porque se descartan antes."
                }
              }
            }
          ]
        },
        summary: [
          "Un programa Java tiene jerarquía: <strong>clase → bloques { } → sentencias terminadas en <code>;</code></strong>.",
          "El método <code>main</code> es el único punto de entrada y su firma no se toca.",
          "La clase pública define el nombre del archivo (<code>Reporte.java</code> para <code>public class Reporte</code>).",
          "Los comentarios (<code>//</code>) explican el porqué y <strong>nunca</strong> aparecen en la salida.",
          "Ante un error de llaves: revisa hacia atrás, no hacia delante."
        ]
      },
      /* =========================================================
         LECCIÓN 3 — JDK, JVM y bytecode
         ========================================================= */
      {
        id: "m1l3",
        number: 3,
        title: "JDK, JVM y bytecode: cómo se ejecuta un programa Java",
        duration: "30 minutos",
        requirements: { quizScore: 0.75, practice: true, exercisesMin: 1 },
        objectives: [
          "Explicar la diferencia entre <strong>JDK</strong>, <strong>JVM</strong> y <strong>bytecode</strong>.",
          "Describir el flujo: código fuente → compilación → bytecode → ejecución.",
          "Escribir los comandos <code>javac</code> y <code>java</code> correctos en la terminal.",
          "Diagnosticar errores del entorno: «javac no se reconoce», «clase no encontrada» y «sigue saliendo lo viejo»."
        ],
        blocks: [
          {
            type: "lead",
            html:
              "Java no ejecuta directamente el archivo <code>.java</code>. Primero <strong>compila</strong> (traduce y valida) y después <strong>ejecuta</strong> el resultado. Entender ese recorrido explica la mayoría de los errores que verás en esta etapa."
          },
          {
            type: "analogy",
            title: "Analogía: el traductor y los países",
            html:
              "Escribes la receta en español (tu archivo <code>.java</code>). Un traductor profesional (<strong>javac</strong>, del JDK) la pasa a un idioma internacional común: el <strong>bytecode</strong> (archivo <code>.class</code>). Cada país tiene su propio traductor local (<strong>JVM</strong>) que entiende ese idioma y ejecuta la receta. Por eso el mismo <code>.class</code> corre en Windows, Linux o Mac: solo cambia la JVM."
          },
          {
            type: "list",
            ordered: false,
            items: [
              "<strong>JDK (Java Development Kit):</strong> el kit completo de desarrollo. Incluye el compilador <code>javac</code>, el ejecutor <code>java</code> y las librerías.",
              "<strong>JVM (Java Virtual Machine):</strong> la máquina virtual que ejecuta el bytecode dentro de tu sistema operativo. Es la que se comunica con la memoria y el procesador.",
              "<strong>Bytecode:</strong> el contenido del archivo <code>.class</code>. No es para tu procesador, es para la JVM.",
              "<strong>JRE:</strong> era el kit solo para ejecutar (JVM + librerías). Hoy ya no se instala aparte: el JDK lo incluye."
            ]
          },
          {
            type: "table",
            headers: ["Fase", "Comando", "Qué produce", "Qué comprueba"],
            rows: [
              ["Compilación", "<code>javac HolaMundo.java</code>", "<code>HolaMundo.class</code>", "Sintaxis, nombres, tipos y estructura."],
              ["Ejecución", "<code>java HolaMundo</code>", "Salida en consola", "Lógica del programa en ese momento concreto."],
              ["Inspección", "<code>dir</code> / <code>ls</code>", "Listado de archivos", "Que el <code>.class</code> existe y está actualizado."]
            ]
          },
          { type: "heading", text: "El flujo completo en la terminal" },
          {
            type: "code",
            file: "Terminal",
            code:
`# 1) Compilar (genera el archivo HolaMundo.class)
javac HolaMundo.java

# 2) Comprobar que el .class se creó
dir            # Windows
ls             # Linux o Mac

# 3) Ejecutar (sin extensión .class)
java HolaMundo`
          },
          {
            type: "tip",
            html:
              "<strong>Detalle que confunde a todos:</strong> se ejecuta <code>java HolaMundo</code> y <strong>nunca</strong> <code>java HolaMundo.class</code>. El comando <code>java</code> recibe el <em>nombre de la clase</em>, no el nombre del archivo. Por eso también pide que coincida con mayúsculas."
          },
          {
            type: "trace",
            title: "Qué ocurre en el disco en cada paso",
            intro:
              "Aquí el «estado» son los archivos del proyecto. Observa cuándo aparece el <code>.class</code> y qué pasa si modificas el código sin recompilar.",
            code:
`javac HolaMundo.java
java HolaMundo
// (editas HolaMundo.java y agregas una línea)
java HolaMundo`,
            steps: [
              {
                line: 1,
                note:
                  "El compilador lee el texto, valida la sintaxis y, si no hay errores, escribe el bytecode en un archivo nuevo: <code>HolaMundo.class</code>.",
                vars: [
                  ["HolaMundo.java", "existe (texto fuente)"],
                  ["HolaMundo.class", "creado por javac"]
                ],
                out: []
              },
              {
                line: 2,
                note:
                  "La JVM carga el <code>.class</code>, busca el método <code>main</code> y lo ejecuta.",
                vars: [
                  ["HolaMundo.java", "existe"],
                  ["HolaMundo.class", "existe y se ejecuta"]
                ],
                out: ["Hola, mundo"]
              },
              {
                line: 3,
                note:
                  "Cambiaste el fuente, pero nadie volvió a compilar: el <code>.class</code> <strong>sigue siendo el viejo</strong>. Este es el error más habitual de entorno.",
                vars: [
                  ["HolaMundo.java", "MODIFICADO"],
                  ["HolaMundo.class", "DESPSADO (versión anterior)"]
                ],
                out: []
              },
              {
                line: 4,
                note:
                  "Al ejecutar, la JVM usa el bytecode que existe en disco: verás la salida antigua. Solución: volver a ejecutar <code>javac HolaMundo.java</code>.",
                vars: [
                  ["HolaMundo.java", "MODIFICADO"],
                  ["HolaMundo.class", "desfasado"]
                ],
                out: ["Hola, mundo  (¡la versión vieja!)"]
              }
            ]
          },
          {
            type: "errors",
            title: "Errores frecuentes del entorno",
            items: [
              {
                error: "'javac' is not recognized (o «comando no encontrado»)",
                cause:
                  "El JDK no está instalado o la carpeta <code>bin</code> del JDK no está en el PATH del sistema. La terminal no sabe dónde está el compilador.",
                fix:
                  "Instala un JDK (versión 17 o superior recomendada) y añade su carpeta <code>bin</code> al PATH. Verifica con <code>javac -version</code> en una terminal <strong>nueva</strong>."
              },
              {
                error: "error: Could not find or load main class HolaMundo",
                cause:
                  "La JVM no encuentra la clase: o ejecutas desde otra carpeta, o escribiste el nombre con mayúsculas distintas, o añadiste <code>.class</code>.",
                fix:
                  "Comprueba con <code>dir</code>/<code>ls</code> que el archivo está en la carpeta actual; ejecuta <code>java HolaMundo</code> exactamente igual que la clase."
              },
              {
                error: "Cambié el código y la salida no cambia",
                cause:
                  "Estás ejecutando el <code>.class</code> anterior: editaste el <code>.java</code> pero no volviste a compilar.",
                fix: "Vuelve a ejecutar <code>javac TuArchivo.java</code> y después <code>java TuClase</code>."
              },
              {
                error: "Clase principal no encontrada en archivo HolaMundo.java",
                cause:
                  "El archivo contiene una clase pública con nombre distinto al del archivo, o la clase es <code>package</code> de otro lugar (módulos avanzados).",
                fix:
                  "Alinea nombres: si el archivo es <code>HolaMundo.java</code>, la clase pública debe ser <code>HolaMundo</code>."
              }
            ]
          },
          {
            type: "concept",
            title: "Compilación frente a ejecución: dos momentos distintos",
            html:
              "<strong>Compilación</strong> (javac): revisa el <em>código completo</em> y traduce. Si algo no cuadra, <strong>nada</strong> se ejecuta. " +
              "<strong>Ejecución</strong> (java): corre el programa línea a línea y puede fallar <em>a mitad</em> según los datos del momento. " +
              "Por eso un error de compilación es estructural (siempre ocurre) y una excepción de ejecución depende del camino recorrido."
          },
          {
            type: "application",
            title: "Aplicación práctica: compilar y ejecutar un programa real",
            html:
              "Toma la tarjeta de bienvenida de la lección 1 y llévala de principio a fin por la terminal:",
            file: "Terminal (secuencia completa)",
            code:
`javac TarjetaBienvenida.java
dir
java TarjetaBienvenida`,
            output:
`==========================
  CORPORAL FIT - BIENVENIDO
==========================
Miembro: Kevin Sanchez
Plan: Entrenamiento anual
Registro: 12 de octubre
==========================`,
            why:
              "El <code>dir</code> confirma que se generó <code>TarjetaBienvenida.class</code>. Si cambias el nombre del miembro en el <code>.java</code>, recuerda recompilar antes de volver a ejecutar: la JVM no lee tu archivo fuente, solo el bytecode."
          }
        ],
        practice: {
          title: "Escribe los comandos correctos",
          prompt:
            "Tu programa se llama <code>Gimnasio.java</code> y declara <code>public class Gimnasio</code>. Escribe la secuencia de comandos para compilarlo, comprobar que se generó el archivo y ejecutarlo.",
          label: "Secuencia de comandos (uno por línea):",
          startCode: `// ejemplo:
// javac Gimnasio.java
`,
          hints: [
            "El compilador se invoca con <code>javac</code> y <strong>sí</strong> lleva la extensión <code>.java</code>.",
            "Para ejecutar se usa <code>java</code> con el nombre de la clase y <strong>sin</strong> extensión.",
            "La comprobación del archivo se hace con <code>dir</code> (Windows) o <code>ls</code> (Linux/Mac)."
          ],
          checks: [
            {
              pattern: "javac\\s+Gimnasio\\.java",
              message: "Falta o está mal escrito el comando de compilación.",
              hint: "javac sí recibe la extensión .java"
            },
            {
              pattern: "java\\s+Gimnasio\\b",
              message: "Falta el comando de ejecución con el nombre de la clase.",
              hint: "java Gimnasio (sin .java ni .class)"
            },
            {
              pattern: "\\b(dir|ls)\\b",
              message: "Falta comprobar que el archivo .class se creó.",
              hint: "Usa dir (Windows) o ls (Linux/Mac) entre compilar y ejecutar."
            }
          ],
          forbidden: [
            {
              pattern: "java\\s+Gimnasio\\.class",
              message: "No se ejecuta añadiendo .class: java recibe el nombre de la clase.",
              hint: "Prueba con: java Gimnasio"
            },
            {
              pattern: "java\\s+Gimnasio\\.java",
              message: "java no ejecuta archivos .java directamente en este flujo: primero javac.",
              hint: "El orden es javac Gimnasio.java y después java Gimnasio"
            }
          ],
          solution: {
            code:
`javac Gimnasio.java
dir
java Gimnasio`,
            explanation:
              "Tres pasos: compilar (genera Gimnasio.class), comprobar y ejecutar. Si el programa no imprime nada, revisa primero con <code>dir</code>/<code>ls</code> si el <code>.class</code> tiene la fecha de hace un momento: si es anterior a tu última edición, faltó recompilar."
          }
        },
        exercises: [
          {
            id: "m1l3e1",
            level: "Básico",
            statement:
              "Ordena estos pasos: (a) ejecutar <code>java Informe</code>, (b) escribir el código en <code>Informe.java</code>, (c) ejecutar <code>javac Informe.java</code>, (d) verificar con <code>dir</code> que existe <code>Informe.class</code>. Escribe la secuencia correcta y explica qué hace cada paso.",
            criteria: [
              "El orden es b → c → d → a.",
              "Explicas que javac genera el archivo .class.",
              "Indicas que java se ejecuta con el nombre de la clase, sin extensión."
            ],
            hints: [
              "No puedes compilar algo que todavía no existe.",
              "El .class debe existir antes de intentar ejecutar."
            ],
            solution: {
              code:
`b) escribir Informe.java
c) javac Informe.java   -> genera Informe.class
d) dir                  -> confirma que el .class existe
a) java Informe         -> la JVM ejecuta el bytecode`,
              explanation:
                "El orden importa: el bytecode es el «intermediario» obligatorio. Si en (d) el archivo no aparece, es que la compilación falló y debes leer el error de javac antes de seguir."
            }
          },
          {
            id: "m1l3e2",
            level: "Intermedio",
            statement:
              "Un compañero dice: «Modifiqué mi programa y al ejecutar sigue mostrando el mensaje antiguo». Diagnostica la causa más probable y escribe la solución paso a paso.",
            criteria: [
              "Identificas que el problema es el archivo .class desactualizado.",
              "Indicas que hay que recompilar con javac.",
              "Mencionas cómo comprobarlo (dir/ls con fecha del archivo)."
            ],
            hints: [
              "La JVM no lee el .java: lee el .class.",
              "Pregúntate quién genera el .class y cuándo se actualiza."
            ],
            solution: {
              code:
`javac TuPrograma.java
java TuPrograma`,
              explanation:
                "La causa: editaste el fuente, pero el bytecode anterior sigue en disco. Recompilar lo regenera. Hábito útil: recompilar siempre antes de ejecutar mientras aprendes."
            }
          },
          {
            id: "m1l3e3",
            level: "Aplicado",
            statement:
              "Prepara la carpeta de un mini proyecto Corporal Fit: crea <code>Recepcion.java</code> (con un println), compílalo, verifica que aparece el <code>.class</code> y ejecútalo. Anota en tus notas los comandos exactos que usaste y la salida obtenida.",
            criteria: [
              "El archivo se llama exactamente Recepcion.java con clase pública Recepcion.",
              "Se ejecutó javac Recepcion.java sin errores.",
              "Se verificó la existencia del .class con dir o ls.",
              "Se ejecutó java Recepcion y se observó la salida."
            ],
            hints: [
              "Si javac devuelve errores, no pases al siguiente paso: corrígelos primero.",
              "Abre la terminal en la misma carpeta del archivo (cd)."
            ],
            solution: {
              code:
`public class Recepcion {
    public static void main(String[] args) {
        System.out.println("Bienvenido a Corporal Fit");
    }
}`,
              explanation:
                "Este ejercicio busca consolidar el ciclo completo: escribir → compilar → verificar → ejecutar. Si en algún paso te atascas, el mensaje de la terminal es tu primera fuente de información, no un obstáculo."
            }
          }
        ],
        quiz: {
          title: "Evaluación de comprensión — Lección 3",
          passScore: 0.75,
          questions: [
            {
              id: "q1",
              question: "¿Qué programa es el que ejecuta el bytecode en tu sistema operativo?",
              options: [
                { id: "a", text: "javac" },
                { id: "b", text: "La JVM" },
                { id: "c", text: "El editor de texto" },
                { id: "d", text: "El archivo .java" }
              ],
              answer: "b",
              why: {
                correct:
                  "La JVM (máquina virtual Java) es la que entiende bytecode y habla con tu sistema operativo. Por eso el mismo .class corre en Windows, Linux o Mac.",
                wrong: {
                  a: "javac traduce Java a bytecode: compila, no ejecuta.",
                  c: "El editor solo guarda texto; no participa en la ejecución.",
                  d: "El .java es la fuente legible; la JVM nunca lo lee directamente."
                }
              }
            },
            {
              id: "q2",
              question: "¿Qué produce el comando <code>javac HolaMundo.java</code>?",
              options: [
                { id: "a", text: "El archivo HolaMundo.class con bytecode." },
                { id: "b", text: "La salida en pantalla del programa." },
                { id: "c", text: "Un archivo .txt con el resultado." },
                { id: "d", text: "Nada: solo comprueba errores." }
              ],
              answer: "a",
              why: {
                correct:
                  "Exacto: javac valida y traduce, y su producto es el archivo .class. La salida en pantalla la produce java (la ejecución).",
                wrong: {
                  b: "La salida la da la ejecución con java HolaMundo.",
                  c: "Java no genera .txt: genera bytecode .class.",
                  d: "Además de comprobar, produce un archivo ejecutable por la JVM."
                }
              }
            },
            {
              id: "q3",
              question: "Tienes <code>HolaMundo.class</code>. ¿Cómo se ejecuta correctamente?",
              options: [
                { id: "a", text: "java HolaMundo.class" },
                { id: "b", text: "java HolaMundo" },
                { id: "c", text: "javac HolaMundo" },
                { id: "d", text: "java HolaMundo.java" }
              ],
              answer: "b",
              why: {
                correct:
                  "Correcto: java recibe el nombre de la clase (sin extensión) y la JVM localiza su .class.",
                wrong: {
                  a: "Añadir .class provoca el error «Could not find or load main class».",
                  c: "javac es el compilador y necesita la fuente .java, no una clase ya compilada.",
                  d: "java no compila .java: ese trabajo es de javac."
                }
              }
            },
            {
              id: "q4",
              question: "Editaste el mensaje de tu programa, ejecutaste <code>java</code> y aparece el mensaje anterior. ¿Por qué?",
              options: [
                { id: "a", text: "Porque la JVM guarda la salida anterior en caché." },
                { id: "b", text: "Porque falta recompilar: el .class sigue siendo el anterior." },
                { id: "c", text: "Porque el archivo .java se borró al editarlo." },
                { id: "d", text: "Porque println solo imprime la primera vez." }
              ],
              answer: "b",
              why: {
                correct:
                  "Muy bien: la JVM ejecuta el bytecode que existe en disco. Si no recompilaste, ese bytecode es el viejo. Vuelve a ejecutar javac y listo.",
                wrong: {
                  a: "No hay caché de salida: la JVM lee el .class actualizado o el desactualizado, según lo que haya en disco.",
                  c: "Editar no borra el archivo; además, si faltara, javac te daría el error «file not found».",
                  d: "println imprime cuantas veces se lo pidas; el problema es de compilación, no de la instrucción."
                }
              }
            }
          ]
        },
        summary: [
          "El flujo de Java es <strong>código fuente (.java) → javac → bytecode (.class) → JVM → salida</strong>.",
          "<strong>javac</strong> compila (y genera el <code>.class</code>); <strong>java</strong> ejecuta (con el nombre de la clase, sin extensión).",
          "La JVM es la que hace multiplataforma al bytecode.",
          "Si editas el código y no recompilas, seguirás ejecutando la versión vieja.",
          "Los errores del entorno («javac no reconocido», «clase no encontrada») son de configuración o de nombres, no de tu lógica."
        ]
      },

      /* =========================================================
         LECCIÓN 4 — Salida: print, println y concatenación
         ========================================================= */
      {
        id: "m1l4",
        number: 4,
        title: "Mostrar información: print, println y concatenación",
        duration: "30 minutos",
        requirements: { quizScore: 0.75, practice: true, exercisesMin: 1 },
        objectives: [
          "Diferenciar <code>print</code> de <code>println</code> y predecir cuándo la salida queda en la misma línea.",
          "Concatenar textos con el operador <code>+</code> y anticipar el resultado exacto.",
          "Explicar por qué <code>\"Total: \" + 5 + 2</code> da <code>Total: 52</code> y no <code>Total: 7</code>.",
          "Componer una salida legible (encabezados, datos y cierre) en un programa de consola."
        ],
        blocks: [
          {
            type: "lead",
            html:
              "Hasta ahora solo usaste <code>println</code>. En esta lección verás su hermano <code>print</code>, y la herramienta que hace útiles a los programas: <strong>concatenación</strong>, unir piezas de texto con el operador <code>+</code>."
          },
          {
            type: "analogy",
            title: "Analogía: la impresora y el pegamento",
            html:
              "<code>println</code> es una impresora que imprime y <em>alimenta el papel</em> (salta de línea). <code>print</code> imprime y deja el cabezal donde está (sigues en la misma línea). El <code>+</code> es pegamento: une trozos de texto uno detrás de otro, sin importar que sean palabras o números."
          },
          {
            type: "table",
            headers: ["Instrucción", "Qué hace", "Cuándo usarla"],
            rows: [
              ["<code>System.out.println(texto)</code>", "Imprime y salta de línea.", "La mayoría de los casos: una idea por línea."],
              ["<code>System.out.print(texto)</code>", "Imprime sin saltar de línea.", "Para continuar en la misma línea (etiquetas, tabulaciones)."]
            ]
          },
          { type: "heading", text: "print frente a println" },
          {
            type: "code",
            file: "Comparacion.java",
            code:
`public class Comparacion {
    public static void main(String[] args) {
        System.out.print("Hola ");
        System.out.print("a todos");
        System.out.println();
        System.out.println("Bienvenidos");
    }
}`
          },
          {
            type: "output",
            lines: ["Hola a todos", "Bienvenidos"],
            why:
              "El primer <code>print</code> deja el cursor a continuación, así que el segundo escribe «a todos» pegado (con el espacio que incluía el primer texto). <code>println()</code> con paréntesis vacíos solo salta de línea. Después, «Bienvenidos» empieza en una fila nueva."
          },
          {
            type: "trace",
            title: "Seguimiento: dónde queda el cursor",
            intro:
              "Observa cómo la «salida acumulada» cambia y en qué posición queda el cursor tras cada instrucción.",
            code:
`System.out.print("Hola ");
System.out.print("a todos");
System.out.println();
System.out.println("Bienvenidos");`,
            steps: [
              {
                line: 1,
                note: "print escribe sin saltar: la salida queda <code>Hola </code> y el cursor sigue al final.",
                vars: [["cursor", "después de «Hola »"]],
                out: ["Hola "]
              },
              {
                line: 2,
                note: "Segundo print: se añade justo a continuación, en la MISMA línea.",
                vars: [["cursor", "después de «Hola a todos»"]],
                out: ["Hola a todos"]
              },
              {
                line: 3,
                note: "println() vacío: no imprime texto, solo salta de línea.",
                vars: [["cursor", "inicio de la línea siguiente"]],
                out: ["Hola a todos"]
              },
              {
                line: 4,
                note: "println escribe y vuelve a saltar. Salida final en dos líneas.",
                vars: [["cursor", "inicio de la siguiente"]],
                out: ["Hola a todos", "Bienvenidos"]
              }
            ]
          },
          { type: "heading", text: "Concatenación: unir piezas con + " },
          {
            type: "para",
            html:
              "El operador <code>+</code>, cuando al menos uno de los lados es un texto, <strong>une</strong> en lugar de sumar. Esto permite construir mensajes que combinan texto fijo y datos:"
          },
          {
            type: "code",
            file: "Concatenacion.java",
            code:
`public class Concatenacion {
    public static void main(String[] args) {
        System.out.println("Miembro: " + "Kevin");
        System.out.println("Edad: " + 28);
        System.out.println("Plan: " + "Anual" + " (activo)");
    }
}`
          },
          {
            type: "output",
            lines: ["Miembro: Kevin", "Edad: 28", "Plan: Anual (activo)"],
            why:
              "Cada <code>+</code> pega lo que tiene a los lados. Fíjate en el espacio antes de la coma: si escribes <code>\"Edad: \" + 28</code>, el espacio ya está dentro de las comillas; si olvidas el espacio, saldrá <code>Edad:28</code>."
          },
          {
            type: "concept",
            title: "La trampa clásica: suma y pegamento en la misma línea",
            html:
              "Java evalúa de <strong>izquierda a derecha</strong>. En <code>\"Total: \" + 5 + 2</code> primero pega «Total: » con 5 → «Total: 5», y después pega 2 → «Total: 52». " +
              "Si quieres sumar antes: <code>\"Total: \" + (5 + 2)</code> → «Total: 7». Los paréntesis cambian el orden, igual que en matemáticas."
          },
          {
            type: "code",
            file: "TrampaConcatenacion.java",
            code:
`public class TrampaConcatenacion {
    public static void main(String[] args) {
        System.out.println("Total: " + 5 + 2);        // pegamento todo
        System.out.println("Total: " + (5 + 2));      // suma primero
    }
}`
          },
          {
            type: "output",
            lines: ["Total: 52", "Total: 7"],
            why:
              "Ambas líneas son correctas en sintaxis: cambia el resultado porque cambia el orden de evaluación. Este mismo comportamiento aparecerá con variables en el módulo 2, y ahí es donde más se usa."
          },
          {
            type: "errors",
            title: "Errores frecuentes",
            items: [
              {
                error: "La salida sale pegada en una sola línea",
                cause:
                  "Usaste <code>print</code> donde esperabas un salto de línea, o escribiste todo dentro de un solo println.",
                fix:
                  "Cambia a <code>println</code>, o divide en varias instrucciones (una idea por línea)."
              },
              {
                error: "cannot find symbol: variable Total",
                cause:
                  "Escribiste el texto sin comillas: <code>System.out.println(Total: 5);</code>. Java cree que «Total» es un nombre de variable que nadie declaró.",
                fix: "Envuelve el texto en comillas dobles: <code>\"Total: 5\"</code>."
              },
              {
                error: "Total: 52 cuando esperabas 7",
                cause:
                  "El <code>+</code> pegó en lugar de sumar, porque la evaluación va de izquierda a derecha y el primer operando era texto.",
                fix: "Agrupa la suma: <code>\"Total: \" + (5 + 2)</code>."
              },
              {
                error: "Me olvidé de los espacios y sale «Miembro:Kevin»",
                cause:
                  "Los espacios visibles deben escribirse dentro de las comillas: Java no los añade por ti.",
                fix: "Escribe <code>\"Miembro: \"</code> con el espacio antes de la comilla final."
              }
            ]
          },
          { type: "heading", text: "Ejemplos progresivos" },
          {
            type: "code",
            file: "Nivel1.java",
            code:
`public class Nivel1 {
    public static void main(String[] args) {
        System.out.print("Corporal");
        System.out.print(" Fit");
        System.out.println();
    }
}`
          },
          {
            type: "para",
            html: "Dos <code>print</code> y un <code>println()</code> para cortar: la salida es <code>Corporal Fit</code> en una sola línea.",
          },
          {
            type: "code",
            file: "Nivel2.java",
            code:
`public class Nivel2 {
    public static void main(String[] args) {
        String sucursal = "Norte";   // vista previa de variables: llegan en el módulo 2
        System.out.println("Sucursal: " + sucursal);
        System.out.println("Horario: " + "06:00" + " a " + "22:00");
    }
}`
          },
          {
            type: "tip",
            html:
              "En el ejemplo anterior aparece <code>String sucursal = \"Norte\";</code>: es una <strong>variable</strong>, que verás en detalle en el módulo 2. Por ahora solo observa que <code>+</code> pega el valor de la variable igual que pegaría texto fijo."
          },
          {
            type: "application",
            title: "Aplicación práctica: ficha con datos combinados",
            html:
              "Una ficha de Corporal Fit que mezcla texto fijo y datos, usando print para las etiquetas y println para los saltos:",
            file: "FichaCompleta.java",
            code:
`public class FichaCompleta {
    public static void main(String[] args) {
        System.out.println("========== CORPOAL FIT ==========");
        System.out.print("Miembro: ");
        System.out.println("Ana Torres");
        System.out.print("Plan: ");
        System.out.println("Mensual ilimitado");
        System.out.print("Inicio: ");
        System.out.println("12 de octubre");
        System.out.println("=================================");
    }
}`,
            output:
`========== CORPOAL FIT ==========
Miembro: Ana Torres
Plan: Mensual ilimitado
Inicio: 12 de octubre
=================================`,
            why:
              "El patrón print (etiqueta) + println (valor) es muy común en consola. Alternativamente podrías hacerlo en una sola instrucción con concatenación: <code>System.out.println(\"Miembro: \" + \"Ana Torres\");</code>. Ambas formas son correctas; elige la que se lea mejor en tu código."
          }
        ],
        practice: {
          title: "Diseña la salida y después el código",
          prompt:
            "Escribe un programa que muestre <strong>exactamente</strong> estas 4 líneas usando concatenación al menos una vez:<br>Alumno: Kevin<br>Curso: Java desde cero<br>Progreso: 25%<br>Estado: en curso",
          label: "Contenido del programa:",
          startCode:
`public class Progreso {
    public static void main(String[] args) {
        // tu código aquí
    }
}`,
          hints: [
            "Cada línea visible necesita su propia instrucción (aquí, cuatro).",
            "Usa <code>System.out.println(\"Progreso: \" + 25 + \"%\");</code> para practicar la concatenación con un número.",
            "Revisa los espacios dentro de las comillas: si falta, la salida queda pegada."
          ],
          checks: [
            {
              pattern: "System\\.out\\.println\\(",
              min: 4,
              message: "Necesitas cuatro instrucciones println (una por línea visible).",
              hint: "Cuenta las líneas de la salida que te pedí."
            },
            {
              pattern: "\\+",
              message: "Falta una concatenación con el operador +.",
              hint: "Une texto y dato: \"Progreso: \" + 25"
            },
            {
              pattern: "\"[^\"]+\"",
              min: 3,
              message: "Faltan textos entre comillas.",
              hint: "El texto fijo va entre comillas dobles."
            }
          ],
          forbidden: [
            {
              pattern: "System\\.out\\.Println",
              message: "println va en minúscula.",
              hint: "Mayúsculas correctas: System.out.println"
            }
          ],
          solution: {
            code:
`public class Progreso {
    public static void main(String[] args) {
        System.out.println("Alumno: " + "Kevin");
        System.out.println("Curso: Java desde cero");
        System.out.println("Progreso: " + 25 + "%");
        System.out.println("Estado: en curso");
    }
}`,
            explanation:
              "Cuatro println, cuatro líneas. En la tercera, la evaluación de izquierda a derecha pega «Progreso: », luego 25 y luego «%», dando «Progreso: 25%». Si hubieras escrito \"Progreso: \" + 2 + 5 + \"%\" habrías obtenido «Progreso: 25%» por pegamento, ¡no por suma! Con los paréntesis: (2 + 5) → 7."
          }
        },
        exercises: [
          {
            id: "m1l4e1",
            level: "Básico",
            statement:
              "Escribe <code>Etiquetas.java</code> que muestre en la <strong>misma línea</strong> la palabra <code>Plan:</code> seguida de <code>Anual</code>, y en la línea siguiente <code>Fin</code>.",
            criteria: [
              "Se usa print (sin ln) para la etiqueta y println para el valor.",
              "La salida tiene exactamente 2 líneas.",
              "En la primera línea aparece «Plan: Anual» con un espacio.",
              "La segunda línea es exactamente «Fin»."
            ],
            hints: [
              "print deja el cursor en la misma línea: ahí entra el println siguiente.",
              "El espacio entre los dos textos debe estar escrito en el código."
            ],
            solution: {
              code:
`public class Etiquetas {
    public static void main(String[] args) {
        System.out.print("Plan: ");
        System.out.println("Anual");
        System.out.println("Fin");
    }
}`,
              explanation:
                "print(\"Plan: \") deja el cursor tras el espacio; println(\"Anual\") completa la línea y salta. Si hubieras usado println en la primera, «Anual» saldría sola debajo."
            }
          },
          {
            id: "m1l4e2",
            level: "Intermedio",
            statement:
              "Predice la salida de este código <strong>sin ejecutarlo</strong> y anótala; después verifica:<br><code>System.out.println(\"Suma: \" + 3 + 4);</code><br><code>System.out.println(\"Suma: \" + (3 + 4));</code><br><code>System.out.print(\"a\"); System.out.print(\"b\");</code>",
            criteria: [
              "La primera línea se predice como «Suma: 34».",
              "La segunda se predice como «Suma: 7».",
              "La tercera se predice como «ab» en una sola línea."
            ],
            hints: [
              "Recuerda que la evaluación va de izquierda a derecha.",
              "Con print (sin ln) no hay salto de línea entre «a» y «b»."
            ],
            solution: {
              code:
`Suma: 34
Suma: 7
ab`,
              explanation:
                "Primera: «Suma: » es texto, así que 3 y 4 se pegan (34). Segunda: los paréntesis suman primero (7). Tercera: dos print seguidos = misma línea."
            }
          },
          {
            id: "m1l4e3",
            level: "Aplicado",
            statement:
              "Crea <code>Recibo.java</code> para Corporal Fit que simule un recibo de 6 líneas: encabezado, dos líneas de conceptos con importes (usa concatenación con números) y línea de total. La salida debe ser legible, con espacios correctos.",
            criteria: [
              "Tiene encabezado y línea de cierre (o total) claramente identificables.",
              "Usa concatenación con al menos dos números.",
              "Ninguna línea sale pegada a otra (se usó println donde correspondía).",
              "Los espacios dentro de las comillas están correctos."
            ],
            hints: [
              "Dibuja primero las 6 líneas de salida.",
              "Ejemplo de línea con dato: System.out.println(\"Mensualidad: \" + 45000);"
            ],
            solution: {
              code:
`public class Recibo {
    public static void main(String[] args) {
        System.out.println("========= RECIBO =========");
        System.out.println("Gimnasio: " + "Corporal Fit");
        System.out.println("Mensualidad: " + 45000);
        System.out.println("Descuento: " + 5000);
        System.out.println("Total: " + 40000);
        System.out.println("Gracias por su pago");
    }
}`,
              explanation:
                "Concatenar con números permite que el texto y los datos convivan en la misma instrucción. En el módulo 2 esos números serán variables y el total se podrá calcular (incluso sumarlos) en lugar de escribirlo a mano."
            }
          }
        ],
        quiz: {
          title: "Evaluación de comprensión — Lección 4",
          passScore: 0.75,
          questions: [
            {
              id: "q1",
              question: "¿Cuál es la diferencia entre <code>print</code> y <code>println</code>?",
              options: [
                { id: "a", text: "Ninguna: son sinónimos." },
                { id: "b", text: "println imprime y salta de línea; print se queda en la misma línea." },
                { id: "c", text: "print solo sirve para números." },
                { id: "d", text: "println no admite textos entre comillas." }
              ],
              answer: "b",
              why: {
                correct:
                  "Exacto: println añade el salto de línea al terminar; print deja el cursor en la misma línea.",
                wrong: {
                  a: "Si fueran sinónimos, la salida cambiaría según cuál uses (y no es así: cambia el salto).",
                  c: "print admite texto y números igual que println.",
                  d: "println recibe textos, números y concatenaciones; el salto es lo único que aporta de más."
                }
              }
            },
            {
              id: "q2",
              question: "¿Qué imprime <code>System.out.println(\"Total: \" + 5 + 2);</code>?",
              options: [
                { id: "a", text: "Total: 7" },
                { id: "b", text: "Total: 52" },
                { id: "c", text: "Total: 5 2" },
                { id: "d", text: "No compila." }
              ],
              answer: "b",
              why: {
                correct:
                  "Correcto: al ser el primer operando un texto, el + pega. Se evalúa de izquierda a derecha: «Total: 5» y después «Total: 52».",
                wrong: {
                  a: "Para obtener 7 harían falta paréntesis: \"Total: \" + (5 + 2).",
                  c: "No se añaden espacios automáticamente: el resultado es «Total: 52» sin espacios entre los números.",
                  d: "Compila perfectamente: es la trampa típica de la concatenación."
                }
              }
            },
            {
              id: "q3",
              question: "Quieres que salga <code>Total: 7</code>. ¿Qué línea usas?",
              options: [
                { id: "a", text: "System.out.println(\"Total: \" + 5 + 2);" },
                { id: "b", text: "System.out.println(\"Total: \" + (5 + 2));" },
                { id: "c", text: "System.out.println(\"Total: \" 5 + 2);" },
                { id: "d", text: "System.out.println(Total: 5 + 2);" }
              ],
              answer: "b",
              why: {
                correct:
                  "Muy bien: los paréntesis obligan a sumar antes de pegar.",
                wrong: {
                  a: "Imprime «Total: 52»: el pegamento va primero por la izquierda.",
                  c: "Faltan las comillas y el + antes del 5: es un error de sintaxis.",
                  d: "Sin comillas, Java interpreta «Total» como un símbolo que no existe."
                }
              }
            },
            {
              id: "q4",
              question: "Veo esto en la salida: <code>Miembro:Kevin</code>. ¿Qué ocurrió?",
              options: [
                { id: "a", text: "Java no respeta los espacios del código." },
                { id: "b", text: "El espacio se olvidó escribir dentro de las comillas." },
                { id: "c", text: "println elimina los espacios automáticamente." },
                { id: "d", text: "El archivo debe guardarse con espacios dobles." }
              ],
              answer: "b",
              why: {
                correct:
                  "Exacto: los espacios visibles son parte del texto. Debes escribirlos dentro de las comillas: \"Miembro: \".",
                wrong: {
                  a: "Java ignora la sangría del código, pero respeta al carácter cada cosa escrita dentro de comillas.",
                  c: "println solo añade el salto de línea; no toca el contenido del texto.",
                  d: "El guardado del archivo no altera el contenido del string."
                }
              }
            }
          ]
        },
        summary: [
          "<code>println</code> imprime y salta de línea; <code>print</code> se queda en la misma.",
          "El <code>+</code> une textos (concatenación) cuando uno de los lados es un texto.",
          "La evaluación va de <strong>izquierda a derecha</strong>: usa paréntesis para sumar antes de pegar.",
          "Los espacios visibles se escriben dentro de las comillas.",
          "Un mensaje claro (etiqueta + dato) hace que la consola sea legible para quien la use."
        ]
      },
      /* =========================================================
         LECCIÓN 5 — Compilación, depuración y buenas prácticas
         ========================================================= */
      {
        id: "m1l5",
        number: 5,
        title: "Del error al programa correcto: compilación, depuración y buenas prácticas",
        duration: "35 minutos",
        requirements: { quizScore: 0.75, practice: true, exercisesMin: 1 },
        objectives: [
          "Distinguir un <strong>error de compilación</strong> de una <strong>excepción en ejecución</strong>.",
          "Interpretar mensajes típicos: <code>cannot find symbol</code>, <code>incompatible types</code> y <code>ArithmeticException</code>.",
          "Aplicar un método de depuración en cuatro pasos en lugar de «tocar cosas a ver qué pasa».",
          "Entregar el programa final del módulo con estilo consistente (nombres, sangría y comentarios útiles)."
        ],
        blocks: [
          {
            type: "lead",
            html:
              "Hasta ahora tus errores han sido de sintaxis. En esta lección verás que hay otra familia: los que <strong>solo aparecen al ejecutar</strong>, cuando el programa recorre un camino concreto. Aprender a distinguirlas es la base de la depuración."
          },
          {
            type: "analogy",
            title: "Analogía: el diagnóstico antes de desmontar",
            html:
              "Si tu coche no arranca, un buen mecánico no desmonta el motor entero a ver qué sale. Primero escucha el síntoma, localiza el sistema y prueba una hipótesis. Depurar es eso: <strong>observar el síntoma, formular una hipótesis, cambiar una sola cosa y volver a probar</strong>."
          },
          {
            type: "table",
            headers: ["", "Error de compilación", "Excepción en ejecución"],
            rows: [
              ["Quién lo detecta", "<code>javac</code>", "La JVM durante la ejecución"],
              ["Cuándo", "Antes de generar el .class", "Después de compilar, a mitad del programa"],
              ["Ejemplo", "<code>';' expected</code>", "ArithmeticException: / by zero"],
              ["Cobertura", "El código completo", "Solo el camino que se ejecutó"],
              ["Corrección", "Ajustar la estructura o los tipos", "Controlar el dato o el caso que provoca el fallo"]
            ]
          },
          {
            type: "para",
            html:
              "Ejemplo de programa que <strong>compila sin problemas</strong> pero falla al ejecutarse. Fíjate en que la división no la hace el compilador con constantes, sino con una variable en el momento de correr:"
          },
          {
            type: "code",
            file: "Ratio.java",
            code:
`public class Ratio {
    public static void main(String[] args) {
        int socios = 42;
        int entrenadores = 0;
        int ratio = socios / entrenadores;   // compila, pero falla al ejecutar
        System.out.println("Ratio: " + ratio);
    }
}`
          },
          {
            type: "trace",
            title: "Traza de un fallo en tiempo de ejecución",
            intro:
              "Observa cómo el programa avanza con normalidad hasta la instrucción que provoca la excepción, y cómo se detiene <em>sin ejecutar</em> lo que viene después.",
            code:
`int socios = 42;
int entrenadores = 0;
int ratio = socios / entrenadores;
System.out.println("Ratio: " + ratio);`,
            steps: [
              {
                line: 1,
                note: "Se crea la variable socios con el valor 42. Todo normal.",
                vars: [["socios", "42"]],
                out: []
              },
              {
                line: 2,
                note: "Se crea entrenadores con valor 0. Legal en Java: 0 es un entero válido.",
                vars: [["socios", "42"], ["entrenadores", "0"]],
                out: []
              },
              {
                line: 3,
                note:
                  "Se intenta dividir 42 entre 0: la JVM lanza <code>ArithmeticException: / by zero</code>. La instrucción no termina y la variable ratio <strong>nunca se crea</strong>.",
                vars: [["socios", "42"], ["entrenadores", "0"], ["ratio", "NO EXISTE (fallo)"]],
                out: []
              },
              {
                line: 4,
                note:
                  "Esta línea <strong>no se ejecuta</strong>: al lanzarse la excepción sin capturarla, el programa termina inmediatamente con mensaje de error en consola.",
                vars: [["socios", "42"], ["entrenadores", "0"]],
                out: []
              }
            ]
          },
          {
            type: "errors",
            title: "Cómo leer los mensajes más frecuentes",
            items: [
              {
                error: "cannot find symbol: variable edad / class Persona",
                cause:
                  "Java no encuentra el nombre que escribiste: puede ser un error de escritura (mayúsculas), una variable declarada más abajo, una clase de otro paquete sin import o una variable fuera de su ámbito.",
                fix:
                  "Revisa mayúsculas, que el nombre esté declarado <em>antes</em> de usarse y que no esté dentro de otro método."
              },
              {
                error: "incompatible types: possible lossy conversion from double to int",
                cause:
                  "Intentas guardar un decimal (double) en una variable entera sin avisar: Java no redondea por ti porque perdería información.",
                fix:
                  "Acepta la pérdida con un cast explícito, por ejemplo <code>int x = (int) 3.9;</code>, o usa una variable <code>double</code>. Verás esto en el módulo 2."
              },
              {
                error: "ArithmeticException: / by zero",
                cause:
                  "Una división entre cero en tiempo de ejecución. El compilador no lo puede saber si el cero viene de una variable.",
                fix:
                  "Valida antes de dividir: si el divisor es 0, muestra un mensaje y no dividas. En el módulo 3 aprenderás a decidir con <code>if</code>."
              },
              {
                error: "El programa termina sin mostrar la salida esperada",
                cause:
                  "Puede que las instrucciones estén después de un <code>return</code>, en un bloque que no se ejecuta, o que una excepción anterior haya cortado la ejecución.",
                fix:
                  "Añade temporalmente marcas: <code>System.out.println(\"paso 1\");</code> y observa hasta dónde llegan."
              }
            ]
          },
          {
            type: "heading",
            text: "Método de depuración en cuatro pasos"
          },
          {
            type: "list",
            ordered: true,
            items: [
              "<strong>Observa:</strong> lee el mensaje completo y la línea que señala. No lo ignores ni lo borres.",
              "<strong>Localiza:</strong> abre el archivo en esa línea; si no hay nada raro, mira la línea anterior.",
              "<strong>Formula una hipótesis:</strong> «falta un ;», «divido entre cero», «olvidé la comilla».",
              "<strong>Cambia una sola cosa</strong> y vuelve a compilar o ejecutar. Si cambias cinco cosas a la vez, no sabrás cuál lo arregló."
            ]
          },
          {
            type: "tip",
            html:
              "<strong>La herramienta más barata del mundo:</strong> imprimir marcas. Un <code>System.out.println(\"-- llegué aquí\");</code> te dice si el programa llegó a esa parte. Cuando aprendas métodos y POO, esos rastros se sustituirán por depuradores, pero el razonamiento es el mismo."
          },
          {
            type: "concept",
            title: "Buenas prácticas desde el día uno",
            html:
              "1) <strong>Nombres que se lean:</strong> <code>totalSocios</code> en lugar de <code>t</code>. 2) <strong>Sangría consistente:</strong> un nivel por bloque. 3) <strong>Un concepto por línea.</strong> 4) <strong>Comentarios del porqué:</strong> evita repetir lo que el código ya dice. 5) <strong>Compila a menudo:</strong> cuanto antes detectes el error, menos líneas tendrás que revisar."
          },
          {
            type: "application",
            title: "Programa final del módulo: recepción de Corporal Fit",
            html:
              "Este programa integra todo lo aprendido: clase, main, comentarios, print, println y concatenación. Es la pieza con la que cierras el módulo 1:",
            file: "Recepcion.java",
            code:
`// Recepcion de Corporal Fit - modulo 1 completo
public class Recepcion {
    public static void main(String[] args) {
        // Encabezado con print y println combinados
        System.out.print("==== ");
        System.out.print("CORPORAL FIT");
        System.out.println(" ====");

        // Datos del miembro (todavia literales, sin variables)
        System.out.println("Miembro: Kevin Sanchez");
        System.out.println("Plan: Entrenamiento anual");
        System.out.println("Acceso: Sala, clases y piscina");

        // Pie
        System.out.println("Disfrute su entrenamiento");
    }
}`,
            output:
`==== CORPORAL FIT ====
Miembro: Kevin Sanchez
Plan: Entrenamiento anual
Acceso: Sala, clases y piscina
Disfrute su entrenamiento`,
            why:
              "Combina print (para el encabezado en una línea) y println (para los datos). Los comentarios documentan la intención de cada bloque. Este mismo archivo será tu punto de partida en el módulo 2, cuando esas tres líneas de datos pasen a ser variables y puedan cambiar sin editar el programa."
          },
          {
            type: "heading",
            text: "Lista de comprobación del módulo 1"
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Puedo explicar la diferencia entre algoritmo, código fuente y programa en ejecución.",
              "Sé escribir la estructura mínima de un programa Java sin mirar.",
              "Sé compilar con <code>javac</code> y ejecutar con <code>java</code> sin confundirme con extensiones.",
              "Predigo la salida de <code>print</code>/<code>println</code> y de concatenaciones simples.",
              "Cuando aparece un error, leo el mensaje antes de tocar el código."
            ]
          }
        ],
        practice: {
          title: "Depura este programa",
          prompt:
            "El siguiente programa lanza <code>ArithmeticException: / by zero</code> al ejecutarse. Escribe la versión corregida que muestre <code>Promedio: 5</code> usando <strong>variables</strong> para el dividendo (10) y el divisor (2).",
          label: "Versión corregida:",
          startCode:
`public class Promedio {
    public static void main(String[] args) {
        int dividendo = 10;
        int divisor = 0;
        int promedio = dividendo / divisor;
        System.out.println("Promedio: " + promedio);
    }
}`,
          hints: [
            "El error no está en el println: está en el valor que recibe el divisor.",
            "Cambia el divisor por un valor distinto de cero y conserva el resto del código.",
            "Recuerda que la división ocurre en tiempo de ejecución: el compilador no avisa."
          ],
          checks: [
            {
              pattern: "int\\s+\\w+\\s*=\\s*10",
              message: "Falta la variable con el dividendo 10.",
              hint: "Algo como: int dividendo = 10;"
            },
            {
              pattern: "int\\s+\\w+\\s*=\\s*2\\s*;",
              message: "Falta la variable con el divisor 2.",
              hint: "Algo como: int divisor = 2;"
            },
            {
              pattern: "/\\s*\\w+",
              message: "Falta la división entre las dos variables.",
              hint: "int promedio = dividendo / divisor;"
            },
            {
              pattern: "System\\.out\\.println\\(",
              message: "Falta la instrucción que muestra el resultado.",
              hint: "Muestra el valor de la variable promedio."
            }
          ],
          forbidden: [
            {
              pattern: "/\\s*0\\b",
              message: "Todavía estás dividiendo entre cero.",
              hint: "El divisor debe ser 2, no 0."
            }
          ],
          solution: {
            code:
`public class Promedio {
    public static void main(String[] args) {
        int dividendo = 10;
        int divisor = 2;
        int promedio = dividendo / divisor;
        System.out.println("Promedio: " + promedio);
    }
}`,
            explanation:
              "El cambio fue de un solo valor (divisor = 2). Con variables enteras, 10 / 2 = 5 (división entera). Si el divisor fuera 3, la salida sería 1: los decimales se descartan, y eso lo verás a fondo en el módulo 2. La clave pedagógica: el programa <em>compilaba</em> antes del cambio; el fallo era de ejecución."
          }
        },
        exercises: [
          {
            id: "m1l5e1",
            level: "Básico",
            statement:
              "Clasifica cada caso como «error de compilación» o «excepción de ejecución» y justifica: (a) falta un <code>;</code>, (b) división entre cero con una variable, (c) el archivo se llama distinto a la clase pública, (d) se usa una variable antes de existir.",
            criteria: [
              "(a) y (c) están marcados como errores de compilación.",
              "(b) está marcado como excepción de ejecución.",
              "(d) está marcado como error de compilación (las variables deben declararse antes de usarse).",
              "Cada caso lleva una justificación de una línea."
            ],
            hints: [
              "Pregúntate si javac puede detectar el problema leyendo el código completo.",
              "La división por cero solo se conoce con el valor real en el momento de correr."
            ],
            solution: {
              code:
`a) compilacion: falta ; (estructura)
b) ejecucion: el divisor vale 0 en ese momento
c) compilacion: no se encuentra la clase que se pide compilar
d) compilacion: cannot find symbol (uso antes de declarar)`,
              explanation:
                "La regla práctica: si javac lo detecta sin correr el programa, es de compilación. Solo los valores y caminos concretos producen excepciones de ejecución."
            }
          },
          {
            id: "m1l5e2",
            level: "Intermedio",
            statement:
              "Este programa tiene <strong>un error de compilación</strong> y <strong>uno de ejecución</strong>. Encuéntralos, expícalos y escribe la versión corregida:<br><code>public class Ingreso { public static void main(String[] args) System.out.println(\"Socios: \" + total); int total = 10 / 0; }</code>",
            criteria: [
              "Identificas el error de compilación (falta { y el uso de total antes de declararse).",
              "Identificas el error de ejecución (10 / 0).",
              "La versión corregida compila y no lanza excepción.",
              "La salida esperada está indicada."
            ],
            hints: [
              "Ordena las ideas: primero declarar, luego operar, luego mostrar.",
              "Cambia el 0 por un valor que permita dividir."
            ],
            solution: {
              code:
`public class Ingreso {
    public static void main(String[] args) {
        int total = 10 / 2;
        System.out.println("Socios: " + total);
    }
}`,
              explanation:
                "Errores: (1) falta la llave { tras main; (2) <code>total</code> se usa en el println antes de declararse (cannot find symbol); (3) 10 / 0 lanza ArithmeticException al ejecutarse. Corregidos los tres, la salida es «Socios: 5»."
            }
          },
          {
            id: "m1l5e3",
            level: "Aplicado",
            statement:
              "Entrega el <strong>programa de cierre del módulo</strong>: una recepción de Corporal Fit con encabezado (print+println), tres datos con concatenación al menos en uno, pie, comentarios de bloque y nombres de archivo/clase coincidentes. Añade en tus notas la salida exacta que produjo.",
            criteria: [
              "Encabezado en una línea usando print y println combinados.",
              "Al menos una línea usa concatenación con un número.",
              "Tiene comentarios antes de cada bloque de datos.",
              "La salida coincide línea a línea con lo que se esperaba (verifícalo leyendo el código antes de ejecutar)."
            ],
            hints: [
              "Predice la salida en papel y después compara con la consola.",
              "Si algo no coincide, aplica el método de depuración de cuatro pasos."
            ],
            solution: {
              code:
`// Recepcion de Corporal Fit
public class Recepcion {
    public static void main(String[] args) {
        // Encabezado
        System.out.print("==== ");
        System.out.println("CORPORAL FIT ====");

        // Datos
        System.out.println("Miembro: Ana Torres");
        System.out.println("Plan: Mensual");
        System.out.println("Dias restantes: " + 18);

        // Pie
        System.out.println("Buen entrenamiento");
    }
}`,
              explanation:
                "Este programa es tu baseline: cuando en el módulo 2 declares variables, podrás reemplazar los literales (18, «Ana Torres») por datos que cambian sin tocar la estructura. Ese es el salto de «imprimir texto» a «programar»."
            }
          }
        ],
        quiz: {
          title: "Evaluación de comprensión — Lección 5 (y cierre del módulo)",
          passScore: 0.75,
          questions: [
            {
              id: "q1",
              question: "¿Qué es un error de compilación?",
              options: [
                { id: "a", text: "Un error que ocurre cuando el programa ya está corriendo." },
                { id: "b", text: "Un problema estructural que javac detecta antes de generar el .class." },
                { id: "c", text: "Un fallo del sistema operativo." },
                { id: "d", text: "Un aviso que no impide ejecutar." }
              ],
              answer: "b",
              why: {
                correct:
                  "Exacto: javac valida el código completo y, si falla, no genera bytecode: nada se ejecuta.",
                wrong: {
                  a: "Eso describe una excepción en ejecución.",
                  c: "El sistema operativo no interviene en la validación de tu código Java.",
                  d: "Un error de compilación impide por completo generar el programa."
                }
              }
            },
            {
              id: "q2",
              question: "Tu programa compila correctamente y al ejecutar aparece «Exception in thread main: ArithmeticException: / by zero». ¿Qué significa?",
              options: [
                { id: "a", text: "Hay un error de sintaxis en la línea señalada." },
                { id: "b", text: "El compilador detectó la división por cero." },
                { id: "c", text: "En ejecución, una división tuvo divisor cero y el programa se detuvo." },
                { id: "d", text: "El archivo .class está dañado." }
              ],
              answer: "c",
              why: {
                correct:
                  "Correcto: es una excepción de ejecución. El programa llegó a esa instrucción con un divisor igual a cero; al no controlarse, termina ahí.",
                wrong: {
                  a: "Los errores de sintaxis impiden compilar; aquí la compilación pasó.",
                  b: "Si el compilador lo detectara (constante 10 / 0), daría error de compilación; con variables no puede saberlo.",
                  d: "El .class se generó bien; el fallo es de la operación, no del archivo."
                }
              }
            },
            {
              id: "q3",
              question: "Ves «cannot find symbol: variable edad». ¿Qué revisas primero?",
              options: [
                { id: "a", text: "El antivirus." },
                { id: "b", text: "La escritura del nombre, las mayúsculas y si está declarada antes de usarse." },
                { id: "c", text: "El tamaño de la ventana de la terminal." },
                { id: "d", text: "La versión de Java instalada." }
              ],
              answer: "b",
              why: {
                correct:
                  "Bien: es el mensaje más común y casi siempre tiene una de estas tres causas (nombre mal escrito, mayúsculas o ámbito).",
                wrong: {
                  a: "El antivirus no participa en la resolución de símbolos del código.",
                  c: "La terminal no afecta a la compilación.",
                  d: "La versión rara vez explica «cannot find symbol»; primero revisa tu código."
                }
              }
            },
            {
              id: "q4",
              question: "Ante un error, ¿qué estrategia es la más efectiva?",
              options: [
                { id: "a", text: "Cambiar varias líneas a la vez hasta que deje de fallar." },
                { id: "b", text: "Borrar el archivo y empezar de cero." },
                { id: "c", text: "Leer el mensaje, localizar la línea (y la anterior) y cambiar una sola cosa." },
                { id: "d", text: "Copiar el código de otro sitio sin leerlo." }
              ],
              answer: "c",
              why: {
                correct:
                  "Exacto: diagnosticar antes de intervenir. Cambiar una sola cosa te dice con certeza qué era lo que estaba mal.",
                wrong: {
                  a: "Si cambias cinco cosas, no sabes cuál lo arregló (y puedes introducir un error nuevo).",
                  b: "Perdes contexto y seguramente repitas el mismo error.",
                  d: "No aprendes nada y el código ajeno puede traer problemas que no entiendes."
                }
              }
            },
            {
              id: "q5",
              question: "¿Cuál de estas es una buena práctica desde el principio?",
              options: [
                { id: "a", text: "Usar letras sueltas como nombres: int t = 10;" },
                { id: "b", text: "Nombrar por lo que representan: int totalSocios = 10;" },
                { id: "c", text: "Escribir todo el programa sin compilar y probar al final." },
                { id: "d", text: "Comentar cada línea para explicar el código obvio." }
              ],
              answer: "b",
              why: {
                correct:
                  "Correcto: un nombre descriptivo documenta por sí mismo y reduce la necesidad de comentarios.",
                wrong: {
                  a: "Las letras obligan a leer el contexto completo para entender cada línea.",
                  c: "Compilar a menudo reduce el número de errores simultáneos por diagnosticar.",
                  d: "Los comentarios deben explicar el porqué; comentar lo obvio ensucia el código."
                }
              }
            }
          ]
        },
        summary: [
          "Un <strong>error de compilación</strong> lo detecta <code>javac</code> y bloquea el <code>.class</code>; una <strong>excepción</strong> ocurre al ejecutar, según los datos del momento.",
          "<code>ArithmeticException: / by zero</code> es de ejecución: el divisor valía cero en ese instante.",
          "Depurar en cuatro pasos: observar, localizar, hipotetizar y cambiar <strong>una sola cosa</strong>.",
          "Las marcas con <code>println</code> son la herramienta de diagnóstico más barata (y más útil) al principio.",
          "Buenas prácticas: nombres descriptivos, sangría consistente, comentarios del porqué y compilación frecuente."
        ]
      }
    ]
  });
})(typeof window !== "undefined" ? window : globalThis);
