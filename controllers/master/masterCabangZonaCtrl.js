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

exports.masterCabangSelect = function(req, resp) {
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

        executeSqlP(db, "exec NG2_CABANG_SELECT '%" + kode_bass + "%','%%'" )
        .then(data => httpMsgs.sendJson(req, resp, data))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.mappingCabangZonaGet = function(req, resp) {
    var kode_cabang = req.body.kode_cabang
    var kata_kunci = req.body.kata_kunci
    
    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_MAPPING_CABANG_ZONA_SELECT '" + kode_cabang + "','%" + kata_kunci + "%'" )
        .then(data => httpMsgs.sendJson(req, resp, data))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.getCabang = function(req, resp) {

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_MAPPING_CZ_CABANG_SELECT")
        .then(data => httpMsgs.sendJson(req, resp, data))
        .catch(err => httpMsgs.show500(req, resp, err));
    });
};

exports.getZonaMapping = function(req, resp) {

    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_MAPPING_CZ_ZONA_SELECT")
        .then(data => httpMsgs.sendJson(req, resp, data))
        .catch(err => httpMsgs.show500(req, resp, err));
    });
};

exports.deleteMappingZona = function(req, resp) {
    var kode_cabang = req.body.kode_cabang
    var kode_zona = req.body.kode_zona
    
    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_MAPPING_CZ_DELETE '" + kode_cabang + "','" + kode_zona + "'")
        .then(data => httpMsgs.sendJson(req, resp, {"status":"sukses"}))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.saveMappingZona = function(req, resp) {
    var kode_cabang = req.body.cabang
    var kode_zona = req.body.zona
    var inputted_by = req.body.inputted_by
    var inputted_by_bass = req.body.inputted_by_bass
    
    isAuth(req, resp, function (flag) {

        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql , function(data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_MAPPING_CZ_INSERT '" + kode_cabang + "','" + kode_zona + "','" + inputted_by + "','" + inputted_by_bass + "'")
        .then(data => httpMsgs.sendJson(req, resp, {"status":"sukses"}))
        .catch(err => httpMsgs.show500(req, resp, err));
    });

};