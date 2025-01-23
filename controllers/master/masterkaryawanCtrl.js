var db = require("../../core/db");
var httpMsgs = require("../../core/httpMsgs");
// sign with default (HMAC SHA256) 
var jwt = require('jsonwebtoken');
var sqlSer = require('seriate');
var settings = require("../../settings");
var loginCtrl = require("../../controllers/login/loginCtrl");
var dateFormat = require('dateformat');

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

exports.getRoleList = function (req, resp) {
    var type = req.body.type;
    var role = req.body.role;

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "EXEC NG2_ROLE_HEADER_SELECT  '%%','" + type + "','" + role + "' ")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

}

exports.getKaryawanList = function (req, resp) {
    var kodebass = req.body.kodebass;
    var status = req.body.status;

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "EXEC NG2_KARYAWAN_SELECT '" + kodebass + "', '%%','" + status + "' ")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.getKaryawanListDetail = function (req, resp) {
    var kodebass = req.body.kodebass;
    var username = req.body.username;

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "EXEC NG2_KARYAWAN_GET '" + kodebass + "','" + username + "' ")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });
};


// [KARYAWAN_INSERT]
exports.saveKaryawan = function (req, resp) {
    var datas = req.body;

    isAuth(req, resp, function (flag) {
        if (datas.authtype == "Bass") {
            var kodebass = datas.kdBasstxt;
        } else {
            var kodebass = datas.KodeBassLoggedin;
        }
        sqlSer.getTransactionContext(settings.dbConfig)
            .step("insertKaryawan", function (execute, data) {
                execute({
                    procedure: "NG2_KARYAWAN_INSERT",
                    params: {
                        KODE_BASS: kodebass,
                        KODE_ROLE: datas.selectedKodeRole,
                        USERNAME: datas.USERNAME,
                        EMAIL: datas.EMAIL,
                        PASSWORD: loginCtrl.Encrypt(datas.PASSWORD),
                        INPUTTED_BY: datas.INPUTTED_BY,
                        INPUTTED_BY_BASS: datas.INPUTTED_BY_BASS,
                        INPUTTED_DATE: dateFormat(datas.INPUTTED_DATE, "yyyy-mm-dd HH:MM:ss")
                    }
                });
            })
            .end(function (result) {
                result.transaction.commit();
                httpMsgs.sendJson(req, resp, datas.USERNAME);
            })
            .error(function (err) {
                httpMsgs.show500(req, resp, err);
            });
    })
};

// [KARYAWAN_DELETE]
exports.deleteKaryawan = function (req, resp) {
    var datas = req.body;

    isAuth(req, resp, function (flag) {
        sqlSer.getTransactionContext(settings.dbConfig)
            .step("deleteKaryawan", function (execute, data) {
                execute({
                    procedure: "NG2_KARYAWAN_DELETE",
                    params: {
                        KODE_BASS: datas.KODE_BASS,
                        USERNAME: datas.USERNAME
                    }
                });
            })
            .end(function (result) {
                result.transaction.commit();
                httpMsgs.sendJson(req, resp, datas.USERNAME);
            })
            .error(function (err) {
                httpMsgs.show500(req, resp, err);
            });
    })
};

// [KARYAWAN_AKTIF]
exports.aktifkanKaryawan = function (req, resp) {
    var datas = req.body;

    isAuth(req, resp, function (flag) {
        sqlSer.getTransactionContext(settings.dbConfig)
            .step("aktifkanKaryawan", function (execute, data) {
                execute({
                    procedure: "NG2_KARYAWAN_ACTIVATE",
                    params: {
                        KODE_BASS: datas.KODE_BASS,
                        USERNAME: datas.USERNAME
                    }
                });
            })
            .end(function (result) {
                result.transaction.commit();
                httpMsgs.sendJson(req, resp, datas.USERNAME);
            })
            .error(function (err) {
                httpMsgs.show500(req, resp, err);
            });
    })
};

// [KARYAWAN_RESET]
exports.resetPassKaryawan = function (req, resp) {
    var datas = req.body;
    var newpassword = loginCtrl.randomString()

    isAuth(req, resp, function (flag) {
        sqlSer.getTransactionContext(settings.dbConfig)
            .step("resetPassKaryawan", function (execute, data) {
                execute({
                    procedure: "NG2_KARYAWAN_RESET_PASSWORD",
                    params: {
                        KODE_BASS: datas.KODE_BASS,
                        USERNAME: datas.USERNAME,
                        PASSWORD: loginCtrl.Encrypt(newpassword)
                    }
                });
            })
            .end(function (result) {
                result.transaction.commit();
                httpMsgs.sendJson(req, resp, newpassword);
            })
            .error(function (err) {
                httpMsgs.show500(req, resp, err);
            });
    })
};

// [KARYAWAN_EDIT]
exports.editKaryawan = function (req, resp) {
    var datas = req.body;

    isAuth(req, resp, function (flag) {
        sqlSer.getTransactionContext(settings.dbConfig)
            .step("editKaryawan", function (execute, data) {
                execute({
                    procedure: "NG2_KARYAWAN_EDIT",
                    params: {
                        KODE_BASS: datas.kdBasstxt,
                        USERNAME: datas.USERNAME,
                        KODE_ROLE: datas.selectedKodeRole,
                        EMAIL: datas.EMAIL
                    }
                });
            })
            .end(function (result) {
                result.transaction.commit();
                httpMsgs.sendJson(req, resp, datas.kdBasstxt);
            })
            .error(function (err) {
                httpMsgs.show500(req, resp, err);
            });
    })
};



