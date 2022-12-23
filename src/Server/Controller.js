

class Controller {

    constructor(cache) {
        this.cache = cache;
        
    }

    callRoute(route, data) {
        let response = {};
        let baseResponse;

        switch(route) {
            case "/auth":
                baseResponse = { authenticated: "true" };
            break;
        }

        response.data = baseResponse;
        response.calledRoute = route;
        
        return response;
    }

}

module.exports = Controller;