class ResponseHandler {

    constructor(cache) {
        this.cache = cache;
    }

    handle(route, data) {
        console.log(data);

        switch (route) {
            case "/guilds":
                this.cache.guildsPerBot.push({
                    
                })
        }
    }

}

module.exports = ResponseHandler;