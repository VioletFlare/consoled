class Controller {

    constructor(instance) {
        this.instance = instance;
    }

    init() {
        this.instance.on('/guilds', () => {
            return this.instance.get('/guilds').then(response => {
                return response.data;
            });
        });
    }

}

module.exports = Controller;