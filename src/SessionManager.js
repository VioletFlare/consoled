class SessionManager {
    constructor() {
        this.sessions = {};
    }

    add(session) {
        session.get('/useragent').then(response => {
            this.sessions[response.userAgent] = session;
        });
    }
}

module.exports = SessionManager;