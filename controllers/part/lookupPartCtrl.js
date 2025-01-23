var db = require("../../core/db");
var httpMsgs = require("../../core/httpMsgs");
// sign with default (HMAC SHA256) 
var jwt = require('jsonwebtoken');
var sqlSer = require('seriate');
var settings = require("../../settings");
var base64 = require('base64-arraybuffer');

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

exports.getBassUnderCabang = function (req, resp) {
    var kode_bass = req.body.kode_bass
    var kodebasstxt = req.body.kodebasstxt

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_BASS_SELECT_UNDER_CABANG",
            params: {
                KODE_BASS: kode_bass,
                KODE_NAMA_BASS: '%' + kodebasstxt + '%'
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

exports.getSparepartList = function (req, resp) {
    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_SPAREPART_SELECT_ALL '%%'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });
};

exports.getPRList = function (req, resp) {
    var kode_bass = req.body.kodebass
    var tgldari = req.body.tgldari
    var tglsampai = req.body.tglsampai

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_PARTRECEIVING_SELECT '%%','" + kode_bass + "','" + tgldari + "','" + tglsampai + "'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.getPRListbyKode = function (req, resp) {
    var nopr = req.body.nopr;
    var kode_bass = req.body.kodebass

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        // executeSqlP(db, "EXEC PARTRECEIVING_GET '" + nopr + "'")
        //     .then(data => httpMsgs.sendJson(req, resp, data))
        //     .catch(err => httpMsgs.show500(req, resp, err));
        executeSqlP(db, "exec NG2_PARTRECEIVING_GET '" + nopr + "'")
            .then(data =>
                Promise.all(data.map(header =>
                    executeSqlP(db, "exec NG2_INVOICE_SELECT_UNION '" + header.NO_PR + "', '" + kode_bass + "'")
                        .then(details =>
                            ({
                                NO_PR: header.NO_PR,
                                TANGGAL: header.TANGGAL,
                                CATATAN: header.CATATAN,
                                DETAILS: details.map(detail =>
                                    ({
                                        Select_CheckBox: detail.Select_CheckBox,
                                        NO_INVOICE: detail.NO_INVOICE,
                                        PARTID: detail.PARTID,
                                        Part_Name: detail.Part_Name,
                                        QUANTITY: detail.QUANTITY,
                                        NO_PO: detail.NO_PO,
                                        NO_CLAIM: detail.NO_CLAIM
                                    })
                                )
                            })
                        )
                ))
            )
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.getPOList = function (req, resp) {
    var kode_bass = req.body.kodebass
    var tgldari = req.body.tgldari
    var tglsampai = req.body.tglsampai

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_PARTORDER_SELECT '%%','" + kode_bass + "','" + tgldari + "','" + tglsampai + "'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });
};

exports.getServiceList = function (req, resp) {
    var kode_bass = req.body.kodebass
    var tgldari = req.body.tgldari
    var tglsampai = req.body.tglsampai

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_SERVICE_PENDING_SELECT '%%','" + kode_bass + "','" + tgldari + "','" + tglsampai + "'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });
};


exports.getServiceListbyKode = function (req, resp) {
    var kodeservice = req.body.kodeservice

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_SERVICE_GET '" + kodeservice + "'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};


exports.getPOListbyKode = function (req, resp) {
    var nopo = req.body.nopo

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_PARTORDER_GET '" + nopo + "'")
            .then(data =>
                Promise.all(data.map(header =>
                    executeSqlP(db, "exec NG2_PARTORDER_SELECT_DETAIL '" + header.NO_PO + "'")
                        .then(details =>
                            ({
                                NO_PO: header.NO_PO,
                                TANGGAL: header.TANGGAL,
                                KODE_BASS: header.KODE_BASS + " - " + header.NAMA_BASS,
                                KODE_TIPE_PO: header.KODE_TIPE_PO,
                                NOMOR_SERVICE: header.NOMOR_SERVICE,
                                CATATAN: header.CATATAN,
                                DETAILS: details.map(detail =>
                                    ({
                                        Part_ID: detail.kode_sparepart,
                                        Part_Name: detail.nama_sparePart,
                                        QUANTITY: detail.QUANTITY,
                                        Harga: detail.Harga
                                    })
                                )
                            })
                        )
                ))
            )
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });


};

exports.getSparepartListbyKode = function (req, resp) {
    var kdsparepart = req.body.kdsparepart
    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_SPAREPART_SELECT_ALL '" + kdsparepart + "'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });


};

exports.getStockSelect = function (req, resp) {
    var kode_bass = req.body.kodebass
    var object_detail = req.body.objectDetail

    // sqlSer.getPlainContext(settings.dbConfig)
    //     .step("getStock", function (execute, data) {
    //         object_detail.forEach(function (item) {
    //             execute({
    //                 procedure: "STOCK_SELECT",
    //                 params: {
    //                     KODE_BASS: kode_bass,
    //                     KODE_PART: item.PartID
    //                 }
    //             });
    //         });
    //     })
    //     .end(function (result) {
    //         console.log(result);
    //         httpMsgs.sendJson(req, resp, req.body + " updated !");
    //     })
    //     .error(function (err) {
    //         httpMsgs.show500(req, resp, err);
    //     });
    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
        Promise.all(object_detail.map(details =>
            executeSqlP(db, "exec NG2_STOCK_SELECT '" + kode_bass + "','" + details.PartID.trim() + "'")
                .then(detail =>
                    ({
                        Part_ID: detail[0].KD_PART,
                        Stock_Cabang: detail[0].Stock_Cabang,
                        Stock_Pusat: detail[0].Stock_Pusat
                    })
                )
        ))
            .then(hddt => httpMsgs.sendJson(req, resp, hddt))
            .catch(err => httpMsgs.show500(req, resp, err));
    })
};

exports.getBarangList = function (req, resp) {

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_BARANG_SELECT_FOR_PO '%%','%%','',''")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.getExplodedHeaderList = function (req, resp) {
    var kodebarang = req.body.kodebarang
    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_SPAREPART_HEADER_SELECT '" + kodebarang + "'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.getExplodedDetailList = function (req, resp) {
    var kodepart = req.body.kodepart
    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_SPAREPART_DETAIL_SELECT '" + kodepart + "'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.getExplodedImage = function (req, resp) {
    var kodepart = req.body.kodepart
    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_SPAREPART_IMAGE_SELECT '" + kodepart + "'")
            .then(data => { httpMsgs.sendJson(req, resp, base64.encode(data[0].gambar)) })
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.getBassList = function (req, resp) {
    var kdbass = req.body.kdbass;

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_BASS_SELECT '%" + kdbass + "%','%" + kdbass + "%'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.getBassListAll = function (req, resp) {
    var kdbass = req.body.kdbass;

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "exec NG2_BASS_CABANG_SELECT '%" + kdbass + "%','%" + kdbass + "%'")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};