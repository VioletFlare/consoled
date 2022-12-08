class Controller {

    constructor(config) {
        this.config = config;
    }

    callRoute(route, data) {
        let response = "{}";

        switch(route) {
            case "/guilds":
                response = this._getGuilds();
            break;
        }

        return response;
    }

}