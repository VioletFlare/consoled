class Controller {

    constructor(instance) {
        this.instance = instance;
    }

    init() {
        this.instance.on('/ping', () => {
            return {
                response: "pong"
            };
        });
    }

}

module.exports = Controller;