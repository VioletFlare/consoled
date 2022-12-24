

class Controller {

    constructor(cache) {
        this.cache = cache;
        
    }


    _getRouteData(route, data) {
        let response;

        switch(route) {

        }

        return response;
    }

    callRoute(route, data) {
        let response = {};

        response.data = this._getRouteData(route, data);
        
        return response;
    }

}

module.exports = Controller;