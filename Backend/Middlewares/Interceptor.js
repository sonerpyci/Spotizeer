const {PassThrough} = require("stream");
const Service = require('../Services/Database/Logger');

module.exports = {
    Intercept : (req, res, next) => {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
        res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
        if (req.method === "OPTIONS") {
            return res.status(200).end();
        } else {
            const defaultWrite = res.write.bind(res);
            const defaultEnd = res.end.bind(res);
            const ps = new PassThrough();
            const chunks = [];
            const requestStart = Date.now();
            let errorMessage = null;
            let body = [];

            ps.on('data', data => chunks.push(data));

            res.write = (...args) => {
                ps.write(...args);
                defaultWrite(...args);
            }

            res.end = (...args) => {
                ps.end(...args);
                defaultEnd(...args);
            }

            res.on('finish', () => {
                Service.DATABASE_ENGINE.CreateLog({
                    Route: req.originalUrl,
                    Method: req.method,
                    RequestHeaders: JSON.stringify(req.headers),
                    RequestBody: JSON.stringify(req.body),
                    ResponseBody: Buffer.concat(chunks).toString(),
                    ResponseHeaders: JSON.stringify(res.getHeaders()),
                    ResponseStatus: res.statusCode,
                    UserId: req.user ? req.user.Id : undefined,
                    SessionId: req.user ? req.user.Session.Id : undefined,
                })
                //console.log("req.body", req.body);
                //console.log("res.body", Buffer.concat(chunks).toString());
            })
            next();
        }
    }


}