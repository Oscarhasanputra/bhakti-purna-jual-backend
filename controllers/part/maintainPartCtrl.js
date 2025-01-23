var db = require("../../core/db");
var httpMsgs = require("../../core/httpMsgs");
// sign with default (HMAC SHA256) 
var jwt = require('jsonwebtoken');
var sqlSer = require('seriate');
var settings = require("../../settings");

var isAuth = function (req, resp, callback) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        jwt.verify(token, 'jwtsecret', function (err, decoded) {
            if (err) {
                httpMsgs.show500(req, resp, err);
                callback(false);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                callback(true);
            };
        });
    } else {
        httpMsgs.show500(req, resp, "You are not authorized");
    }
};

exports.getListPO = function (req, resp) {
    var kode_bass = req.body.kodebass
    var status = req.body.status



    isAuth(req, resp, function (flag) {
        if (kode_bass == undefined) {
            kode_bass = ''
        }
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_PARTORDER_HEADER_SELECT '" + kode_bass + "','%%','" + status + "'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });
};

exports.deletePO = function (req, resp) {
    var nopo = req.body.nopo
    var status = req.body.status

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_PARTORDER_UPDATE '" + nopo + "','" + status + "'")
            .then(data => httpMsgs.sendJson(req, resp, nopo))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};