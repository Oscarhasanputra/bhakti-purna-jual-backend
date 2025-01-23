var httpMsgs = require("../../core/httpMsgs");
// sign with default (HMAC SHA256) 
var jwt = require('jsonwebtoken');
var settings = require("../../settings");
var sqlSer = require('seriate');
const nodemailer = require('nodemailer');
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

// Fungsi ini diperlukan untuk service request -- mulai disni

// [NG2_MEREK_SELECT]
exports.getMerek = function (req, resp) {
    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_MEREK_SELECT",
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_JENIS_SELECT]
exports.getJenis = function (req, resp) {
    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_JENIS_SELECT",
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_BARANG_SELECT]
exports.getBarang = function (req, resp) {
    var kodeBarang = "%" + req.body.kodeBarang + "%"
    var merk = req.body.merk
    var jenis = req.body.jenis

    // console.log("exec NG2_BARANG_SELECT '" + kodeBarang + "', '" + merk + "', '" + jenis + "'")

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_BARANG_SELECT",
            params: {
                KODE_BARANG: kodeBarang,
                MEREK: merk,
                JENIS: jenis,
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_PARAMETER_SYSTEM_GET] <== ada di file loginCtrl.js

// [NG2_GET_NEAREST_BASS]
exports.getNearestBass = function (req, resp) {
    var kodeCustomer = req.body.kodeCustomer
    var kodeBass = req.body.kodeBass
    var isAdmin = req.body.isAdmin

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_GET_NEAREST_BASS",
            params: {
                KODE_CUSTOMER: kodeCustomer,
                KODE_BASS: kodeBass,
                IS_ADMIN: isAdmin
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// NG2_BASS_GET <== ada di file loginCtrl.js

// [NG2_KERUSAKAN_SORT_SELECT]
exports.getKerusakan = function (req, resp) {
    var kodeBarang = req.body.kodeBarang

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_KERUSAKAN_SORT_SELECT",
            params: {
                KODE_BARANG: kodeBarang
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_KOTA_GET]
exports.getKota = function (req, resp) {
    var kodeKota = req.body.kodeKota

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_KOTA_GET",
            params: {
                KODE_KOTA: kodeKota
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_CUSTOMER_GET_SERVICE]
exports.getCustomerService = function (req, resp) {
    var filter = "%" + req.body.filter + "%"
    var zona = req.body.zona
    var kodeBass = req.body.kodeBass

    // console.log("exec NG2_CUSTOMER_GET_SERVICE '" + filter + "','" + zona + "','" + kodeBass + "'")

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_CUSTOMER_GET_SERVICE",
            params: {
                KODE_NAMA_TELP_HP_CUSTOMER: filter,
                ZONA: zona,
                KODE_BASS: kodeBass,
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_KOTA_SELECT] <== ada di file masterCtrl.js
// [NG2_ZONA_LIST] <== ada di file zonaCtrl.js

// [NG2_SERVICE_GET]
exports.getService = function (req, resp) {
    var kodeService = req.body.kodeService

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_SERVICE_GET",
            params: {
                KODE_SERVICE: kodeService,
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_CUSTOMER_GET]
exports.getCustomer = function (req, resp) {
    var kodeCustomer = req.body.kodeCustomer

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_CUSTOMER_GET",
            params: {
                KODE_CUSTOMER: kodeCustomer,
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_BARANG_GET]
exports.getBarangByKode = function (req, resp) {
    var kodeBarang = req.body.kodeBarang

    // console.log("exec NG2_BARANG_GET '" + kodeBarang + "'")

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_BARANG_GET",
            params: {
                KODE_BARANG: kodeBarang,
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_GET_HARGA]
exports.getHarga = function (req, resp) {
    var kodeBarang = req.body.kodeBarang
    var jenis = req.body.jenis
    var merk = req.body.merk

    // console.log(req.body)

    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_GET_HARGA",
            params: {
                KODE_BARANG: kodeBarang,
                KODE_JENIS: jenis,
                KODE_MERK: merk
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_SERVICE_UPDATE]
exports.serviceUpdate = function (req, resp) {
    try {
        isAuth(req, resp, function (flag) {
            sqlSer.execute(settings.dbConfig, {
                procedure: "NG2_SERVICE_UPDATE",
                params: {
                    KODE_SERVICE: req.body.kodeService,
                    JAM_MASUK: req.body.jamMasuk,
                    KODE_CUSTOMER: req.body.kodeCustomer,
                    KODE_PRODUK: req.body.kodeProduk,
                    NOMOR_SERI: req.body.nomorSeri,
                    TANGGAL_BELI: dateFormat(req.body.tanggalBeli, "yyyy-mm-dd HH:MM:ss"),
                    KODE_BASS: req.body.kodeBass,
                    JENIS_SERVICE: req.body.jenisService,
                    STATUS_PRODUK: req.body.statusProduk,
                    KODE_PENGADUAN: req.body.kodePengaduan,
                    KELENGKAPAN: req.body.kelengkapan,
                    CATATAN: req.body.catatan,
                    BIAYA: req.body.biaya,
                    NOMOR_NOTA: req.body.nomorNota
                }
            }).then(function (data) {
                //data is the query result set
                httpMsgs.sendJson(req, resp, { "status": "sukses", "kode_service": req.body.kodeService });
            }, function (err) {
                httpMsgs.show500(req, resp, err);
            });
        });
    } catch (error) {
        httpMsgs.show500(req, resp, error);
    }
};

// [NG2_ZONA_DETAIL_GET] <== Ada di file zonaCtrl.js

// [NG2_SERVICE_INSERT]
exports.serviceInsert = function (req, resp) {
    // console.log("exec NG2_SERVICE_AUTOINCREMENT '" + req.body.kodeBass + "', '" + req.body.tanggal + "'")
    try {
        isAuth(req, resp, function (flag) {
            // console.log(req.body)
            sqlSer.getTransactionContext(settings.dbConfig)
                .step("getKodeService", {
                    procedure: "NG2_SERVICE_AUTOINCREMENT",
                    params: {
                        KODE_BASS: req.body.kodeBass,
                        TANGGAL: dateFormat(req.body.tanggal, "yyyy-mm-dd HH:MM:ss")
                    }
                })
                .step("insertService", function (execute, data) {
                    var kodeService = data.getKodeService[0][0][0];
                    execute({
                        procedure: "NG2_SERVICE_INSERT",
                        params: {
                            KODE_SERVICE: kodeService.kodeService,
                            TANGGAL: dateFormat(req.body.tanggal, "yyyy-mm-dd"),
                            JAM_MASUK: req.body.jamMasuk,
                            KODE_CUSTOMER: req.body.kodeCustomer,
                            KODE_PRODUK: req.body.kodeProduk,
                            NOMOR_SERI: req.body.nomorSeri,
                            TANGGAL_BELI: dateFormat(req.body.tanggalBeli, "yyyy-mm-dd"),
                            KODE_BASS: req.body.kodeBass,
                            JENIS_SERVICE: req.body.jenisService,
                            STATUS_PRODUK: req.body.statusProduk,
                            KODE_PENGADUAN: req.body.kodePengaduan,
                            KELENGKAPAN: req.body.kelengkapan,
                            CATATAN: req.body.catatan,
                            BIAYA: req.body.biaya,
                            STATUS: req.body.status,
                            INPUTTED_BY: req.body.inputtedby,
                            INPUTTED_BY_BASS: req.body.inputtedbyBass,
                            INPUTTED_DATE: dateFormat(req.body.inputtedDate, "yyyy-mm-dd HH:MM:ss"),
                            NOMOR_NOTA: req.body.nomorNota
                        }
                    });
                })
                .end(function (result) {
                    result.transaction.commit();
                    var kodeService = result.sets.getKodeService[0][0][0]
                    httpMsgs.sendJson(req, resp, { "status": "sukses", "kode_service": kodeService.kodeService });
                })
                .error(function (err) {
                    httpMsgs.show500(req, resp, err);
                });
        });
    } catch (error) {
        httpMsgs.show500(req, resp, error);
    }


};

// NG2_SERVICE_SELECT
exports.getServiceList = function (req, resp) {
    var kodeService = "%" + req.body.kodeService + "%"
    var kodeBass = req.body.kodeBass
    var dari = req.body.dari
    var sampai = req.body.sampai
    var type = req.body.type
    var nomorNota = "%" + req.body.nomorNota + "%"

    isAuth(req, resp, function (flag) {

        if (dari == "" && sampai == "") {
            sqlSer.execute(settings.dbConfig, {
                procedure: "NG2_SERVICE_SELECT",
                params: {
                    KODE_SERVICE: kodeService,
                    KODE_BASS: kodeBass,
                    TYPE: type,
                    NOMOR_NOTA: nomorNota
                }
            }).then(function (data) {
                //data is the query result set
                httpMsgs.sendJson(req, resp, data[0][0]);
            }, function (err) {
                httpMsgs.show500(req, resp, err);
            });
        } else {
            sqlSer.execute(settings.dbConfig, {
                procedure: "NG2_SERVICE_SELECT",
                params: {
                    KODE_SERVICE: kodeService,
                    KODE_BASS: kodeBass,
                    DARI: dateFormat(dari, "yyyy-mm-dd"),
                    SAMPAI: dateFormat(sampai, "yyyy-mm-dd"),
                    TYPE: type,
                    NOMOR_NOTA: nomorNota
                }
            }).then(function (data) {
                //data is the query result set
                httpMsgs.sendJson(req, resp, data[0][0]);
            }, function (err) {
                httpMsgs.show500(req, resp, err);
            });
        }
    });
};

exports.sendMail = function (req, resp) {
    isAuth(req, resp, function (flag) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: req.body.Email_SMTP, // 'smtp.gmail.com',
            port: req.body.Email_Port, // 465,
            secure: true, // secure:true for port 465, secure:false for port 587
            auth: {
                user: req.body.Email_Username, // 'username@example.com',
                pass: req.body.Email_Password // 'userpass'
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: req.body.Email_Username, // '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
            to: req.body.mailTo, // 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
            subject: req.body.mailSubject, // 'Hello ✔', // Subject line
            // text: 'Hello world ?', // plain text body
            html: req.body.mailBody // '<b>Hello world ?</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // return console.log(error);
                return httpMsgs.show500(req, resp, { status: "failed", response: error });
            }
            // console.log(info.response.toString.indexOf("OK"))
            httpMsgs.sendJson(req, resp, { status: "ok", "messageId": info.messageId, "response": info.response });
        });
    });
}

// berakhir disni