import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

let tareas = [
  { id: 1, nombre: "Repasar Express", completada: true },
  { id: 2, nombre: "Entregar TP1", completada: false },
];

let nextId = 3;


function validarTarea(nombre, completada, idAExcluir) {
  if (typeof nombre !== "string" || nombre.trim() === "") {
    return "El nombre es obligatorio";
  }

  const nombreExistente = tareas.some(
    (t) =>
      t.id !== idAExcluir &&
      t.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
  );
  if (nombreExistente) {
    return "Ya existe una tarea con ese nombre";
  }

  if (completada !== undefined && typeof completada !== "boolean") {
    return "completada debe ser true o false";
  }

  return null;
}

// Listado con filtro
app.get("/tareas", (req, res) => {
  const { completada } = req.query;

  // Listado sin filtro
  if (completada === undefined) {
    return res.send(tareas);
  }

  if (completada !== "true" && completada !== "false") {
    return res
      .status(400)
      .send({ error: "completada debe ser 'true' o 'false'" });
  }

  const filtro = completada === "true";
  res.send(tareas.filter((t) => t.completada === filtro));
});

// Detalle de una tarea
app.get("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send({ error: "El id debe ser un número positivo" });
  }

  const tarea = tareas.find((t) => t.id === id);

  if (!tarea) {
    return res.status(404).send({ error: "Tarea no encontrada" });
  }

  res.send(tarea);
});

// Crear una tarea nueva
app.post("/tareas", (req, res) => {
  const { nombre } = req.body;
  
  const completada = req.body.completada ?? false;

  const error = validarTarea(nombre, completada, null);
  if (error) {
    return res.status(400).send({ error });
  }

  const nuevaTarea = {
    id: nextId++,
    nombre: nombre.trim(),
    completada,
  };

  tareas.push(nuevaTarea);
  res.status(201).send(nuevaTarea);
});

// Modificar nombre o estado de una tarea
app.put("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send({ error: "El id debe ser un número positivo" });
  }

  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) {
    return res.status(404).send({ error: "Tarea no encontrada" });
  }

  const { nombre } = req.body;
  const completada = req.body.completada ?? tarea.completada;

  const error = validarTarea(nombre, completada, id);
  if (error) {
    return res.status(400).send({ error });
  }

  tarea.nombre = nombre.trim();
  tarea.completada = completada;

  res.send(tarea);
});

// Eliminar una tarea
app.delete("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send({ error: "El id debe ser un número positivo" });
  }

  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) {
    return res.status(404).send({ error: "Tarea no encontrada" });
  }

  tareas = tareas.filter((t) => t.id !== id);
  res.send(tarea);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});