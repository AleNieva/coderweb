
const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/guardar-alumnos', (req, res) => {
  // Obtener los datos del alumno desde la solicitud
  const nuevoAlumno = req.body;

  // Leer los datos existentes del archivo JSON
  fs.readFile('alumnos.json', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo JSON:', err);
      res.status(500).send('Error al guardar los datos del alumno');
      return;
    }

    const alumnos = JSON.parse(data);

    // Agregar el nuevo alumno a la lista de alumnos
    alumnos.push(nuevoAlumno);

    // Escribir los datos actualizados en el archivo JSON
    fs.writeFile('alumnos.json', JSON.stringify(alumnos), (err) => {
      if (err) {
        console.error('Error al escribir en el archivo JSON:', err);
        res.status(500).send('Error al guardar los datos del alumno');
        return;
      }

      // Enviar una respuesta de éxito
      res.status(200).send('Datos del alumno guardados exitosamente');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
