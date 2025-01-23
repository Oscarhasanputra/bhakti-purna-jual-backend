var db = require("../../core/db");
var httpMsgs = require("../../core/httpMsgs");
// sign with default (HMAC SHA256) 
var jwt = require('jsonwebtoken');
var sqlSer = require('seriate');
var settings = require("../../settings");
var nodemailer = require('nodemailer'); //for send email
var smtpTransport = require('nodemailer-smtp-transport'); //for send email
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


exports.getTipePO = function (req, resp) {

    isAuth(req, resp, function (flag) {
        var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
            db.executeSql(sql, function (data, err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        executeSqlP(db, "SELECT * FROM MASTER_TYPE_PO")
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};

exports.getAutonumberNoPO = function (req, resp) {
    var tgl = req.body.tgl;
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

        executeSqlP(db, "EXEC NG2_PARTORDER_AUTOINCREMENT '" + kode_bass + "','" + tgl + "'")
            .then(detail =>
                ({
                    No_PO: detail[0]['']
                })
            )
            .then(data => httpMsgs.sendJson(req, resp, data))
            .catch(err => httpMsgs.show500(req, resp, err));
    });

};


exports.savePO = function (req, resp) {
    var datas = req.body;
    var now = new Date();

    // isAuth(req, resp, function (flag) { });

    // var executeSqlP = (db, sql) => new Promise((resolve, reject) => {
    //     db.executeSql(sql, function (data, err) {
    //         if (err) {
    //             return reject(err);
    //         }
    //         resolve(data);
    //     });
    // });

    //  executeSqlP(db, "exec PARTORDER_HEADER_INSERT '"+data.NoPO+"','"+data.dateTrx+"','"+data.KodeBass+"','"+data.catatan+"','New','"+data.selectedTipePO+"','"+data.KODE_SERVICE+"','"+data.KodeKaryawan+"','"+data.KodeBass+"','"+now+"'")
    //         .then(data => 
    //             Promise.all(data.map(header => 
    //                 executeSqlP(db, "exec PARTORDER_DETAIL_INSERT '" + data.NoPO + "','" + data.Part_ID + "','" + data.QUANTITY + "'")
    //                 .then(details =>
    //                     ({
    //                         NO_PO: header.NO_PO,
    //                         TANGGAL: header.TANGGAL,
    //                         KODE_BASS: header.KODE_BASS +" - "+ header.NAMA_BASS,
    //                         KODE_TIPE_PO: header.KODE_TIPE_PO,
    //                         NOMOR_SERVICE: header.NOMOR_SERVICE,
    //                         CATATAN: header.CATATAN,
    //                         DETAILS: details.map(detail => 
    //                             ({
    //                                 Part_ID:detail.kode_sparepart, 
    //                                 Part_Name:detail.nama_sparePart,
    //                                 QUANTITY: detail.QUANTITY,
    //                                 Harga: detail.Harga
    //                             })
    //                     )})
    //                 )
    //             ))
    //         )
    //     .then(data => httpMsgs.sendJson(req, resp, data))
    //     .catch(err => httpMsgs.show500(req, resp, err));
    isAuth(req, resp, function (flag) {
        sqlSer.getTransactionContext(settings.dbConfig)
            .step("getNoPO", {
                procedure: "NG2_PARTORDER_AUTOINCREMENT",
                params: {
                    KODE_BASS: datas.KodeBass,
                    TANGGAL: dateFormat(datas.dateTrx, "yyyy-mm-dd HH:MM:ss")
                }
            })
            .step("insertHeader", function (execute, data) {
                var NoPO = data.getNoPO[0][0][0][''];
                execute({
                    procedure: "NG2_PARTORDER_HEADER_INSERT",
                    params: {
                        NO_PO: NoPO,
                        TANGGAL: dateFormat(datas.dateTrx, "yyyy-mm-dd HH:MM:ss"),
                        KODE_BASS: datas.KodeBass,
                        CATATAN: datas.catatan,
                        STATUS: 'New',
                        KODE_TIPE_PO: datas.selectedTipePO,
                        NOMOR_SERVICE: datas.KODE_SERVICE,
                        INPUTTED_BY: datas.KodeKaryawan,
                        INPUTTED_BY_BASS: datas.KodeBass,
                        INPUTTED_DATE: dateFormat(datas.dateTrx, "yyyy-mm-dd HH:MM:ss")
                    }
                });
            })
            .step("insertDetails", function (execute, data) {
                var NoPO = data.getNoPO[0][0][0][''];
                datas.Details.forEach(function (item) {
                    // console.log(item.NOMOR_SERVICE)
                    execute({
                        procedure: "NG2_PARTORDER_DETAIL_INSERT",
                        params: {
                            NO_PO: NoPO,
                            PARTID: item.Part_ID,
                            QUANTITY: item.QUANTITY
                        }
                    });
                });
            })
            .end(function (result) {
                result.transaction.commit();
                httpMsgs.sendJson(req, resp, result.sets.getNoPO[0][0][0]['']);
            })
            .error(function (err) {
                httpMsgs.show500(req, resp, err);
            });
    })
};

exports.sendEmail = function (req, resp) {
    var basspusat = req.body.basspusat
    var kodekaryawan = req.body.kodekaryawan
    var kodebasslogin = req.body.kodebass;
    var nopo = req.body.nopo;
    var tgl = dateFormat(req.body.tgl, "yyyy-mm-dd' 'HH:MM:ss");
    var details = req.body.details
    var detailvaluestring = ''
    var detailheaderstring = ''
    var detailhtmlstring = ''

    isAuth(req, resp, function (flag) {
        detailheaderstring = '<tr>' +
            '<th>Kode Part</th>' +
            '<th>Nama Part</th>' +
            '<th>Quantity</th>' +
            '<th>Harga</th>' +
            '</tr>'

        details.forEach(function (item) {
            detailvaluestring = detailvaluestring + '<tr>' +
                '<td>' + item.Part_ID + '</td>' +
                '<td>' + item.Part_Name + '</td>' +
                '<td>' + item.QUANTITY + '</td>' +
                '<td>' + item.Harga + '</td>' +
                '</tr>'
        })
        detailhtmlstring = detailheaderstring + detailvaluestring

        sqlSer.getTransactionContext(settings.dbConfig)
            .step("Get_GeneralSetting", {
                procedure: "NG2_PARAMETER_SYSTEM_GET"
            })
            .step("Get_Nearest_Cabang", {
                procedure: "NG2_GET_NEAREST_CABANG",
                params: {
                    KODE_BASS: kodebasslogin
                }
            })
            .step("Get_Bass", function (execute, data) {
                execute({
                    procedure: "NG2_BASS_GET",
                    params: {
                        KODE_BASS: data.Get_Nearest_Cabang[0][0][0]['']
                    }
                });
            })
            .step("sendMail", function (execute, data) {
                var Kode_CabangOrBass = data.Get_Nearest_Cabang[0][0][0][''];

                var EMAIL_USERNAME = data.Get_GeneralSetting[0][0][0]['EMAIL_USERNAME'];
                var EMAIL_PASSWORD = data.Get_GeneralSetting[0][0][0]['EMAIL_PASSWORD'];
                var EMAIL_SERVICE = data.Get_GeneralSetting[0][0][0]['EMAIL_SERVICE'];

                if (Kode_CabangOrBass == basspusat) {
                    var NamaBass = "Bass " + data.Get_Bass[0][0][0]['NAMA_BASS']
                    var EmailTo = data.Get_Bass[0][0][0]['EMAIL']
                } else {
                    var NamaBass = "Cabang " + data.Get_Bass[0][0][0]['NAMA_BASS']
                    var EmailTo = data.Get_Bass[0][0][0]['EMAIL']
                }

                var hasil = [];

                // create reusable transporter object using the default SMTP transport
                var transporter = nodemailer.createTransport(smtpTransport({
                    service: EMAIL_SERVICE,
                    auth: {
                        user: EMAIL_USERNAME, // my mail
                        pass: EMAIL_PASSWORD
                    }
                }));
                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: '"BIT" <' + EMAIL_USERNAME + '>', // sender address
                    to: EmailTo, // list of receivers
                    subject: "Header (" + kodekaryawan + "/" + kodebasslogin + "/" + tgl + ")", // Subject line
                    text: 'Test Email', // plaintext body
                    // replyTo : '',
                    html: `<b>Hello ` + NamaBass + ` </b> 
                        <p>A New Part Order is Requested to you with detail below.</p>
                        <table>
                        <tr>
                        <td>No Part</td>
                        <td>:</td>
                        <td>`+ nopo + `</td>
                        </tr>
                        <tr>
                        <td>Tanggal</td>
                        <td>:</td>
                        <td>`+ tgl + `</td>
                        </tr>
                        <tr>
                        <td>Kode Bass</td>
                        <td>:</td>
                        <td>`+ kodebasslogin + `</td>
                        </tr>
                        </table>
                        <br>
                        <b>Part Order Details</b>
                        <br>
                        <table border="1">
                        `+ detailhtmlstring + `
                        </table>
                        <br><br>Best Regards,<br>
                        BIT WEB SYSTEM`
                };
                //send mail with defined transport object
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        hasil.push(error);
                    } else {
                        hasil.push(info.response);
                    }

                });
                transporter.close();

                // res.json(hasil);
                // console.log('hasil');
                //res.json({ status: "Success", info: info.response });
            })

            .end(function (result) {
                result.transaction.commit();
                httpMsgs.sendJson(req, resp, nopo);
            })
            .error(function (err) {
                httpMsgs.show500(req, resp, err);
            });
    })
}
