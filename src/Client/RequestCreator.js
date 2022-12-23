const AuxConfig = require('../AuxConfig.js');

class RequestCreator {

    constructor(cache) {
        this.cache = cache;
    }

    createRequest(route, data = {}) {
        const request = {
            route: route,
            data: {
                userAgent: AuxConfig.USER_AGENT,
                ...data
            }
        }

        return request;
    }

}

module.exports = RequestCreator;