const Heartbeater = require("./Heartbeater.js");

const SessionCache = require('./Common/SessionCache.js');
const Server = require("./Server/Server.js");
const Client = require("./Client/Client.js");

class Instance {

    constructor(wss, ws, cache) {
        this.wss = wss;
        this.ws = ws;
        this.cache = cache;
        this.sessionCache = new SessionCache();
        this.server = new Server(this.ws);
        this.heartbeater = new Heartbeater(this.wss, this.ws);
        this.client = new Client(this.ws);
    }

    init() {
        this.heartbeater.init();
        this.server.init();

        this.client.sendRequest('/guilds').then(response => console.log(response));
        this.client.sendRequest('/guilds').then(response => console.log(response));
        this.client.sendRequest('/guilds').then(response => console.log(response));
    }

}

module.exports = Instance;