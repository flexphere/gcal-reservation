import { google } from 'googleapis';
import * as moment from 'moment';
import { config } from '../config'

export class GoogleUtil {
    auth;

    constructor(){
        this.auth = new google.auth.OAuth2(
            config.google.clientId,
            config.google.secret,
            config.google.redirect
        );
    }

    setRefreshToken(token: string){
        this.auth.setCredentials({
            refresh_token: token
        });
        this.auth.on('tokens', (tokens) => {
            this.auth.setCredentials(tokens);
        });
    }

    createAuthURL() {
        return this.auth.generateAuthUrl({
            access_type: config.google.access_type,
            prompt: config.google.prompt,
            scope: config.google.scopes
        });
    }

    async authByCode(code: string) {
        const data = await this.auth.getToken(code)
        this.auth.setCredentials(data.tokens);
        const user = await this.getUser();
        return {
            id: user.id,
            refresh_token: data.tokens.refresh_token
        };
    }

    async getUser() {
        const res = await google.people({version:'v1', auth: this.auth}).people.get({
            resourceName: 'people/me',
            personFields: 'emailAddresses'
        });

        return {
            id: res.data.emailAddresses[0].metadata.source.id,
            email: res.data.emailAddresses[0].value
        }
    }

    async getCalendars(userid: string) {
        const res = await google.calendar({ version: 'v3', auth: this.auth }).calendarList.list();
        return res.data.items.filter(item => item.accessRole == 'owner')
    }

    async getEvents(calid: string, from: string, to: string) {
        const params = {
            calendarId: calid,
            timeMin: from,
            timeMax: to,
            singleEvents: true,
            orderBy: 'startTime'
        };
        
        const res = await google.calendar({ version: 'v3', auth: this.auth }).events.list(params);
        return res.data.items;
    }
}
