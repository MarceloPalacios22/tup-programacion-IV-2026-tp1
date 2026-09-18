import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

// Arreglo: guardamos nombre y notas.
const alumnos = [
  { id: 1, nombre: "Marcelo Palacios", notas: [8, 7, 9] },
  { id: 2, nombre: "Jose Ruiz", notas: [5, 4, 6] },
];

let nextId = 3;

// Calcula el promedio de las 3 notas
function calcularPromedio(notas) {
  const suma = notas.reduce((acc, n) => acc + n, 0);
  return suma / notas.length;
}

// Determina la condicion
function calcularCondicion(promedio) {
  if (promedio < 6) return "reprobado";
  if (promedio < 8) return "aprobado";
  return "promocionado";
}

function mapearAlumno(alumno) {
  const promedio = calcularPromedio(alumno.notas);
  return {
    id: alumno.id,
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio,
    condicion: calcularCondicion(promedio),
  };
}

function validarAlumno(nombre, notas, idAExcluir) {
  if (typeof nombre !== "string" || nombre.trim() === "") {
    return "El nombre es obligatorio";
  }

  const nombreExistente = alumnos.some(
    (a) =>
      a.id !== idAExcluir &&
      a.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
  );
  if (nombreExistente) {
    return "Ya existe un alumno con ese nombre";
  }

  if (!Array.isArray(notas) || notas.length !== 3) {
    return "Las notas deben ser un arreglo de 3 valores";
  }

  const notaInvalida = notas.some(
    (n) => typeof n !== "number" || isNaN(n) || n < 0 || n > 10
  );
  if (notaInvalida) {
    return "Cada nota debe ser un número entre 0 y 10";
  }

  return null;
}

// Listado completo
app.get("/alumnos", (req, res) => {
  res.send(alumnos.map(mapearAlumno));
});

// Detalle de un alumno
app.get("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send({ error: "El id debe ser un número positivo" });
  }

  const alumno = alumnos.find((a) => a.id === id);

  if (!alumno) {
    return res.status(404).send({ error: "Alumno no encontrado" });
  }

  res.send(mapearAlumno(alumno));
});

// Crear un nuevo alumno
app.post("/alumnos", (req, res) => {
  const { nombre, notas } = req.body;

  const error = validarAlumno(nombre, notas, null);
  if (error) {
    return res.status(400).send({ error });
  }

  const nuevoAlumno = {
    id: nextId++,
    nombre: nombre.trim(),
    notas,
  };

  alumnos.push(nuevoAlumno);
  res.status(201).send(mapearAlumno(nuevoAlumno));
});

// Modificar un alumno
app.put("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send({ error: "El id debe ser un número positivo" });
  }

  const alumno = alumnos.find((a) => a.id === id);
  if (!alumno) {
    return res.status(404).send({ error: "Alumno no encontrado" });
  }

  const { nombre, notas } = req.body;

  const error = validarAlumno(nombre, notas, id);
  if (error) {
    return res.status(400).send({ error });
  }

  alumno.nombre = nombre.trim();
  alumno.notas = notas;

  res.send(mapearAlumno(alumno));
});

// Eliminar un alumno
app.delete("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send({ error: "El id debe ser un número positivo" });
  }

  const alumno = alumnos.find((a) => a.id === id);
  if (!alumno) {
    return res.status(404).send({ error: "Alumno no encontrado" });
  }

  alumnos = alumnos.filter((a) => a.id !== id);
  res.send(mapearAlumno(alumno));
});

app.listen(PORT, () => {
  console.log(`Servidor Ejercicio2 ${PORT}`);
});