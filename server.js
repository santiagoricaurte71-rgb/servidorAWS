const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {

    // Cabeceras
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Peticiones OPTIONS
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // GET /
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200);
        res.end(JSON.stringify({
            estado: 'activo',
            mensaje: 'Servidor activo'
        }));
        return;
    }

    // POST /preguntar
    if (req.method === 'POST' && req.url === '/preguntar') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {

            console.log('Datos recibidos:', body);

            try {

                const data = JSON.parse(body);

                const pregunta = data.pregunta;

                if (!pregunta) {
                    res.writeHead(400);
                    res.end(JSON.stringify({
                        error: 'Debes enviar una pregunta'
                    }));
                    return;
                }

                let respuesta;

                if (pregunta.toLowerCase().includes('hola')) {
                    respuesta = '¡Hola! ¿Cómo estás?';

                } else if (pregunta.toLowerCase().includes('nombre')) {
                    respuesta = 'Soy tu servidor Node.js.';

                } else if (
                    pregunta.toLowerCase().includes('estado') ||
                    pregunta.toLowerCase().includes('servidor')
                ) {
                    respuesta = 'El servidor está funcionando correctamente.';

                } else {
                    respuesta = `Recibí tu pregunta: "${pregunta}"`;
                }

                res.writeHead(200);

                res.end(JSON.stringify({
                    pregunta: pregunta,
                    respuesta: respuesta
                }));

            } catch (error) {

                console.error('Error procesando JSON:', error);

                res.writeHead(400);

                res.end(JSON.stringify({
                    error: 'El JSON enviado no es válido',
                    recibido: body
                }));
            }
        });

        return;
    }

    // Ruta no encontrada
    res.writeHead(404);

    res.end(JSON.stringify({
        error: 'Ruta no encontrada'
    }));
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
