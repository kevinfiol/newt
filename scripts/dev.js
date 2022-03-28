import servbot from 'servbot';
import { bundle, logSuccess, logError } from './bundle.js';

const PORT = 8080;

// Start dev server
const server = servbot({
  root: 'dist',
  reload: true,
  fallback: 'index.html',
  ignores: [
    // don't pass app.js to the SPA
    /\/app.js/i,
    // don't pass assets at root level to SPA
    /^\/([^/]+?)\.(css|png|ico)\/?$/i
  ]
});

server.listen(PORT);

bundle({
    minify: false,
    sourcemap: true,
    watch: {
        onRebuild(error) {
            if (error) logError(error);
            else {
                logSuccess();
                server.reload();
            }
        }
    }
}).then(logSuccess).catch(e => {
    logError(e);
    process.exit(1);
});
