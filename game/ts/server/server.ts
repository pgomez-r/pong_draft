
import fastify from 'fastify';
import { setupGameRoutes } from './api';

const currentPort = 5050;
const server = fastify({ logger: true });
setupGameRoutes(server);

const start = async () => {
	try
	{
		await server.listen({ port: currentPort });
		console.log('Server listening on port ' + currentPort);
	}
	catch (err)
	{
		server.log.error(err);
		process.exit(1);
	}
};

start();
