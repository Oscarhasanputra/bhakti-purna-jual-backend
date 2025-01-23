var db = require("../../core/db");
var httpMsgs = require("../../core/httpMsgs");
// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var settings = require("../../settings");
var loginCtrl = require("../../controllers/login/loginCtrl");
var sqlSer = require('seriate');
var CryptoJS = require('crypto-js');

// declare global secret number
var secretNumber = 'mishirin';

var isAuth = function (req, resp, callback) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        jwt.verify(token, 'jwtsecret', function (err, decoded) {
            if (err) {
                httpMsgs.showErrorExpired(req, resp, err);
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

//Login Karyawan
exports.Cek_Login = function (req, resp) {
    var KodeBass = ""
    var KodeRole = ""
    try {
        if (req.body.username != undefined) {
            sqlSer.setDefault(settings.dbConfig)
            sqlSer.getPlainContext()
                .step("mAuth", {
                    procedure: "NG2_KARYAWAN_CEK_LOGIN",
                    params: {
                        KODE_BASS: req.body.kode_bass,
                        USERNAME: req.body.username,
                        PASSWORD: loginCtrl.Encrypt(req.body.password)
                    }
                })
                .step("encryptmAuth", function (execute, data) {

                    if (data.mAuth[0][0][0]) {
                        var token = jwt.sign(data.mAuth[0][0][0], 'jwtsecret', { // melakukan generate token di jwt
                            algorithm: 'HS256',
                            expiresIn: 21600
                        });
                        data.mAuth[0][0][0].TOKEN = token
                        data.mAuth[0][0][0].TYPE = data.mAuth[0][0][0].TYPE == 'C' ? 'Cabang' : 'Bass'

                        KodeBass = data.mAuth[0][0][0].KODE_BASS
                        KodeRole = data.mAuth[0][0][0].KODE_ROLE

                        // console.log(data.mAuth[0][0][0])
                        // Encrypt
                        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data.mAuth[0][0][0]), secretNumber);
                        data.mAuth[0][0][0] = { mAuth: ciphertext.toString() }


                        // let bytes = CryptoJS.AES.decrypt("U2FsdGVkX184KdlcLupl+ld1s+s4SvknEwI0lc4Jzgaiz6vK+bFkI9Ag7vat8FfMjmShKbdfHYfCk2AzXeScgWTeqvmn4k3K95cwnSx/1wgZrplqcV/oE3DMhU+sA8RDn9/I6hIWQlXT/XkjWqf/nyuMuED7A744tfaJQyXk2lmBPrHFbso8pnlqSaPr66EsBoxlqc8Oxt4bKLBnWM/5WDcALnR3pF0Z5QWILbalSmFhJvdPHjvwD50DzOcUuawSabv0fTmlW0knwmNADTN6R0708t5TNDXFxQyCVRpjczSmDBXVYGt9Pp0WGPoW8SIyh+l/NpYLEF35qq5qkWGWTxmsib3ir5tOhs/qf3LydG+TmRxg2t8ZYXKZ8C4Fz5YfXSiGBZgD8lNd8u9KJWlxj1MNCcDx2wHu2SjOTcl2c05ootXxMqAeEiQ0SrpJEWTAcYwgJGXte9ZeRYTtI1Cp3zgmHISTcNdX9lxsApew0nQsYSKYJ/ert050KnnmUF2AtK84LxuXIPQKNeEQ/6L54FOHlnTiJTsNkHSHKiUZ+O7W0nYu27Xzc2Y/ocY3QDukn6X/st5QI4Bc46OUHrlSAaSo19/dqgAXZRSPzNLA1MS0ZGFC9YyBR+F4cUvkOfzefhWLL6HKRoQ9QYe9lwstsweYfuFGe1RYpXscZt5FB2oZVhQl2TWPSJmrv9UtceCr1ZQW937gq+9hHqIz1Cb0iQ==", 'mishirin');
                        // let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                        // console.log(ciphertext.toString())
                        // console.log("byte",bytes)
                        // console.log("decr",decryptedData)
                    } else {
                        throw new Error("Salah Password");
                    }
                })
                .step("mBass", function (execute, data) {
                    // var KodeBass = data.mAuth[0][0][0].KODE_BASS
                    execute({
                        procedure: "NG2_BASS_GET",
                        params: {
                            KODE_BASS: KodeBass
                        }
                    });
                })
                .step("encryptmBass", function (execute, data) {
                    if (data.mBass[0][0][0]) {
                        // Encrypt
                        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data.mBass[0][0][0]), secretNumber);
                        data.mBass[0][0][0] = { mBass: ciphertext.toString() }
                    }
                })
                .step("mRole", function (execute, data) {
                    execute({
                        procedure: "NG2_ROLE_DETAIL_SELECT",
                        params: {
                            KODE_ROLE: KodeRole
                        }
                    });
                })
                .step("encryptmRole", function (execute, data) {
                    if (data.mRole[0][0]) {
                        // Encrypt
                        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data.mRole[0][0]), secretNumber);
                        data.mRole[0][0] = { mRole: ciphertext.toString() }
                    }
                })
                .step("mParameter", function (execute, data) {
                    execute({
                        procedure: "NG2_PARAMETER_SYSTEM_GET"
                    });
                })
                .step("encryptmParameter", function (execute, data) {
                    if (data.mParameter[0][0][0]) {
                        // Encrypt
                        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data.mParameter[0][0][0]), secretNumber);
                        data.mParameter[0][0][0] = { mParameter: ciphertext.toString() }
                    }
                })
                .end(function (result) {
                    httpMsgs.sendJson(req, resp, result);
                })
                .error(function (err) {
                    console.log("error")
                    console.log(err)
                    if (err.toString().indexOf("Salah Password") >= 0) {
                        httpMsgs.show511(req, resp, 'Username / Password salah, cek kembali');
                    } else {
                        httpMsgs.show500(req, resp, err);
                    }
                });
            // db.executeSql("exec NG2_KARYAWAN_CEK_LOGIN '" + req.body.kode_bass + "', '" + req.body.username + "', '" + Encrypt(req.body.password) + "'", function (data, err) {
            //     if (err) {
            //         httpMsgs.show500(req, resp, err);
            //     } else {
            //         if (data.length == 0) {
            //             httpMsgs.show500(req, resp, 'Username / Password salah, cek kembali');
            //         } else {
            //             var token = jwt.sign(data[0], 'jwtsecret', { // melakukan generate token di jwt
            //                 algorithm: 'HS256',
            //                 expiresIn: 21600
            //             });
            //             data[0].TOKEN = token;
            //             httpMsgs.sendJson(req, resp, data);
            //         }
            //     };
            // });
        } else {
            throw new Error("Input not valid");
        }
    } catch (error) {
        // console.log(error);
        httpMsgs.show500(req, resp, error);
    }
};


