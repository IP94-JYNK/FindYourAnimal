'use strict';

const { http, path } = require('./dependencies.js');
const application = require('./application.js');
const HOME_PAGE = '\\views\\home.html';

const MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  json: 'application/json; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};

const styleSrcForContentSecurityPolicy = [
  'https://fonts.googleapis.com',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css',
  'https://use.fontawesome.com/releases/v5.15.3/css/svg-with-js.css',
  'https://cdnjs.cloudflare.com',
];

const fontSrcForContentSecurityPolicy = [
  'https://fonts.gstatic.com',
  'https://cdnjs.cloudflare.com',
];

const scriptSrcForContentSecurityPolicy = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js',
  'https://use.fontawesome.com/releases/v5.15.3/js/all.js',
];

const HEADERS = {
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
  'Access-Control-Allow-Origin': '*',
  'Content-Security-Policy': [
    `default-src 'self' ws:`,
    `style-src 'self' ${styleSrcForContentSecurityPolicy.join(' ')}`,
    `font-src 'self' ${fontSrcForContentSecurityPolicy.join(' ')}`,
    `script-src 'self' ${scriptSrcForContentSecurityPolicy.join(' ')}`,
  ].join('; '),
};

const urlFormatter = url => {
  if (!path.extname(url)) url = '/views' + url + '.html';
  return url.replace(/\//g, '\\');
};

class Client {
  constructor(req, res, connection) {
    this.req = req;
    this.res = res;
    this.ip = req.socket.remoteAddress;
    this.connection = connection;
  }

  async static() {
    const {
      req: { url, method },
      res,
      ip,
    } = this;
    if (
      !url.includes('/login') &&
      !url.includes('/register') &&
      !url.includes('general') &&
      url !== '/favicon.ico'
    ) {
      const session = await application.auth.restore(this);
      if (!session) return this.redirect('/login');
    }
    if (url === '/destroy') {
      const session = await application.auth.restore(this);
      await application.auth.remove(this, session.token);
      return this.redirect('/login');
    }
    const filePath = url === '/' ? HOME_PAGE : urlFormatter(url);
    const fileExt = path.extname(filePath).substring(1);
    const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
    res.writeHead(200, { ...HEADERS, 'Content-Type': mimeType });
    if (res.writableEnded) return;
    const data = application.static.get(filePath);
    if (data) {
      res.end(data);
      application.logger.log(`${ip}\t${method}\t${url}`);
      return;
    }
    this.error(404);
  }

  redirect(location) {
    const { res } = this;
    if (res.headersSent) return;
    res.writeHead(302, { Location: location });
    res.end();
  }

  error(code, err, callId = err) {
    const {
      req: { url, method },
      res,
      connection,
      ip,
    } = this;
    const status = http.STATUS_CODES[code];
    if (typeof err === 'number') err = undefined;
    const reason = err ? err.stack : status;
    application.logger.error(`${ip}\t${method}\t${url}\t${code}\t${reason}`);
    if (connection) {
      const packet = { callback: callId, error: { code, message: status } };
      connection.send(JSON.stringify(packet));
      return;
    }
    if (res.writableEnded) return;
    res.writeHead(code, { 'Content-Type': MIME_TYPES.json });
    const packet = { code, error: status };
    res.end(JSON.stringify(packet));
  }

  message(data) {
    let packet;
    try {
      packet = JSON.parse(data);
    } catch (err) {
      this.error(500, new Error('JSON parsing error'));
      return;
    }
    const [callType, methodName] = Object.keys(packet);
    const callId = packet[callType];
    const args = packet[methodName];

    if (callId && args) {
      this.rpc(callId, methodName, args);
      return;
    }
    this.error(500, new Error('Packet structure error'));
  }

  async rpc(callId, method, args) {
    const { res, connection, ip } = this;
    const { semaphore } = application.server;
    try {
      await semaphore.enter();
    } catch {
      this.error(504, callId);
      return;
    }
    try {
      let session = await application.auth.restore(this);
      const proc = application.runMethod(method, session);
      if (!proc) {
        this.error(404, callId);
        return;
      }
      if (!session && proc.access !== 'public') {
        this.error(403, callId);
        return;
      }
      const result = await proc.method(args);
      if (!session && result && result.userId && proc.access === 'public') {
        session = application.auth.start(this, result.userId);
        result.token = session.token;
      }
      if (result && result.result === 'delete')
        return await application.auth.remove(this, session.token);
      const packet = { callback: callId, result };
      const data = JSON.stringify(packet);
      if (connection) connection.send(data);
      else res.end(data);
      const token = session ? session.token : 'anonymous';
      application.logger.log(`${ip}\t${token}\t${method}`);
    } catch (err) {
      this.error(500, err, callId);
    } finally {
      semaphore.leave();
    }
  }
}

module.exports = Client;
