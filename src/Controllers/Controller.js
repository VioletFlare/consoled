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
    }

}

module.exports = Controller;