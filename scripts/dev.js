import serve from 'create-serve';
import { bundle, logSuccess, logError } from './bundle.js';

serve.start({
    port: 5000,
    root: 'dist',
    live: true
});

bundle({
    minify: false,
    sourcemap: true,
    watch: {
        onRebuild(error) {
            if (error) logError(error);
            else logSuccess();
            serve.update();
        }
    }
}).then(logSuccess).catch(e => {
    logError(e);
    process.exit(1);
});
