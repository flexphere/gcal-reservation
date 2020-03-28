import * as fastify from 'fastify';
import * as fastifyStatic from 'fastify-static';
import * as fastifyCookie from 'fastify-cookie';
import * as path from 'path';
import { config } from './config';

import * as authController from './controller/auth';
import * as calendarController from './controller/calendar';

const server = fastify();

server.register(fastifyStatic, {
    root: path.join(__dirname, 'view'),
    prefix: '/',
});

server.register(fastifyCookie, {
    secret: config.app.secret,
    parseOptions: {}
});

server.get('/login', authController.googleAuthRedirect);
server.get('/login/callback', authController.googleAuthCallback);
server.post('/api/calendars', calendarController.getCalendars);
server.post('/api/events', calendarController.getEvents);

server.listen(config.app.port, err => {
  if (err) throw err
  console.log(`server listening on ${config.app.port}`)
});