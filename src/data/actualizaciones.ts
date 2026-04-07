export type Version = {
  version: string;
  date: string;
  title: string;
  changes: string[];
};

// MAJOR -> Cambio que rompe algo existen 2.0.0
// MINOR -> Feature nueva que no rompe nada 0.2.0
// PATCH -> Bug fix o mejora pequeña 0.1.1

/*
Ejemplos de progresión:


0.1.0  ← primera versión pública
0.1.1  ← fix de un bug
0.2.0  ← nueva feature (ej: esta página de actualizaciones)
0.3.0  ← otra feature
1.0.0  ← lanzamiento oficial
*/

export const actualizaciones: Version[] = [
  {
    version: "0.1.0",
    date: "2026-04-07",
    title: "Creacion de una pagina 'actualizaciones'",
    changes: ["visibilidad de nuevas actualizaciones"],
  }
];
