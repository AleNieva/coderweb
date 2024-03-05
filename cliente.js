document.addEventListener('DOMContentLoaded', function () {
    let alumnos = [];

    function calcularPromedio(notas) {
        const suma = notas.reduce((total, nota) => total + nota, 0);
        return suma / notas.length;
    }

    function guardarDatosEnJSON(alumnos) {
        fetch('/guardar-alumnos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ alumnos: alumnos }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar los datos de los alumnos.');
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function mostrarResultadosConSweetAlert(alumnos) {
        let contenido = '';
        alumnos.forEach(alumno => {
            contenido += `
                <p>Nombre: ${alumno.nombre}</p>
                <p>Notas: ${alumno.notas.join(', ')}</p>
                <p>Promedio: ${alumno.promedio.toFixed(1)}</p>
                <p>Estado: ${alumno.promedio >= 6 ? 'Aprobado' : 'Reprobado'}</p>
                <button class="editar" data-nombre="${alumno.nombre}">Editar</button>
                <button class="eliminar" data-nombre="${alumno.nombre}">Eliminar</button>
                <hr>
            `;
        });

        Swal.fire({
            title: 'Resultados',
            html: contenido,
            confirmButtonText: 'Cerrar',
            didRender: () => {
                const botonesEditar = document.querySelectorAll('.editar');
                botonesEditar.forEach(boton => {
                    boton.addEventListener('click', () => {
                        const nombre = boton.getAttribute('data-nombre');
                        const alumno = alumnos.find(a => a.nombre === nombre);
                        Swal.fire({
                            title: `Editar alumno ${nombre}`,
                            html: `
                                <input id="nuevoNombre" class="swal2-input" placeholder="Nuevo nombre" value="${alumno.nombre}">
                                <input id="nuevasNotas" class="swal2-input" placeholder="Nuevas notas separadas por coma" value="${alumno.notas.join(', ')}">
                            `,
                            confirmButtonText: 'Guardar cambios',
                            preConfirm: () => {
                                const nuevoNombre = document.getElementById('nuevoNombre').value;
                                const nuevasNotas = document.getElementById('nuevasNotas').value.split(',').map(nota => parseFloat(nota.trim()));
                                const nuevoPromedio = calcularPromedio(nuevasNotas);
                                const index = alumnos.findIndex(a => a.nombre === nombre);
                                if (index !== -1) {
                                    alumnos[index].nombre = nuevoNombre;
                                    alumnos[index].notas = nuevasNotas;
                                    alumnos[index].promedio = nuevoPromedio;
                                    mostrarResultadosConSweetAlert(alumnos);
                                }
                            }
                        });
                    });
                });

                const botonesEliminar = document.querySelectorAll('.eliminar');
                botonesEliminar.forEach(boton => {
                    boton.addEventListener('click', () => {
                        const nombre = boton.getAttribute('data-nombre');
                        const index = alumnos.findIndex(a => a.nombre === nombre);
                        if (index !== -1) {
                            alumnos.splice(index, 1);
                            mostrarResultadosConSweetAlert(alumnos);
                        }
                    });
                });
            }
        });
    }

    document.getElementById('agregar-alumno').addEventListener('click', () => {
        Swal.fire({
            title: 'Agregar Alumno',
            html: `
                <input id="nombre" class="swal2-input" placeholder="Nombre del alumno">
                <input id="notas" class="swal2-input" placeholder="Notas separadas por coma">
            `,
            confirmButtonText: 'Agregar',
            preConfirm: () => {
                const nombre = document.getElementById('nombre').value;
                const notas = document.getElementById('notas').value.split(',').map(nota => parseFloat(nota.trim()));
                const promedio = calcularPromedio(notas);
                alumnos.push({ nombre, notas, promedio });
                return { nombre, notas, promedio };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                mostrarResultadosConSweetAlert(alumnos);
            }
        });
    });

    window.addEventListener('beforeunload', () => {
        const confirmacion = confirm('¿Quieres guardar los datos antes de salir?');
        if (confirmacion) {
            guardarDatosEnJSON(alumnos);
        }
    });
});


   
