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

        this.session.on('/guilds', (request) => {
            const session = this.sessionManager.get(request.data.source);

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