// //Ambil data bass (Sudah)
// exports.Get_Detail = function (req, resp) {
//     try {
//         isAuth(req, resp, function (flag) {
//             db.executeSql("exec NG2_BASS_GET '" + req.body.kode_bass + "'", function (data, err) {
//                 if (err) {
//                     httpMsgs.show500(req, resp, err);
//                 } else {
//                     httpMsgs.sendJson(req, resp, data);
//                 };
//             });
//         });
//     } catch (error) {
//         console.log(error);
//     }
// };


// //Ambil data role
// exports.Get_RoleDetail = function (req, resp) {
//     try {
//         isAuth(req, resp, function (flag) {
//             db.executeSql("exec NG2_ROLE_DETAIL_SELECT '" + req.body.kode_role + "'", function (data, err) {
//                 if (err) {
//                     httpMsgs.show500(req, resp, err);
//                 } else {
//                     // console.log(data);
//                     httpMsgs.sendJson(req, resp, data);
//                 };
//             });
//         });
//     } catch (error) {
//         console.log(error);
//     }
// };

//Ambil data parameter
exports.Get_SystemParameter = function (req, resp) {
    try {
        isAuth(req, resp, function (flag) {
            db.executeSql("exec NG2_PARAMETER_SYSTEM_GET", function (data, err) {
                if (err) {
                    httpMsgs.show500(req, resp, err);
                } else {
                    // console.log(data);
                    httpMsgs.sendJson(req, resp, data);
                };
            });
        });
    } catch (error) {
        console.log(error);
    }
};

