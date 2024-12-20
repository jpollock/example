//import { startServer } from '../../../dist/packages/wp-now/index.js';
import { startServer } from '@elasticapi/wp-now';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs-extra';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runWpNow() {
    console.log('runWpNow');
    // Create paths relative to this example file
    const projectPath = join(__dirname, 'wp-test');
    const absoluteUrl = 'http://0.0.0.0:8080';  // Changed to 127.0.0.1
    //const siteUrl = 'http://localhost:8881';
    const documentRoot = '/var/www/html';

    // Ensure project directory exists
    fs.ensureDirSync(projectPath);

    try {
        const server = await startServer({
            projectPath,
            wpContentPath: join(projectPath, 'wp-content'),
            absoluteUrl,
            //siteUrl,
            phpVersion: '8.2',
            wordPressVersion: 'latest',
            mode: 'playground',
            port: 8080,
            reset: true,
            documentRoot,
            numberOfPhpInstances: 1,
        });

        console.log(`WordPress is running at: ${server.url}`);

        // Keep the server running until interrupted
        process.on('SIGINT', async () => {
            console.log('\nShutting down server...');
            await server.stopServer();
            process.exit();
        });

        // Keep the process running indefinitely until SIGINT
        await new Promise(() => {
            /* This empty function is intentional to keep the process alive */
        });
    } catch (error) {
        console.error('Failed to start WordPress server:', error);
        process.exit(1);
    }
}

runWpNow();
