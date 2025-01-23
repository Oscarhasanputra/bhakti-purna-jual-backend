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

exports.getClaimList = function (req, resp) {
    var kode_bass = req.body.kode_bass
    var kode_claim = req.body.kode_claim
    var tgl_Awal = req.body.tgl_awal
    var tgl_Akhir = req.body.tgl_akhir
    var status = req.body.status

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_CLAIM_SELECT",
            params: {
                KODE_BASS: kode_bass,
                KODE_CLAIM: "%" + kode_claim + "%",
                DARI: tgl_Awal,
                SAMPAI: tgl_Akhir,
                STATUS: status
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

exports.deleteClaim = function (req, resp) {
    var kode_claim = req.body.kode_claim

    isAuth(req, resp, function (flag) {
        sqlSer.executeTransaction(settings.dbConfig, {
            procedure: "NG2_CLAIM_DELETE",
            params: {
                KODE_CLAIM: kode_claim
            }
        }).then(function (data) {
            return data.transaction
                .commit()
                .then(function () {
                    httpMsgs.sendJson(req, resp, kode_claim + " deleted!");
                });
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

exports.getClaimDetail = function (req, resp) {
    var kode_claim = req.body.kode_claim

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_CLAIM_GET_DETAIL",
            params: {
                KODE_CLAIM: kode_claim
            }
        }).then(function (data) {
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

exports.removeClaimDetail = function (req, resp) {
    var detail = req.body.data;

    sqlSer.getTransactionContext(settings.dbConfig)
        .step("updateDetails", function (execute, data) {
            detail.forEach(function (item) {
                execute({
                    procedure: "NG2_CLAIM_UPDATE_DETAIL_NULL",
                    params: {
                        KODE_SERVICE: item.NOMOR_SERVICE
                    }
                });
            });
        })
        .end(function (result) {
            result.transaction.commit();
            httpMsgs.sendJson(req, resp, req.body.kode_claim + " updated !");
        })
        .error(function (err) {
            httpMsgs.show500(req, resp, err);
        });
};