//Ambil menu
exports.Get_Menu = function (req, resp) {
    try {
        isAuth(req, resp, function (flag) {
            db.executeSql("exec NG2_KARYAWAN_GET_MENU '" + req.body.kode_role + "'", function (data, err) {
                if (err) {
                    httpMsgs.show500(req, resp, err);
                } else {
                    // console.log(data);
                    httpMsgs.sendJson(req, resp, data);
                };
            });
        });
    } catch (error) {
        console.log(error);
    }
};

exports.changePassword = function (req, resp) {
    sqlSer.getTransactionContext(settings.dbConfig)
        .step("checkOldPass", {
            procedure: "NG2_KARYAWAN_CHECK_PASSWORD",
            params: {
                KODE_BASS: req.body.kode_bass,
                USERNAME: req.body.username,
                PASSWORD: loginCtrl.Encrypt(req.body.oldpassword)
            }
        })
        .step("changePassword", function (execute, data) {
            if (data.checkOldPass[0][0][0] != null) {
                execute({
                    procedure: "NG2_KARYAWAN_RESET_PASSWORD",
                    params: {
                        KODE_BASS: req.body.kode_bass,
                        USERNAME: req.body.username,
                        PASSWORD: loginCtrl.Encrypt(req.body.newpassword)
                    }
                });
            }
            else {
                throw new Error('Password Lama Anda Salah');
            }
        })
        .end(function (result) {
            result.transaction.commit();
            httpMsgs.sendJson(req, resp, "Password " + req.body.username + " updated !");
        })
        .error(function (err) {
            httpMsgs.show500(req, resp, err);
        });
};

//Encrypt Password
exports.Encrypt = function (text) {
    const secret = 'mishirin';
    const algorithm = 'aes-256-cbc';
    try {
        var cipher = crypto.createCipher(algorithm, secret);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return (crypted);
    } catch (error) {
        console.log(error);
    }
}

//Decrypt Password
Decrypt = function (text) {
    const secret = 'mishirin';
    const algorithm = 'aes-256-cbc';
    try {
        var decipher = crypto.createDecipher(algorithm, secret);
        var dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return (dec);
    } catch (error) {
        console.log(error);
    }
}
//for reset password master karyawan
exports.randomString = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.saveSetting = function (req, resp) {
    sqlSer.getTransactionContext(settings.dbConfig)
        .step("saveSetting", function (execute, data) {
            execute({
                procedure: "NG2_PARAMETER_SYSTEM_UPDATE",
                params: {
                    WEB_TITLE: req.body.web_title,
                    REPORT_SERVER_PATH: req.body.report_server_path,
                    EXPIRED_PO_DATE: req.body.expired_po_date,
                    BASS_PUSAT: req.body.bass_pusat,
                    EMAIL_PORT: req.body.email_port,
                    EMAIL_SMTP: req.body.email_smtp,
                    EMAIL_USERNAME: req.body.email_username,
                    EMAIL_PASSWORD: req.body.email_password,
                    EMAIL_SERVICE: req.body.email_service
                }
            });
        })
        .end(function (result) {
            result.transaction.commit();
            httpMsgs.sendJson(req, resp, "Setting updated !");
        })
        .error(function (err) {
            httpMsgs.show500(req, resp, err);
        });
};