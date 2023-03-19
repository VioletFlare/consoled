class RouteManager {

    constructor() {
        this.routes = {};
    }

    registerAction(route, action) {
        this.routes[route] = action;
    }

    _getRouteData(route, data) {
        let response;

        if (this.routes[route]) {
            response = {
                data: this.routes[route].call(),
             };
        } else {
            response = {};
        }

        return response;
    }

    callRoute(route, data) {
        let response = {};

        response = this._getRouteData(route, data);
        
        return response;
    }

}

module.exports = RouteManager;