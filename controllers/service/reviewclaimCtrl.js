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

exports.getReviewClaimList = function (req, resp) {
    var tgl_Awal = req.body.tgl_awal
    var tgl_Akhir = req.body.tgl_akhir
    var kode_bass = req.body.kode_bass
    var param_kode_bass = req.body.param_kode_bass
    var status = req.body.status
    isAuth(req, resp, function (flag) {
        console.log("is auth")
        console.log({
            DARI: tgl_Awal,
            SAMPAI: tgl_Akhir,
            KODE_BASS: kode_bass,
            PARAM_KODE_BASS: param_kode_bass,
            STATUS: status
        })
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_REVIEW_CLAIM_SELECT",
            params: {
                DARI: tgl_Awal,
                SAMPAI: tgl_Akhir,
                KODE_BASS: kode_bass,
                PARAM_KODE_BASS: param_kode_bass,
                STATUS: status
            }
        }).then(function (data) {
            console.log("data")
            console.log(data)
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            console.log("err")
            console.log(err)
            httpMsgs.show500(req, resp, err);
        });
    });
};

exports.getReviewServicebyClaim = function (req, resp) {
    var kode_claim = req.body.kode_claim

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_REVIEW_SERVICE_BY_NOMOR_CLAIM",
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

exports.insertReviewClaim = function (req, resp) {
    isAuth(req, resp, function (flag) {
        sqlSer.executeTransaction(settings.dbConfig, {
            procedure: "NG2_INSERT_REVIEW_CLAIM_SERVICE",
            params: {
                KODE_CLAIM: req.body.kode_claim,
                KODE_SERVICE: req.body.kode_service,
                ISVALID: req.body.isvalid,
                REASON: req.body.reason,
                INPUTTED_BY: req.body.input_by,
                INPUTTED_BY_BASS: req.body.kode_bass,
                INPUTTED_DATE: req.body.tgl_trx
            }
        }).then(function (data) {
            return data.transaction
                .commit()
                .then(function () {
                    httpMsgs.sendJson(req, resp, req.body.kode_service + " updated!");
                });
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
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

exports.getBassList = function (req, resp) {
    var kode_bass = req.body.kode_bass

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_BASS_SELECT",
            params: {
                KODE_BASS: "%" + kode_bass + "%",
                NAMA_BASS: "%%",
                INPUTTED_BY: "%%"
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};