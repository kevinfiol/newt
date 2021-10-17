import { bundle, logSuccess, logError } from './bundle.js';

(async () => {
    try {
        await bundle({ minify: true });
        logSuccess();
    } catch(error) {
        logError(error);
    }
})();