const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Configuración de respuesta
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Permitir peticiones OPTIONS
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Ruta principal
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200);
        res.end(JSON.stringify({
            estado: 'activo',
            mensaje: 'Servidor activo'
        }));
        return;
    }

    // Endpoint para hacer preguntas
    if (req.method === 'POST' && req.url === '/preguntar') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
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

                // Aquí puedes colocar la lógica de respuesta
                let respuesta;

                if (pregunta.toLowerCase().includes('hola')) {
                    respuesta = '¡Hola! ¿Cómo estás?';
                } else if (pregunta.toLowerCase().includes('nombre')) {
                    respuesta = 'Soy tu servidor Node.js.';
                } else if (pregunta.toLowerCase().includes('estado')) {
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
                res.writeHead(400);
                res.end(JSON.stringify({
                    error: 'El JSON enviado no es válido'
                }));
            }
        });

        return;
    }

    // Ruta inexistente
    res.writeHead(404);
    res.end(JSON.stringify({
        error: 'Ruta no encontrada'
    }));
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ejecutándose en http://0.0.0.0:${PORT}`);
});
