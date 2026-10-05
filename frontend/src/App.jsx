import { useEffect, useState } from 'react';
import './App.css';

const API = `http://${window.location.hostname}:3000`;

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [estado, setEstado] = useState('');

  async function solicitar(ruta, opciones = {}) {
    const metodo = opciones.method || 'GET';
    setEstado(`${metodo} ${ruta} ...`);

    const respuesta = await fetch(`${API}${ruta}`, opciones);
    const datos = await respuesta.json();

    console.log('[HTTP]', metodo, ruta, respuesta.status, datos);

    if (!respuesta.ok) {
      throw new Error(datos.error || 'Error HTTP');
    }

    return datos;
  }

  async function cargar() {
    try {
      const datos = await solicitar('/api/clientes');
      setClientes(datos);
      setEstado(`GET correcto: ${datos.length} clientes`);
    } catch (error) {
      setEstado(error.message);
    }
  }

  async function crear(evento) {
    evento.preventDefault();

    try {
      await solicitar('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, correo })
      });

      setNombre('');
      setCorreo('');
      await cargar();
    } catch (error) {
      setEstado(error.message);
    }
  }

  async function editar(cliente) {
    const nuevoNombre = window.prompt(
      'Nuevo nombre:',
      cliente.nombre
    );

    if (nuevoNombre === null) return;

    const nuevoCorreo = window.prompt(
      'Nuevo correo:',
      cliente.correo
    );

    if (nuevoCorreo === null) return;

    try {
      await solicitar(`/api/clientes/${cliente.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: nuevoNombre,
          correo: nuevoCorreo
        })
      });

      await cargar();
    } catch (error) {
      setEstado(error.message);
    }
  }

  async function borrar(id) {
    if (!window.confirm('¿Eliminar este cliente?')) return;

    try {
      await solicitar(`/api/clientes/${id}`, {
        method: 'DELETE'
      });

      await cargar();
    } catch (error) {
      setEstado(error.message);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <main className="contenedor">
      <h1>Clientes HTTP</h1>

      <p className="subtitulo">
        React + Node.js + CSV
      </p>

      <section className="panel">
        <h2>Crear cliente</h2>

        <form onSubmit={crear}>
          <input
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            placeholder="Nombre"
            required
          />

          <input
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            placeholder="Correo"
            type="email"
            required
          />

          <button type="submit">
            POST crear
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="fila-titulo">
          <h2>Clientes</h2>

          <button type="button" onClick={cargar}>
            GET recargar
          </button>
        </div>

        {clientes.map((cliente) => (
          <article className="cliente" key={cliente.id}>
            <div>
              <strong>{cliente.nombre}</strong>
              <span>{cliente.correo}</span>
            </div>

            <div>
              <button
                type="button"
                onClick={() => editar(cliente)}
              >
                PUT editar
              </button>

              <button
                type="button"
                onClick={() => borrar(cliente.id)}
              >
                DELETE borrar
              </button>
            </div>
          </article>
        ))}
      </section>

      <pre className="estado">{estado}</pre>

      <p>
        Abre F12 → Network y observa GET, OPTIONS, POST, PUT y DELETE.
      </p>
    </main>
  );
}