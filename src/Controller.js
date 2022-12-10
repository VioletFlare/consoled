class Controller {

    callRoute(route, data) {
        let response = {};

        switch(route) {

        }

        response.calledRoute = route;

        const responseString = JSON.stringify(response);
        
        return responseString;
    }

}

module.exports = Controller;