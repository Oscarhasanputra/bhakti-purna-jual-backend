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

exports.getKotaSelect = function(req, resp) {

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_KOTA_SELECT")
        .then(data => httpMsgs.sendJson(req, resp, data))
        .catch(err => httpMsgs.show500(req, resp, err));
    });
};

exports.saveTambahBass = function (req, resp) {
    var datas = req.body;
    var now = new Date();
    
    sqlSer.getTransactionContext(settings.dbConfig)
        .step("getKodeBass", {
            procedure: "NG2_BASS_AUTOINCREMENT"
        })
        .step("insertBass", function (execute, data) {
            var kodeBass = data.getKodeBass[0][0][0];
            execute({
                procedure: "NG2_BASS_INSERT",
                params: {
                    kode_bass: kodeBass.kode_bass,
                    nama_bass: datas.nama_bass,
                    alamat_bass: datas.alamat_bass,
                    nomor_telp: datas.nomor_telepon,
                    kota: datas.kota,
                    contact_person: datas.contact_person,
                    email: datas.email,
                    inputted_by: datas.inputted_by,
                    inputted_by_bass: datas.inputted_by_bass,
                    type: "B"
                }
            });
        })
        .end(function (result) {
            result.transaction.commit();
            var kode_bass = result.sets.getKodeBass[0][0][0]
            httpMsgs.sendJson(req, resp, {"status":"sukses","kode_bass":kode_bass.kode_bass});
        })
        .error(function (err) {
            httpMsgs.show500(req, resp, err);
        });
};

exports.getListMasterBass = function(req, resp) {
    var status = req.body.status
    var kode_zona = req.body.kode_zona

    if(!status){
        status = ''
    }

    if(!kode_zona){
        kode_zona = ''
    }

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_BASS_SELECT_BY_ZONA '%%','%%','" + status + "','%%','" + kode_zona + "'")
        .then(data => httpMsgs.sendJson(req, resp, data))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.getBassSingle = function(req, resp) {
    var kode_bass = req.params.kode_bass

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_BASS_GET '" + kode_bass + "'")
        .then(data => httpMsgs.sendJson(req, resp, data))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.updateBass = function(req, resp) {
    var kode_bass = req.body.kode_bass
    var nama_bass = req.body.nama_bass
    var alamat_bass = req.body.alamat_bass
    var nomor_telp = req.body.nomor_telepon
    var kota = req.body.kota
    var contact_person = req.body.contact_person
    var email = req.body.email

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_BASS_EDIT '" + kode_bass + "','" + nama_bass + "','" + alamat_bass + "','" + nomor_telp + "','" + kota + "','" + contact_person + "','" + email + "'")
        .then(data => httpMsgs.sendJson(req, resp, {"status":"sukses"}))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.deleteBass = function(req, resp) {
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

        executeSqlP(db, "exec NG2_BASS_DELETE '" + kode_bass + "'")
        .then(data => httpMsgs.sendJson(req, resp, {"status":"sukses"}))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.activateBass = function(req, resp) {
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

        executeSqlP(db, "exec BASS_ACTIVATION '" + kode_bass + "'")
        .then(data => httpMsgs.sendJson(req, resp, {"status":"sukses"}))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.getBassUnderCabang = function (req, resp) {
    var kode_bass = req.body.kode_bass

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_BASS_SELECT_UNDER_CABANG",
            params: {
                KODE_BASS: kode_bass,
                KODE_NAMA_BASS: "%%"
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};