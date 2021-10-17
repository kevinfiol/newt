import serve from 'create-serve';
import { bundle, logSuccess, logError } from './bundle.js';

(async () => {
    try {
        serve.start({
            port: 5000,
            root: 'dist',
            live: true
        });

        await bundle({
            minify: false, sourcemap: true,
            watch: {
                onRebuild(error) {
                    if (error) logError(error);
                    else logSuccess();
                    serve.update();
                }
            }
        });

        logSuccess();
    } catch(error) {
        logError(error);
    }
})();