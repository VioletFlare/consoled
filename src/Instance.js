/*

    on Windows, sometimes throws:
        listen EACCES: permission denied 0.0.0.0:1337

    As Admin, run:
        # net stop winnat
        # net start winnat

*/

const WebSocketServer = require("ws").WebSocketServer;
const config = require("../config.js");
const Controller = require("./Controller.js");

class Instance {
    _setIsAlive() {
        this.isAlive = true;
        this.controller = new Controller();
    }

    _ping() {
        this.wss.clients.forEach((ws) => {
            if (ws.isAlive === false) {
                return ws.terminate();
            }

            ws.isAlive = false;
            ws.ping();
        });
    }

    _startHeartbeating(ws) {
        const interval = setInterval(() => this._ping(), 30000);

        this.wss.on("close", () => {
            clearInterval(interval);
        });

        ws.isAlive = true;
        ws.on("pong", this._setIsAlive);
    }

    _setMessageEventHandler() {
        ws.on("message", (data) => {
            const jsonString = data.toString("utf8");
            const object = JSON.parse(jsonString);

            const isEmpty = Object.keys(object).length === 0;

            if (!isEmpty) {
                const isRequest = object.route;

                if (isRequest) {
                    const route = object.route;
                    const data = object.data;
                    const response = this.controller.callRoute(route, data);
                    this.ws.send(response);
                }
            }
        });
    }

    _setEvents() {
        this.wss.on("connection", (ws) => {
            this._setMessageEventHandler();

            ws.send(
                JSON.stringify({
                    route: "/guilds",
                })
            );

            this._startHeartbeating(ws);
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

module.exports = Instance;
