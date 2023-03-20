const Heartbeater = require("./Heartbeater.js");

const SessionCache = require('./Common/SessionCache.js');
const Client = require('./Client/Client');
const Server = require('./Server/Server');

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

    on(route, action) {
        this.server.registerAction(route, action);
    }

    get(route, data) {
        return this.client.sendRequest(route, data);
    }
    
    init() {
        this.server.init();
        this.heartbeater.init();
    }

}

module.exports = Instance;