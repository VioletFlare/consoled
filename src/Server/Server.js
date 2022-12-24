const Controller = require("./Controller.js");
const auxConfig = require('../AuxConfig.js');

class Server {
    constructor(ws) {
        this.ws = ws;
        this.controller = new Controller(this.cache);
        this.userAgent = auxConfig.USER_AGENT;
    }

    _enrichWithOverhead(response) {
        response.data.userAgent = this.userAgent;

        return response;
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

                    let response = this.controller.callRoute(route, data);
                    response = this._enrichWithOverhead(response)
                    response.calledRoute = route;

                    const responseString = JSON.stringify(response);
                    this.ws.send(responseString);
                }
            }
        });
    }

    init() {
        this._listenForRequests();
    }
}

module.exports = Server;