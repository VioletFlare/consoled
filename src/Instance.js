const Heartbeater = require("./Heartbeater.js");

const SessionCache = require('./Common/SessionCache.js');
const Server = require("./Server/Server.js");
const Client = require("./Client/Client.js");

class Instance {

    constructor(wss, ws, globalCache) {
        this.wss = wss;
        this.ws = ws;
        this.config = {
            USER_AGENT: "Consoled"
        };
        this.globalCache = globalCache;
        this.sessionCache = new SessionCache();
        this.heartbeater = new Heartbeater(this.wss, this.ws);
        this.client = new Client(this.config, this.ws);
        this.server = new Server(this.config, this.ws);
    }

    init() {
        this.heartbeater.init();
        this.server.init();
    }

}

module.exports = Instance;