import { UnauthorizedError, NotFoundError } from "restify-errors";
import { Request, Response, Next } from "restify";
import * as restify from 'restify';
import * as jwt from 'jsonwebtoken';
import * as config from './config.json';
import { SmartHomeDatabase } from "./database";
import * as restifyCors from 'restify-cors-middleware';
import { Light } from "./models/light.js";
import { readFileSync } from "fs";
import { User } from "./models/user.js";

const rjwt = require('restify-jwt-community');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

const db = new SmartHomeDatabase();

const privateKey = readFileSync('./certs/converted_jwt.key');
const publicKey = readFileSync('./certs/jwt.key.pub');

const cors = restifyCors.default({
  origins: ['*'],
  allowHeaders: ['Authorization', 'showPassword', 'birthDay'],
  exposeHeaders: ['Authorization']
});

server.pre(cors.preflight)
server.use(cors.actual);
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(rjwt({
  secret: config.jwt.secret
  }).unless({
  path: ['/auth', '/certs/']
}));

server.get('/certs/*', restify.plugins.serveStaticFiles('./certs'
));

server.get('/lights', (req: Request, res: Response, next: Next) => {
  Light.find()
    .then(lights => res.send(lights))
    .catch(err => res.send(err));
  return next();
})

server.get('/user', (req: Request, res: Response, next: Next) => {
  const user = (req as any).user;
  User.findOne({userName: user.userName})
    .then(user => res.send(user))
    .catch(err => res.send(err));
  return next();
})

server.get('/user/:name', (req: Request, res: Response, next: Next) => {
  User.findOne({userName: req.params.name})
    .then(user => {
      if (!user) {
        res.send(new NotFoundError)
      } else {
        const sendUser = {
          name: user && user.userName,
          uid: user && user.uid
        };
        res.send(req.headers.showpassword ? {...sendUser, password: user.password} : sendUser);
      }
    })
    .catch(err => res.send(err));
  return next();
})

server.post('/light/:index/:status/:color', (req: Request, res: Response, next: Next) => {
  const updatedLight = {
    status: req.params.status,
    color: req.params.color
  };
  Light.updateOne({ _id: req.params.index }, updatedLight)
    .then(result => res.send(result))
    .catch(err => res.send(err));
})

server.post('/auth', (req: Request, res: Response, next: Next) => {
  try {
    const { username, password } = JSON.parse(req.body);
    if (!username || !password) {
      throw new UnauthorizedError();
    }
    db.authenticate(username, password).then(data => {
      if (!data) {
        throw new UnauthorizedError();
      } else {
        const token = jwt.sign(data.toJSON(), config.jwt.secret);
        res.send(token);
      }
    })
      .catch(error => { console.log(error); res.send(error); });
  }
  catch {
    res.send(new UnauthorizedError());
  }

  return next();
})

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});