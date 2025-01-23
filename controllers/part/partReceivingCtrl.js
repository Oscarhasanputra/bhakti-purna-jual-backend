var db = require("../../core/db");
var httpMsgs = require("../../core/httpMsgs");
// sign with default (HMAC SHA256) 
var jwt = require('jsonwebtoken');
var sqlSer = require('seriate');
var settings = require("../../settings");

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


exports.getInvoicePRList = function (req, resp) {
    var kode_bass = req.body.kodebass;

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "EXEC NG2_INVOICE_SELECT '" + kode_bass + "'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.savePR = function (req, resp) {
    var datas = req.body;
    var now = new Date();

    isAuth(req, resp, function (flag) {
        sqlSer.getTransactionContext(settings.dbConfig)
            .step("getNoPR", {
                procedure: "NG2_PARTRECEIVING_AUTOINCREMENT",
                params: {
                    KODE_BASS: datas.KodeBass,
                    TANGGAL: datas.dateTrx
                }
            })
            .step("insertHeader", function (execute, data) {
                var NoPR = data.getNoPR[0][0][0][''];
                execute({
                    procedure: "NG2_PARTRECEIVING_HEADER_INSERT",
                    params: {
                        NO_PR: NoPR,
                        TANGGAL: datas.dateTrx,
                        CATATAN: datas.catatan,
                        INPUTTED_BY: datas.KodeKaryawan,
                        INPUTTED_BY_BASS: datas.KodeBass,
                        INPUTTED_DATE: datas.dateTrx
                    }
                });
            })
            .step("UpdateInvoiceStatus", function (execute, data) {
                var NoPR = data.getNoPR[0][0][0][''];
                datas.Details.forEach(function (item) {
                    execute({
                        procedure: "NG2_PARTRECEIVING_UPDATE_INVOICE_STATUS_RECIEVE",
                        params: {
                            NO_INVOICE: item.NO_INVOICE
                        }
                    });
                });
            })
            .step("insertDetails", function (execute, data) {
                var NoPR = data.getNoPR[0][0][0][''];
                datas.Details.forEach(function (item) {
                    // console.log(item.NOMOR_SERVICE)
                    execute({
                        procedure: "NG2_PARTRECEIVING_DETAIL_INSERT",
                        params: {
                            No_PR: NoPR,
                            No_Invoice: item.NO_INVOICE,
                            PartID: item.PARTID,
                            Quantity: item.QUANTITY
                        }
                    });
                });
            })
            .step("insertStock", function (execute, data) {
                var NoPR = data.getNoPR[0][0][0][''];
                datas.Details.forEach(function (item) {
                    execute({
                        procedure: "NG2_STOCK_INSERT",
                        params: {
                            KODE_BASS: datas.KodeBass,
                            PARTID: item.PARTID,
                            NO_INVOICE: item.NO_INVOICE,
                            TANGGAL: datas.dateTrx,
                            DESCRIPTION: 'Diterima dari Part Receiving : ' + NoPR,
                            QUANTITY: item.QUANTITY,
                            KODE_FINISHING: '',
                        }
                    });
                });
            })
            .end(function (result) {
                result.transaction.commit();
                httpMsgs.sendJson(req, resp, result.sets.getNoPR[0][0][0]['']);
            })
            .error(function (err) {
                httpMsgs.show500(req, resp, err);
            });
    })
}; 
