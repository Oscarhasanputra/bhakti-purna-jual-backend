var db = require("../../core/db");
var httpMsgs = require("../../core/httpMsgs");
// sign with default (HMAC SHA256) 
var jwt = require('jsonwebtoken');

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

exports.getServiceSelectForHome = function (req, resp) {
    var kode_service = req.body.kode_service
    var kode_bass = req.body.kode_bass
    var kode_cust = req.body.kode_cust
    var tgl_Awal = req.body.tgl_awal
    var tgl_Akhir = req.body.tgl_akhir
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

        executeSqlP(db, "exec NG2_SERVICE_SELECT_FOR_HOME '" + kode_service + "','" + kode_bass + "','" + kode_cust + "','" + tgl_Awal + "','" + tgl_Akhir + "','" + status + "'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));

    });
};

exports.getPartorderHomeSelect = function (req, resp) {
    var kode_bass = req.body.kode_bass
    var tgl_Awal = req.body.tgl_awal
    var tgl_Akhir = req.body.tgl_akhir
    var kode_zona = req.body.kode_zona
    var inputted_by_bass = req.body.inputted_by_bass

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_PARTORDER_HOME_SELECT '%%','" + kode_bass + "','" + tgl_Awal + "','" + tgl_Akhir + "','" + kode_zona + "','" + inputted_by_bass + "'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));

    });
};

exports.getPartOrderExpiredHomeSelect = function (req, resp) {
    var tgl_Awal = req.body.tgl_awal
    var tgl_Akhir = req.body.tgl_akhir
    var inputted_by_bass = req.body.inputted_by_bass

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_PARTORDER_EXPIRED_HOME_SELECT '%%','%" + inputted_by_bass + "%','" + tgl_Awal + "','" + tgl_Akhir + "'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));

    });
};

exports.getBarangDalamPerjalanan = function (req, resp) {
    var kode_bass = req.params.kode_bass

    isAuth(req, resp, function (flag) {
        if (!kode_bass) {
            kode_bass = '';
        }

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_INVOICE_PENDING_HEADER '" + kode_bass + "','%%'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });
};