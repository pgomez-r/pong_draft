import fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { setupGameRoutes } from './api.js';

const currentPort = 5050;
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

// Setup routes
setupGameRoutes(server);

// Add CORS if needed (common during development)
server.register(require('@fastify/cors'), {
    origin: true, // Allows all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
});

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
