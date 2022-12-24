

class Controller {

    constructor(client, cache) {
        this.client = client;
        this.cache = cache;
    }

    _getGuilds() {
        return this.client.sendRequest('/guilds')
                .then(
                    response => response
                );
    }

    _getEmptyResponse() {
        return new Promise(
            (resolve) => resolve({})
        );
    }

    _getResponseFromRoute(route, data) {
        let response;

        switch(route) {
            case "/guilds":
                response = this._getGuilds();
            break;
            default:
                response = this._getEmptyResponse();
            break;
        }
        
        return response;
    }

    callRoute(route, data) {
        const response = this._getResponseFromRoute(route, data);
        
        return response;
    }

}

module.exports = Controller;