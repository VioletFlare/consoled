/*

    on Windows, sometimes throws:
        listen EACCES: permission denied 0.0.0.0:1337

    As Admin, run:
        # net stop winnat
        # net start winnat

*/

const globalCache = require("./Common/GlobalCache.js");
const WebSocketServer = require("ws").WebSocketServer;
const config = require("../config.js");

const Session = require('./Session.js');
const SessionManager = require('./SessionManager');
const Controller = require('./Controllers/Controller');

class InstanceManager {

    constructor() {
        this.sessionManager = new SessionManager();
    }

    _setEvents() {
        this.wss.on("connection", (ws) => {
            const session = new Session(this.wss, ws, globalCache);
            session.init();
            this.sessionManager.add(session);
            new Controller(session).init();
        });
    }

    _setup() {
        this.wss = new WebSocketServer({
            port: config.CONSOLE_SERVICE_CONFIG.port,
            perMessageDeflate: {
                zlibDeflateOptions: {
                    // See zlib defaults.
                    chunkSize: 1024,
                    memLevel: 7,
                    level: 3,
                },
                zlibInflateOptions: {
                    chunkSize: 10 * 1024,
                },
                // Other options settable:
                clientNoContextTakeover: true, // Defaults to negotiated value.
                serverNoContextTakeover: true, // Defaults to negotiated value.
                serverMaxWindowBits: 10, // Defaults to negotiated value.
                // Below options specified as default values.
                concurrencyLimit: 10, // Limits zlib concurrency for perf.
                threshold: 1024, // Size (in bytes) below which messages
                // should not be compressed if context takeover is disabled.
            },
        });
    }

    init() {
        this._setup();
        this._setEvents();
    }
}

module.exports = InstanceManager;
