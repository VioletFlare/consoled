const Heartbeater = require("./Heartbeater.js");

const Controller = require("./Controller.js");
const ResponseHandler = require("./ResponseHandler.js");
const Requester = require("./Requester.js");
const SessionCache = require('./SessionCache.js');

class Instance {

    constructor(wss, ws, cache) {
        this.wss = wss;
        this.ws = ws;
        this.cache = cache;
        this.sessionCache = new SessionCache();
        this.controller = new Controller(this.cache);
        this.responseHandler = new ResponseHandler(this.cache);
        this.requester = new Requester(this.cache);
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

    init() {
        new Heartbeater(this.wss, this.ws).init();

        this._listenForRequests();

        this._sendRequest('/guilds').then(response => console.log(response));
        this._sendRequest('/guilds').then(response => console.log(response));
        this._sendRequest('/guilds').then(response => console.log(response));
    }

}

module.exports = Instance;