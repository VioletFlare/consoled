/*

    on Windows, sometimes throws:
        listen EACCES: permission denied 0.0.0.0:1337

    As Admin, run:
        # net stop winnat
        # net start winnat

*/

const Cache = require("./Cache.js");
const WebSocketServer = require("ws").WebSocketServer;
const config = require("../config.js");

const Heartbeater = require("./Heartbeater.js");

const Controller = require("./Controller.js");
const ResponseHandler = require("./ResponseHandler.js");
const Requester = require("./Requester.js");

class Instance {

    constructor() {
        this.controller = new Controller(Cache);
        this.responseHandler = new ResponseHandler(Cache);
        this.requester = new Requester(Cache);
    }

    _listenForRequests() {
        this.ws.on("message", (data) => {
            const jsonString = data.toString("utf8");
            const json = JSON.parse(jsonString);

            const isEmpty = Object.keys(json).length === 0;

            if (!isEmpty) {
                const isRequest = json.route;

                if (isRequest) {
                    const route = json.route;
                    const data = json.data;
                    const response = this.controller.callRoute(route, data);
                    this.ws.send(response);
                }
            }
        });
    }

    _sendRequest(route, data = {}) {
        const response = new Promise((resolve, reject) => {
            const _handler = (data) => {
                const jsonString = data.toString("utf8");
                const response = JSON.parse(jsonString);
    
                const isEmpty = Object.keys(response).length === 0;
    
                if (!isEmpty) {
                    const isResponse = response.calledRoute && route === response.calledRoute;
    
                    if (isResponse) {
                        this.ws.removeEventListener("message", _handler);

                        resolve(response);
                    }
                }
            };

            this.ws.on("message", _handler);

            const request = this.requester.createRequest(route, data);

            this.ws.send(JSON.stringify(
                request
            ));
        });

        return response;
    }

    _setEvents() {
        this.wss.on("connection", (ws) => {
            this.ws = ws;

            new Heartbeater(this.wss, this.ws).init();

            this._listenForRequests();

            this._sendRequest('/guilds').then(response => console.log(response));
            this._sendRequest('/guilds').then(response => console.log(response));
            this._sendRequest('/guilds').then(response => console.log(response));
            
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
