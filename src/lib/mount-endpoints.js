const { ENDPOINTS_DIR } = require('./config.js');
const fs = require('fs');
const path = require('path');

/**
 * @typedef {Object} EndpointObject
 * @property {string} method
 * @property {string} path
 * @property {(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void} handler
 */

/** 
 * @param {import("express").Application} app 
 */
module.exports = function mountEndpoints(app) {
    let files = getEndpointFiles();
    for (const file of files) {
        mountOneEndpoint(app, file);
    }

    function getEndpointFiles() {
        return fs.readdirSync(ENDPOINTS_DIR);
    }

    /**
     * @param {import("express").Application} app
     * @param {string} file
     */
    function mountOneEndpoint(app, file) {
        const e = loadEndpoint(file);
        const h = wrapHandlerToCallNextOnException(e.handler);
        mountHandlerForEndpoint(app, h, e);

        /**
         * @param {string} file
         */
        function loadEndpoint(file) {
            const p = getFullPathToEndpoint(file);
            return require(p);

            /**
             * @param {string} file
             */
            function getFullPathToEndpoint(file) {
                return path.join(ENDPOINTS_DIR, file);
            }
        }

        /**
         * @param {(req: import("express").Request, res: import("express").Response, next: any) => void} handler
         * @returns {(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void}
         */
        function wrapHandlerToCallNextOnException(handler) {
            return async function (req, res, next) {
                try {
                    await handler(req, res, next);
                } catch (e) {
                    next(e);
                }
            };
        }


        /**
         * @param {import("express").Application} app
         * @param {(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void} handler
         * @param {{ method: any; path: any; }} endpoint
         */
        function mountHandlerForEndpoint(app, handler, endpoint) {
            const m = endpoint.method;
            const p = endpoint.path;
            //@ts-ignore
            app[m](p, handler);
        }
    }
};