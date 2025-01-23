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

exports.getListInvoice = function (req, resp) {
    var kode_bass = req.body.kodebass
    var status = req.body.status
    var tgldari = req.body.tgldari
    var tglsampai = req.body.tglsampai
    var kdBassTxt = req.body.kdBassTxt

    isAuth(req, resp, function (flag) {
        if (kdBassTxt == undefined) {
            kdBassTxt = ''
        }

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_INVOICE_SELECT_ALL '" + kdBassTxt + "','%%','" + status + "','" + tgldari + "','" + tglsampai + "','" + kode_bass + "'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.getDetailInvoice = function (req, resp) {
    var kodeinvoice = req.body.kodeinvoice

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_INVOICE_GET_DETAIL '" + kodeinvoice + "'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.deleteInvoice = function (req, resp) {
    var noinvoice = req.body.noinvoice

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_INVOICE_DELETE '" + noinvoice + "'")
            .then(data => httpMsgs.sendJson(req, resp, noinvoice))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};