class SessionManager {
    constructor() {
        this.sessions = {};
    }

    add(session) {
        session.get('/useragent').then(response => {
            this.sessions[response.userAgent] = session;
        });
    }

    get(userAgent) {
        return this.sessions[userAgent];
    }
}

module.exports = SessionManager;