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

exports.getTeknisiList = function(req, resp) {
    var kode_bass = req.body.kode_bass
    var kode_teknisi = req.body.kode_teknisi
    var status = req.body.status

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_TEKNISI_SELECT '" + kode_bass + "','%" + kode_teknisi + "%','" + status + "'")
        .then(data => httpMsgs.sendJson(req, resp, data))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};


exports.saveTambahTeknisi = function (req, resp) {
    var datas = req.body;
    var now = new Date();

    sqlSer.getTransactionContext(settings.dbConfig)
        .step("getKodeTeknisi", {
            procedure: "NG2_TEKNISI_AUTOINCREMENT",
            params: {KODE_BASS:datas.inputted_by_bass}
        })
        .step("insertTeknisi", function (execute, data) {
            var kodeCustomer = data.getKodeTeknisi[0][0][0];

            execute({
                procedure: "NG2_TEKNISI_INSERT",
                params: {
                    kode_bass:datas.inputted_by_bass,
                    kode_teknisi: kodeCustomer.kode_teknisi,
                    nama_teknisi: datas.nama_teknisi,
                    inputted_by: datas.inputted_by,
                    inputted_by_bass: datas.inputted_by_bass,
                    inputted_date: now
                }
            });
        })
        .end(function (result) {
            result.transaction.commit();
            var kode_teknisi = result.sets.getKodeTeknisi[0][0][0]
            httpMsgs.sendJson(req, resp, {"status":"sukses","kode_teknisi":kode_teknisi.kode_teknisi});
        })
        .error(function (err) {
            httpMsgs.show500(req, resp, err);
            console.log(err);
        });
};

exports.deleteTeknisi = function(req, resp) {
    var kode_teknisi = req.body.kode_teknisi
    var kode_bass = req.body.kode_bass
    
    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_TEKNISI_DELETE '" + kode_bass + "','" + kode_teknisi + "'")
        .then(data => httpMsgs.sendJson(req, resp, {"status":"sukses"}))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.activateTeknisi = function(req, resp) {
    var kode_teknisi = req.body.kode_teknisi
    var kode_bass = req.body.kode_bass
    
    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_TEKNISI_ACTIVATE '" + kode_bass + "','" + kode_teknisi + "'")
        .then(data => httpMsgs.sendJson(req, resp, {"status":"sukses"}))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.updateTeknisi = function(req, resp) {
    var kode_bass = req.body.kode_bass
    var kode_teknisi = req.body.kode_teknisi
    var nama_teknisi = req.body.nama_teknisi

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_TEKNISI_EDIT '" + kode_bass + "','" + kode_teknisi + "','" + nama_teknisi + "'")
        .then(data => httpMsgs.sendJson(req, resp, {"status":"sukses"}))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.getTeknisiSingle = function(req, resp) {
    var kode_bass = req.body.kode_bass
    var kode_teknisi = req.body.kode_teknisi

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_TEKNISI_GET '" + kode_bass + "','" + kode_teknisi + "'")
        .then(data => httpMsgs.sendJson(req, resp, data))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};