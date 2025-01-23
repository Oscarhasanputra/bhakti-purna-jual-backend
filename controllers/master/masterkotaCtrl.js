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

// [KOTA_LIST]
exports.getKotaList = function (req, resp) {
    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "EXEC NG2_KOTA_LIST '%%'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });
};

exports.getKota = function (req, resp) {
    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "EXEC NG2_KOTA_GET '" + req.body.kota + "'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });


};

// [KOTA_INSERT]
exports.saveKota = function (req, resp) {
    var datas = req.body;

    isAuth(req, resp, function (flag) {
        sqlSer.getTransactionContext(settings.dbConfig)
            .step("insertZona", function (execute, data) {
                execute({
                    procedure: "NG2_KOTA_INSERT",
                    params: {
                        KODE_KOTA: datas.KOTA,
                        PROVINSI: datas.PROVINSI
                    }
                });
            })
            .end(function (result) {
                result.transaction.commit();
                httpMsgs.sendJson(req, resp, datas.KOTA);
            })
            .error(function (err) {
                httpMsgs.show500(req, resp, err);
            });
    })
};

// [KOTA_EDIT]
exports.editKota = function (req, resp) {
    var datas = req.body;

    isAuth(req, resp, function (flag) {
        sqlSer.getTransactionContext(settings.dbConfig)
            .step("editKota", function (execute, data) {
                execute({
                    procedure: "NG2_KOTA_EDIT",
                    params: {
                        KODE_KOTA: datas.KOTA,
                        ZONA: datas.zonaselected,
                        PROVINSI: datas.PROVINSI,
                        INPUTTED_BY: datas.INPUTTED_BY,
                        INPUTTED_BY_BASS: datas.INPUTTED_BY_BASS,
                        INPUTTED_DATE: datas.INPUTTED_DATE
                    }
                });
            })
            .end(function (result) {
                result.transaction.commit();
                httpMsgs.sendJson(req, resp, datas.KOTA);
            })
            .error(function (err) {
                httpMsgs.show500(req, resp, err);
            });
    })
};