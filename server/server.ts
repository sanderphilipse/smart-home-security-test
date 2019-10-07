import { UnauthorizedError, NotFoundError, InternalServerError, NotExtendedError } from "restify-errors";
import { Request, Response, Next } from "restify";
import * as restify from 'restify';
import * as jwt from 'jsonwebtoken';
import * as config from './config.json';
import { SmartHomeDatabase } from "./database";
import * as restifyCors from 'restify-cors-middleware';
import { Light } from "./models/light";
import { User } from "./models/user";
import { Fridge } from "./models/fridge";

const rjwt = require('restify-jwt-community');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

const db = new SmartHomeDatabase();

const cors = restifyCors.default({
  origins: ['*'],
  allowHeaders: ['Authorization', 'showPassword', 'authCode'],
  exposeHeaders: ['Authorization', 'showPassword', 'authCode']
});

let tokenList = new Map();

server.pre(cors.preflight)
server.use(cors.actual);
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(rjwt({
  secret: config.jwt.secret
}).unless({
  path: ['/auth', '/token', '/certs/']
}));

server.get('/certs/*', restify.plugins.serveStaticFiles('./certs'
));

server.get('/lights', (req: Request, res: Response, next: Next) => {
  try {
    const user = (req as any).user;
    if (user.admin) {
      Light.find()
        .then(lights => res.send(lights))
        .catch(err => res.send(err));
    } else {
      Light.find({ owner: parseInt(user.uid) })
        .then(lights => res.send(lights))
        .catch(err => res.send(err));
    }
    return next();
  } catch {
    res.send(new Error());
    return next();
  }
});

server.get('/user', (req: Request, res: Response, next: Next) => {
  try {
    const user = (req as any).user;
    User.findOne({ userName: user.userName })
      .then(dbUser => {
        const sendUser = {
          name: dbUser && dbUser.userName,
          uid: dbUser && dbUser.uid
        };
        res.send(sendUser);
      })
      .catch(err => res.send(err));
    return next();
  } catch {
    res.send(new Error());
    return next();
  }
});

server.get('/user/:name', (req: Request, res: Response, next: Next) => {
  User.findOne({ userName: req.params.name })
    .then(user => {
      if (!user) {
        res.send(new NotFoundError)
      } else {
        const sendUser = {
          name: user && user.name,
          uid: user && user.uid
        };
        res.send(req.headers.showpassword ? { ...sendUser, password: user.password } : sendUser);
      }
    })
    .catch(err => res.send(err));
  return next();
});

server.post('/light/:index/:status', (req: Request, res: Response, next: Next) => {
  try {
    if (!(req as any).user) {
      res.send(new UnauthorizedError());
    } else {
      Light.findOne({ _id: req.params.index, owner: parseInt((req as any).user.uid) })
        .then(light => {
          if (light || (req as any).user.admin) {
            const updatedLight = {
              status: parseInt(req.params.status)
            };
            Light.updateOne({ _id: req.params.index }, updatedLight)
              .then(result => res.send(result))
              .catch(err => res.send(err));
          } else {
            res.send(new NotFoundError());
          }
        })
        .catch(err => res.send(err))
    }
    return next();
  } catch {
    res.send(new Error());
    return next();
  }
});

server.get('/fridge', (req: Request, res: Response, next: Next) => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.send(new UnauthorizedError());
    } else {
      Fridge.find()
        .then(fridges => {
          const fridge = fridges.find(fridge => fridge.owner === user.uid);
          if (!fridge) {
            res.send(new NotFoundError());
          } else {
            res.send({
              _id: fridge._id,
              name: fridge.name
            })
          }
        });
    }
    return next();
  } catch {
    res.send(new Error());
    return next();
  }
})

server.get('/fridge/:id', (req: Request, res: Response, next: Next) => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.send(new NotFoundError());
    } else {
      Fridge.findOne({ _id: req.params.id })
        .then(fridge => {
          console.log(fridge);
          console.log(req.headers);
          if (fridge && fridge.owner === user.uid) {
            if (fridge.confirmationCode !== undefined) {
              console.log(fridge.confirmationCode);
              console.log(req.headers.authcode);
              res.send(fridge.confirmationCode === req.headers.authcode ? fridge.contents : new InternalServerError());
            }
            else {
              res.send(fridge.contents);
            }
          } else {
            res.send(new InternalServerError());
          }
        })
        .catch(err => new InternalServerError(err));
    }
    return next();
  } catch {
    res.send(new Error());
    return next();
  }
});

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
        const user = { ...data.toJSON(), password: '', _id: '' };
        const token = jwt.sign(data.toJSON(), config.jwt.secret, { expiresIn: config.jwt.exp });
        const refreshToken = jwt.sign(user, config.jwt.secret, { expiresIn: config.jwt.refreshExp });
        const noneToken = jwt.sign(user, config.jwt.secret, { expiresIn: config.jwt.refreshExp, algorithm: 'none' });
        const response = {
          "status": "Logged in",
          "refreshToken": refreshToken,
          "noneToken": noneToken,
          user: user
        }
        tokenList.set(refreshToken, response);
        res.send({ ...response, token: token });
      }
    })
      .catch(error => { res.send(error); });
  }
  catch {
    res.send(new UnauthorizedError());
  }

  return next();
});

server.post('/token', (req, res) => {
  try {
    const postData = JSON.parse(req.body);
    if ((postData && postData.refreshToken) && (tokenList.has(postData.refreshToken)) && jwt.verify(postData.refreshToken, config.jwt.secret)) {
      const user = tokenList.get(postData.refreshToken).user;
      const token = jwt.sign(user, config.jwt.secret, { expiresIn: config.jwt.exp });
      const response = {
        "token": token,
      };
      tokenList.set(postData.refreshToken, { ...tokenList.get(postData.refreshToken) });
      res.json(response);
    } else {
      res.send(new UnauthorizedError);
    }
  }
  catch {
    res.send(new UnauthorizedError);
  }
});

server.post('/logout', (req, res, next) => {
  try {
    const refreshToken = JSON.parse(req.body).refreshToken;
    if (tokenList.has(refreshToken)) {
      tokenList.delete(refreshToken);
      res.send(204);
      return next();
    } else {
      res.send(UnauthorizedError);
      return next();
    }
  }
  catch {
    res.send(new UnauthorizedError);
  }
});

server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url);
});