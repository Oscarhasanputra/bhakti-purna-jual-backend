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

exports.insertPaidClaim = function (req, resp) {
    isAuth(req, resp, function (flag) {
        sqlSer.executeTransaction(settings.dbConfig, {
            procedure: "NG2_INSERT_PAID_CLAIM_SERVICE",
            params: {
                KODE_CLAIM: req.body.kode_claim,
                INPUTTED_BY: req.body.input_by,
                INPUTTED_BY_BASS: req.body.kode_bass,
                INPUTTED_DATE: req.body.tgl_trx
            }
        }).then(function (data) {
            return data.transaction
                .commit()
                .then(function () {
                    httpMsgs.sendJson(req, resp, req.body.kode_claim + " paid!");
                });
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};