var db = require("../../core/db");
var httpMsgs = require("../../core/httpMsgs");
// sign with default (HMAC SHA256) 
var jwt = require('jsonwebtoken');
var sqlSer = require('seriate');
var settings = require('../../settings');
// var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
// //backdate a jwt 30 seconds 
// var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');
 

var isAuth = function(req, resp, callback) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        jwt.verify(token, 'jwtsecret', function(err, decoded) {
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

exports.transportasiGet = function(req, resp) {
    var kode_transportasi = req.body.kode_transportasi
    
    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_TRANSPORTASI_GET '" + kode_transportasi + "'")
        .then(data => httpMsgs.sendJson(req, resp, data))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.deleteTransportasi = function(req, resp) {
    var kode_transportasi = req.body.kode_transportasi
    
    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_TRANSPORTASI_DELETE '" + kode_transportasi + "'")
        .then(data => httpMsgs.sendJson(req, resp, {"status":"sukses"}))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.saveTambahTransportasi = function (req, resp) {
    var datas = req.body;
    var now = new Date();

    sqlSer.getTransactionContext(settings.dbConfig)
        .step("getKodeTransportasi", {
            procedure: "NG2_Transportasi_AUTOINCREMENT"
        })
        .step("insertTransportasi", function (execute, data) {
            var kodeTransportasi = data.getKodeTransportasi[0][0][0];

            execute({
                procedure: "NG2_TRANSPORTASI_INSERT",
                params: {
                    kode_transportasi: kodeTransportasi.kode_trans,
                    jarak: datas.jarak,
                    biaya: datas.biaya,
                    inputted_by: datas.inputted_by,
                    inputted_by_bass: datas.inputted_by_bass,
                    inputted_date: now
                }
            });
        })
        .end(function (result) {
            result.transaction.commit();
            var kode_transportasi = result.sets.getKodeTransportasi[0][0][0]
            httpMsgs.sendJson(req, resp, {"status":"sukses","kode_transportasi":kode_transportasi.kode_trans});
        })
        .error(function (err) {
            httpMsgs.show500(req, resp, err);
            console.log(err);
        });
};

exports.getTransportasiSingle = function(req, resp) {
    var kode_transportasi = req.body.kode_transportasi

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_TRANSPORTASI_GET '" + kode_transportasi + "'")
        .then(data => httpMsgs.sendJson(req, resp, data))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.updateTransportasi = function(req, resp) {
    var kode_transportasi = req.body.kode_transportasi
    var jarak = req.body.jarak
    var biaya = req.body.biaya

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_TRANSPORTASI_EDIT '" + kode_transportasi + "','" + jarak + "','" + biaya + "'")
        .then(data => httpMsgs.sendJson(req, resp, {"status":"sukses"}))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};