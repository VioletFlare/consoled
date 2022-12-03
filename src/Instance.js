const WebSocketServer = require('ws').WebSocketServer;
const config = require("../config.js");

class Instance {

    _setIsAlive() {
      this.isAlive = true;
    }

    _ping() {
        this.wss.clients.forEach((ws) => {

          if (ws.isAlive === false) {
            return ws.terminate();
          }

          console.log("ping");

          ws.isAlive = false;
          ws.ping();
        });
    }

    _setHeartbeat() {
      const interval = setInterval(() => this._ping(), 30000);
        
      this.wss.on('close', () => {
        clearInterval(interval);
      });

      ws.isAlive = true;
      ws.on('pong', this._setIsAlive);
    }

    _setEvents() {
      this.wss.on('connection', (ws) => {
        ws.on('message', (data) => {
          const message = data.toString('utf8');

          
        });

        this._setHeartbeat();

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
            level: 3
          },
          zlibInflateOptions: {
            chunkSize: 10 * 1024
          },
          // Other options settable:
          clientNoContextTakeover: true, // Defaults to negotiated value.
          serverNoContextTakeover: true, // Defaults to negotiated value.
          serverMaxWindowBits: 10, // Defaults to negotiated value.
          // Below options specified as default values.
          concurrencyLimit: 10, // Limits zlib concurrency for perf.
          threshold: 1024 // Size (in bytes) below which messages
          // should not be compressed if context takeover is disabled.
        }
    });
    }

    init() {
      this._setup();
      this._setEvents();
    }
}

module.exports = Instance;