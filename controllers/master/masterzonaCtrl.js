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

// [ZONA_LIST]
exports.getZonaList = function (req, resp) {
    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "EXEC NG2_ZONA_LIST")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });
};

// [ZONA_INSERT]
exports.saveZona = function (req, resp) {
    var datas = req.body;

    isAuth(req, resp, function (flag) {
        sqlSer.getTransactionContext(settings.dbConfig)
            .step("getNoZona", {
                procedure: "NG2_ZONA_AUTOINCREMENT"
            })
            .step("insertZona", function (execute, data) {
                var NO_ZONA = data.getNoZona[0][0][0][''];
                execute({
                    procedure: "NG2_ZONA_INSERT",
                    params: {
                        ZONA: NO_ZONA,
                        NAMA_ZONA: datas.NAMA_ZONA,
                        INPUTTED_BY: datas.INPUTTED_BY,
                        INPUTTED_BY_BASS: datas.INPUTTED_BY_BASS,
                        INPUTTED_DATE: datas.INPUTTED_DATE
                    }
                });
            })
            .end(function (result) {
                result.transaction.commit();
                httpMsgs.sendJson(req, resp, result.sets.getNoZona[0][0][0]['']);
            })
            .error(function (err) {
                httpMsgs.show500(req, resp, err);
            });
    })
};

// // [ZONA_DELETE]
exports.deleteZona = function (req, resp) {

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "EXEC NG2_ZONA_DELETE '" + req.body.zona + "'")
            .then(data => httpMsgs.sendJson(req, resp, req.body.zona))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.editZona = function (req, resp) {
    var datas = req.body;

    isAuth(req, resp, function (flag) {
        sqlSer.getTransactionContext(settings.dbConfig)
            .step("editZona", function (execute, data) {
                execute({
                    procedure: "NG2_ZONA_EDIT",
                    params: {
                        KODE_ZONA: datas.ZONA,
                        NAMA_ZONA: datas.NAMA_ZONA
                    }
                });
            })
            .end(function (result) {
                result.transaction.commit();
                httpMsgs.sendJson(req, resp, datas.ZONA);
            })
            .error(function (err) {
                httpMsgs.show500(req, resp, err);
            });
    })
};