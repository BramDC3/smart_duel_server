import http from 'http';
import config from 'config';

const SERVER_PORT = config.get<number>('SERVER_PORT');
const SERVER_HOSTNAME = config.get<string>('SERVER_HOSTNAME');

import createSocket from './socket';

(async (): Promise<void> => {
    try {
        const server = http.createServer();
        const socket = createSocket(server);

        const shutdown = () => {
            socket.close(() => {
                console.log('Closed all connections');
            });

            server.close(() => {
                process.exit();
            });
        };

        server.listen(SERVER_PORT, SERVER_HOSTNAME, () => {
            console.log(`Server listening on port ${SERVER_PORT}...`);
        });

        // SIGINT signal (CTRL-C)
        process.on('SIGINT', () => {
            console.warn('Received SIGINT signal');
            shutdown();
        });

        // SIGTERM signal (Docker stop)
        process.on('SIGTERM', () => {
            console.warn('Received SIGTERM signal');
            shutdown();
        });

        process.on('uncaughtException', (error) => {
            console.error('Uncaught exception: ', error);
            shutdown();
        });

        process.on('unhandledRejection', (reason, promise) => {
            console.error('Unhandled rejection: ', JSON.stringify(reason), promise);
            shutdown();
        });
    } catch (error) {
        console.error(`Error while starting up server: ${error}`);
        console.dir(error);
        process.exit(1);
    }
})();