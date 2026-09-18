import express from "express";

const app = express();
const PORT = 3000;

app.get("/rectangulos", (req, res) => {
  const { base, altura } = req.query;

  if (base === undefined || altura === undefined) {
    return res.status(400).send({ error: "Debe indicar base y altura" });
  }

  const baseNum = Number(base);
  const alturaNum = Number(altura);

  if (isNaN(baseNum) || isNaN(alturaNum)) {
    return res.status(400).send({ error: "base y altura deben ser numéricos" });
  }

  if (baseNum <= 0 || alturaNum <= 0) {
    return res.status(400).send({ error: "base y altura deben ser valores positivos" });
  }

  const perimetro = 2 * (baseNum + alturaNum);
  const superficie = baseNum * alturaNum;


  const esCuadrado = baseNum === alturaNum;

  res.send({
    base: baseNum,
    altura: alturaNum,
    perimetro,
    superficie,
    esCuadrado,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de Ejercicio1 ${PORT}`);
});