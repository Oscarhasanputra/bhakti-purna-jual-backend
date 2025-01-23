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

exports.getListCustomer = function(req, resp) {
    var kode_bass = req.body.kode_bass
    var kode_zona = req.body.kode_zona
    var nama_customer = req.body.nama_customer

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_CUSTOMER_SELECT '" + kode_bass + "','" + kode_zona + "','" + nama_customer + "'")
        .then(data => httpMsgs.sendJson(req, resp, data))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.saveTambahCustomer = function (req, resp) {
    var datas = req.body;
    var now = new Date();

    sqlSer.getTransactionContext(settings.dbConfig)
        .step("getKodeCustomer", {
            procedure: "NG2_CUSTOMER_AUTOINCREMENT"
        })
        .step("insertCustomer", function (execute, data) {
            var kodeCustomer = data.getKodeCustomer[0][0][0];
            execute({
                procedure: "NG2_CUSTOMER_INSERT",
                params: {
                    kode_customer: kodeCustomer.kode_customer,
                    nama_customer: datas.nama_customer,
                    telp_customer: datas.nomor_telepon,
                    alamat_customer: datas.alamat_customer,
                    kota_customer: datas.kota,
                    hp_customer: datas.nomor_hp,
                    inputted_by: datas.inputted_by,
                    inputted_by_bass: datas.inputted_by_bass,
                    inputted_date: now
                }
            });
        })
        .end(function (result) {
            result.transaction.commit();
            var kode_customer = result.sets.getKodeCustomer[0][0][0]
            httpMsgs.sendJson(req, resp, {"status":"sukses","kode_customer":kode_customer.kode_customer});
        })
        .error(function (err) {
            httpMsgs.show500(req, resp, err);
            console.log(err);
        });
};

exports.deleteCustomer = function(req, resp) {
    var kode_customer = req.body.kode_customer

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_CUSTOMER_DELETE '" + kode_customer + "'")
        .then(data => httpMsgs.sendJson(req, resp, {"status":"sukses"}))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.massDeleteCustomer = function(req, resp) {

    sqlSer.getTransactionContext(settings.dbConfig)
        .step("massDeleteCustomer", function (execute, data) {
            for(let i=0;i < req.body.length; i++){
                var kode_customer = (req.body[i].kode_customer);
                execute({
                    procedure: "NG2_CUSTOMER_DELETE",
                    params: {
                        kode_customer: kode_customer
                    }
                });
            }
        })
        .end(function (result) {
            result.transaction.commit();
            httpMsgs.sendJson(req, resp, {"status":"sukses"});
        })
        .error(function (err) {
            httpMsgs.show500(req, resp, err);
            console.log(err);
        });

};

exports.getCustomerSingle = function(req, resp) {
    var kode_customer = req.body.kode_customer

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_CUSTOMER_GET '" + kode_customer + "'")
        .then(data => httpMsgs.sendJson(req, resp, data))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.updateCustomer = function(req, resp) {
    var kode_customer = req.body.kode_customer
    var nama_customer = req.body.nama_customer
    var alamat_customer = req.body.alamat_customer
    var nomor_telp = req.body.nomor_telepon
    var kota = req.body.kota
    var hp_customer = req.body.nomor_hp

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_CUSTOMER_EDIT '" + kode_customer + "','" + nama_customer + "','" + nomor_telp + "','" + alamat_customer + "','" + kota + "','" + hp_customer + "'")
        .then(data => httpMsgs.sendJson(req, resp, {"status":"sukses"}))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};