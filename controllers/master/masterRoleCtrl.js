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

exports.getRoleList = function(req, resp) {
    var kode_role = req.body.kode_role

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_ROLE_HEADER_SELECT '%" + kode_role + "%','',''")
        .then(data => httpMsgs.sendJson(req, resp, data))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.getRoleDetailList = function(req, resp) {
    var kode_role = req.body.kode_role

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_ROLE_DETAIL_SELECT '" + kode_role + "'")
        .then(data => httpMsgs.sendJson(req, resp, data))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.saveTambahRole = function (req, resp) {
    var datas = req.body;
    var detail = req.body.details;
    var now = new Date();
    
    sqlSer.getTransactionContext(settings.dbConfig)
        .step("getKodeRole", {
            procedure: "NG2_ROLE_AUTOINCREMENT"
        })
        .step("insertRoleHeader", function (execute, data) {
            var kodeRole = data.getKodeRole[0][0][0];
            execute({
                procedure: "NG2_ROLE_HEADER_INSERT",
                params: {
                    kode_role: kodeRole.kode_role,
                    nama_role: datas.nama_role,
                    is_support_center: datas.support_center,
                    inputted_by: datas.inputted_by,
                    inputted_by_bass: datas.inputted_by_bass,
                    inputted_date: now
                }
            })
        })
        .step("insertRoleDetail", function (execute, data) {
            var kodeRole = data.getKodeRole[0][0][0];

            detail.forEach(function (item) {
                execute({
                    procedure: "NG2_ROLE_DETAIL_INSERT",
                    params: {
                        kode_role: kodeRole.kode_role,
                        kode_application: item.KODE_APPLICATION,
                        hak_akses: item.HAK_AKSES,
                        hak_insert: item.HAK_INSERT,
                        hak_edit: item.HAK_EDIT,
                        hak_delete: item.HAK_DELETE
                    }
                });
            });

        })
        .end(function (result) {
            result.transaction.commit();
            var kode_role = result.sets.getKodeRole[0][0][0]
            httpMsgs.sendJson(req, resp, {"status":"sukses","kode_role":kode_role.kode_role});
        })
        .error(function (err) {
            httpMsgs.show500(req, resp, err);
        });
};

exports.updateRole = function (req, resp) {
    var datas = req.body;
    var detail = req.body.details;
    var now = new Date();
    
    sqlSer.getTransactionContext(settings.dbConfig)
        .step("updateRoleHeader", function (execute, data) {
            execute({
                procedure: "NG2_ROLE_EDIT",
                params: {
                    kode_role: datas.kode_role,
                    nama_role: datas.nama_role,
                    is_support_center: datas.support_center
                }
            })
        })
        .step("insertRoleDetail", function (execute, data) {

            detail.forEach(function (item) {
                execute({
                    procedure: "NG2_ROLE_DETAIL_INSERT",
                    params: {
                        kode_role:  datas.kode_role,
                        kode_application: item.KODE_APPLICATION,
                        hak_akses: item.HAK_AKSES,
                        hak_insert: item.HAK_INSERT,
                        hak_edit: item.HAK_EDIT,
                        hak_delete: item.HAK_DELETE
                    }
                });
            });

        })
        .end(function (result) {
            result.transaction.commit();
            httpMsgs.sendJson(req, resp, {"status":"sukses"});
        })
        .error(function (err) {
            httpMsgs.show500(req, resp, err);
        });
};

exports.deleteRole = function(req, resp) {
    var kode_role = req.body.kode_role
    
    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_ROLE_DELETE '" + kode_role + "'")
        .then(data => httpMsgs.sendJson(req, resp, {"status":"sukses"}))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};