import * as fastify from 'fastify';
import * as http from 'http';
import * as moment from 'moment';
import { GoogleUtil } from '../lib/google-util';
import User from '../model/user';
import { Schedule } from '../lib/schedule';

export const getCalendars = async(req: fastify.FastifyRequest<http.IncomingMessage>, res: fastify.FastifyReply<http.ServerResponse>) => {
    try {
        const userid = res.unsignCookie(req.cookies.grauth);
        if (! userid) {
            return res.code(401).send();
        }
        const user = await User.find(userid);
        if (! user) {
            return res.code(500).send();
        }

        const gu = new GoogleUtil();
        gu.setRefreshToken(user.token);

        const cals = await gu.getCalendars(userid);
        res.code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(cals);
    } catch (e) {
        console.log(e)
        res.code(500).send();
    }
};

export const getEvents = async(req: fastify.FastifyRequest<http.IncomingMessage>, res: fastify.FastifyReply<http.ServerResponse>) => {
    try {
        const userid = res.unsignCookie(req.cookies.grauth);
        if (! userid) {
            return res.code(401).send();
        }
        const user = await User.find(userid);
        if (! user) {
            return res.code(500).send();
        }
        const calid = req.body.cal_id;
        if (! calid) {
            return res.code(400).send();
        }
        
        const gu = new GoogleUtil();
        gu.setRefreshToken(user.token);

        const from = moment().hours(0).minutes(0).utcOffset('+09:00').format();
        const to = moment(from).add(7, 'days').add(-1, 'minutes').utcOffset('+09:00').format();

        const schedule = new Schedule(from, to);
        const events = await gu.getEvents(calid, from , to);
        console.log(events);
        events.map(event => {
            schedule.disableTimeRange(event.start.dateTime, event.end.dateTime);
        });
        var data = schedule.getTimelines()
        console.log(data[0])

        res.code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(data);
    } catch (e) {
        console.log(e)
        res.code(500).send();
    }
};


export const createEvent = async(req: fastify.FastifyRequest<http.IncomingMessage>, res: fastify.FastifyReply<http.ServerResponse>) => {
    try {
        const userid = res.unsignCookie(req.cookies.grauth);
        if (! userid) {
            return res.code(401).send();
        }
        const user = await User.find(userid);
        if (! user) {
            return res.code(500).send();
        }
        const title = req.body.title;
        if (! title) {
            return res.code(400).send();
        }
        const calid = req.body.calid;
        if (! calid) {
            return res.code(400).send();
        }

        const gu = new GoogleUtil();
        gu.setRefreshToken(user.token);

        const cals = await gu.getCalendars(userid);
        res.code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(cals);
    } catch (e) {
        console.log(e)
        res.code(500).send();
    }
}