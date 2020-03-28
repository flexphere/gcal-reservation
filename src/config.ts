export const config = {
    app: {
        port: process.env.APP_PORT,
        secret: process.env.APP_SECRET
    },
    cookie: {
        path: '/',
        signed: true,
        httpOnly: true
    },
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_USER,
        database: process.env.DB_NAME
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect: process.env.GOOGLE_REDIRECT_URL,
        access_type: 'offline',
        prompt: 'consent',
        scopes: [
            'profile',
            'https://www.googleapis.com/auth/profile.emails.read',
            'https://www.googleapis.com/auth/calendar'
        ]
    }
};