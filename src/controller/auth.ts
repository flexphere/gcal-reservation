import * as fastify from 'fastify';
import * as http from 'http';
import { config } from '../config'
import { GoogleUtil } from '../lib/google-util';
import User from '../model/user'


export const googleAuthRedirect = (req: fastify.FastifyRequest<http.IncomingMessage>, res: fastify.FastifyReply<http.ServerResponse>) => {
    const gu = new GoogleUtil();
    const url = gu.createAuthURL();
    res.redirect(302, url);
};

export const googleAuthCallback = async(req: fastify.FastifyRequest<http.IncomingMessage>, res: fastify.FastifyReply<http.ServerResponse>) => {
    if (req.query.code) {
        const gu = new GoogleUtil();
        const auth = await gu.authByCode(req.query.code);
        await User.save(auth.id, auth.refresh_token);
        res.setCookie('grauth', auth.id, config.cookie);
    }
    res.redirect(302, '/settings.html');
};