var db = require("../../core/db");
var httpMsgs = require("../../core/httpMsgs");
// sign with default (HMAC SHA256) 
var jwt = require('jsonwebtoken');
var sqlSer = require('seriate');
var settings = require('../../settings');
// var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
// //backdate a jwt 30 seconds 
// var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');


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

exports.reportClaim = function (req, resp) {
    var kode_bass = req.params.kode_bass
    var tgl_Awal = req.params.tgl_Awal
    var tgl_Akhir = req.params.tgl_Akhir

    isAuth(req, resp, function (flag) {
        if (!kode_bass) {
            kode_bass = ''
        }
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_CLAIM_REPORT_HD '" + kode_bass + "','" + tgl_Awal + "','" + tgl_Akhir + "'")
            .then(data =>
                Promise.all(data.map(claim =>
                    executeSqlP(db, "exec NG2_CLAIM_REPORT_DT '" + claim.KODE_CLAIM + "'")
                        .then(details =>
                            ({
                                KODE_CLAIM: claim.KODE_CLAIM,
                                Valid_desc: claim.Valid_Desc,
                                Paid: claim.Paid_Desc,
                                DETAILS: details.map(detail =>
                                    ({
                                        Kode_Service: detail.KODE_SERVICE,
                                        Tanggal_Service: detail.TANGGAL_SERVICE,
                                        Nomor_Nota: detail.NOMOR_NOTA,
                                        Merk: detail.MERK,
                                        Kode_Produk: detail.KODE_PRODUK,
                                        Nomor_Seri: detail.NOMOR_SERI,
                                        Kerusakan: detail.KODE_PENGADUAN,
                                        perbaikan: detail.KODE_PERBAIKAN,
                                        Biaya: detail.BIAYA,
                                        Transport: detail.BIAYA_TRANSPORT,
                                        Valid: detail.Valid_Desc
                                    })
                                )
                            })
                        )
                ))
            )
            .then(hddt => httpMsgs.sendJson(req, resp, hddt))
            .catch(err => httpMsgs.show500(req, resp, err));

    });
};