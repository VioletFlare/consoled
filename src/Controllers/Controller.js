class Controller {

    constructor(sessionManager, session) {
        this.sessionManager = sessionManager;
        this.session = session;
    }

    init() {
        this.session.on('/ping', () => {
            return {
                response: "pong"
            };
        });

        this.session.on('/guilds-list', (request) => {
            const session = this.sessionManager.get(request.data.connectTo);

            const response = new Promise(resolve => {
                session.get("/guilds").then(response => {
                    resolve(response.data);
                });
            });

            return response;
        });
    }

}

module.exports = Controller;