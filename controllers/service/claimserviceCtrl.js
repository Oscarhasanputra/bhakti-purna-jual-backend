var httpMsgs = require("../../core/httpMsgs");
// sign with default (HMAC SHA256) 
var jwt = require('jsonwebtoken');
var settings = require("../../settings");
var sqlSer = require('seriate');

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


exports.getClaimService = function (req, resp) {
    var kode_bass = req.body.kode_bass
    var tgl_Awal = req.body.tgl_awal
    var tgl_Akhir = req.body.tgl_akhir

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_CLAIM_AVAILABLE_SELECT",
            params: {
                KODE_BASS: kode_bass,
                DARI: tgl_Awal,
                SAMPAI: tgl_Akhir
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

exports.saveClaimService = function (req, resp) {
    var detail = req.body.data;

    sqlSer.getTransactionContext(settings.dbConfig)
        .step("getKodeClaim", {
            procedure: "NG2_CLAIM_AUTOINCREMENT",
            params: {
                KODE_BASS: req.body.kode_bass,
                TANGGAL: req.body.tgl_trx
            }
        })
        .step("insertHeader", function (execute, data) {
            var kodeClaim = data.getKodeClaim[0][0][0].AUTOINC;
            execute({
                procedure: "NG2_CLAIM_INSERT_HEADER",
                params: {
                    KODE_CLAIM: kodeClaim,
                    TANGGAL: req.body.tgl_trx,
                    INPUTTED_BY: req.body.input_by,
                    INPUTTED_BY_BASS: req.body.kode_bass,
                    INPUTTED_DATE: req.body.tgl_trx,
                }
            });
        })
        .step("insertDetails", function (execute, data) {
            var kodeClaim = data.getKodeClaim[0][0][0].AUTOINC;
            detail.forEach(function (item) {
                // console.log(item.NOMOR_SERVICE)
                execute({
                    procedure: "NG2_CLAIM_INSERT_DETAIL",
                    params: {
                        KODE_CLAIM: kodeClaim,
                        KODE_SERVICE: item.NOMOR_SERVICE
                    }
                });
            });
        })
        .end(function (result) {
            result.transaction.commit();
            httpMsgs.sendJson(req, resp, result.sets.getKodeClaim[0][0][0].AUTOINC);
        })
        .error(function (err) {
            httpMsgs.show500(req, resp, err);
        });
};