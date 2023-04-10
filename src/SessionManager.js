class SessionManager {
  constructor() {
    this.sessions = {
      default: {
        get: () => {
          return new Promise((resolve) => resolve({}));
        },
        on: () => {},
        init: () => {},
      },
    };
  }

  add(session) {
    session.get("/useragent").then((response) => {
      this.sessions[response.userAgent] = session;
    });
  }

  get(userAgent) {
    let session;

    if (this.sessions[userAgent]) {
      session = this.sessions[userAgent];
    } else {
      session = this.sessions["default"];
    }

    return session;
  }
}

module.exports = SessionManager;
