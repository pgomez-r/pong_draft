import fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import fastifyCors from '@fastify/cors';
import { setupGameRoutes } from './api.js';

const currentPort = 5051;
const server = fastify({ 
    logger: true,
    forceCloseConnections: true,
});

// Register WebSocket support
server.register(fastifyWebsocket, {
    options: {
        maxPayload: 1048576, // 1 MB
        clientTracking: true
    }
});

// Add CORS if needed (common during development)
server.register(fastifyCors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Sec-WebSocket-Protocol', 'Sec-WebSocket-Version', 'Sec-WebSocket-Extensions', 'Sec-WebSocket-Key']
});

// Root route
server.get('/', async (request, reply) => {
    return { message: 'Pong game server is running' };
});

// Setup routes
setupGameRoutes(server);

const start = async () => {
    try {
        await server.listen({
            port: currentPort,
            host: '0.0.0.0'
        });
        console.log(`Server listening on port ${currentPort}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
