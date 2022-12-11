class Heartbeater {

    constructor(wss, ws) {
        this.wss = wss;
        this.ws = ws;
    }

    _setIsAlive() {
        this.isAlive = true;
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

    _setup() {
        const interval = setInterval(() => this._ping(), 30000);

        this.wss.on("close", () => {
            clearInterval(interval);
        });

        this.ws.isAlive = true;
        this.ws.on("pong", this._setIsAlive);
    }

    init() {
        this._setup();
    }
}

module.exports = Heartbeater;