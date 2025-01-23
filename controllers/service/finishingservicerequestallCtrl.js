var httpMsgs = require("../../core/httpMsgs");
var jwt = require('jsonwebtoken');
var settings = require("../../settings");
var sqlSer = require('seriate');
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

exports.saveServiceFinishingAll = function (req, resp) {
    var detail = req.body.dataDetail;

    isAuth(req, resp, function (flag) {
        if (req.body.tanggalKembali != "") {
            req.body.tanggalKembali = dateFormat(req.body.tanggalKembali, "yyyy-mm-dd")
        } else {
            req.body.tanggalKembali = undefined
        }
        // jika baru 
        if (req.body.kodeService == "") {
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
                    // console.log(kodeService.kodeService)
                    execute({
                        procedure: "NG2_SERVICE_FINISHING_All_INSERT",
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
                            NAMA_PERBAIKAN: req.body.perbaikan,
                            NAMA_PENYEBAB: req.body.penyebab,
                            KELENGKAPAN: req.body.kelengkapan,
                            CATATAN: req.body.catatan,
                            BIAYA: req.body.biaya,
                            BIAYA_TRANSPORT: req.body.biayaTransport,
                            BIAYA_PPN: req.body.biayaPPN,
                            BIAYA_TOTAL: req.body.biayaTotal,
                            STATUS: "Done",
                            TANGGAL_SELESAI: dateFormat(req.body.tanggalSelesai, "yyyy-mm-dd"),
                            TANGGAL_KEMBALI: req.body.tanggalKembali,
                            KODE_TEKNISI: req.body.kodeTeknisi,
                            INPUTTED_BY: req.body.inputtedby,
                            INPUTTED_BY_BASS: req.body.inputtedbyBass,
                            INPUTTED_DATE: dateFormat(req.body.inputtedDate, "yyyy-mm-dd HH:MM:ss"),
                            KODE_TRANSPORTASI: req.body.kodeTransportasi,
                            NOMOR_NOTA: req.body.nomorNota,
                            DIAMBIL_OLEH: req.body.diambilOleh
                        }
                    });
                })
                .step("detailServiceRequestDelete", function (execute, data) {
                    execute({
                        procedure: "NG2_DETAIL_SERVICE_REQUEST_DELETE",
                        params: {
                            KODE_SERVICE: req.body.kodeService
                        }
                    });
                })
                .step("serviceInsertDetail", function (execute, data) {
                    detail.forEach(function (item) {
                        // console.log(item)
                        execute({
                            procedure: "NG2_SERVICE_INSERT_DETAIL",
                            params: {
                                KODE_SERVICE: req.body.kodeService,
                                PARTID: item.KD_SPAREPART,
                                QTY: item.QTY,
                                HARGA: item.HARGA,
                                NO_PO: item.NO_INVOICE
                            }
                        });
                    });
                })
                .end(function (result) {
                    result.transaction.commit();
                    httpMsgs.sendJson(req, resp, { result: "Sukses Menyimpan Data", data: result });
                })
                .error(function (err) {
                    httpMsgs.show500(req, resp, err);
                });
        } else {
            // console.log(req.body.status.toUpperCase())
            if (req.body.status == "Rejected") {
                // console.log("service reassign because status rejected before, status : " + req.body.status)
                sqlSer.getTransactionContext(settings.dbConfig)
                    .step("serviceUpdateStatus", function (execute, data) {
                        execute({
                            procedure: "NG2_SERVICE_UPDATE_STATUS",
                            params: {
                                KODE_SERVICE: req.body.kodeService,
                                STATUS: "Closed"
                            }
                        });
                    })
                    .step("getKodeService", {
                        procedure: "NG2_SERVICE_AUTOINCREMENT",
                        params: {
                            KODE_BASS: req.body.kodeBass,
                            TANGGAL: dateFormat(req.body.tanggal, "yyyy-mm-dd HH:MM:ss")
                        }
                    })
                    .step("insertService", function (execute, data) {
                        var kodeService = data.getKodeService[0][0][0];
                        // console.log(kodeService.kodeService)
                        execute({
                            procedure: "NG2_SERVICE_FINISHING_All_INSERT",
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
                                NAMA_PERBAIKAN: req.body.perbaikan,
                                NAMA_PENYEBAB: req.body.penyebab,
                                KELENGKAPAN: req.body.kelengkapan,
                                CATATAN: req.body.catatan,
                                BIAYA: req.body.biaya,
                                BIAYA_TRANSPORT: req.body.biayaTransport,
                                BIAYA_PPN: req.body.biayaPPN,
                                BIAYA_TOTAL: req.body.biayaTotal,
                                STATUS: "Done",
                                TANGGAL_SELESAI: dateFormat(req.body.tanggalSelesai, "yyyy-mm-dd"),
                                TANGGAL_KEMBALI: req.body.tanggalKembali,
                                KODE_TEKNISI: req.body.kodeTeknisi,
                                INPUTTED_BY: req.body.inputtedby,
                                INPUTTED_BY_BASS: req.body.inputtedbyBass,
                                INPUTTED_DATE: dateFormat(req.body.inputtedDate, "yyyy-mm-dd HH:MM:ss"),
                                KODE_TRANSPORTASI: req.body.kodeTransportasi,
                                NOMOR_NOTA: req.body.nomorNota,
                                DIAMBIL_OLEH: req.body.diambilOleh
                            }
                        });
                    })
                    .step("detailServiceRequestDelete", function (execute, data) {
                        execute({
                            procedure: "NG2_DETAIL_SERVICE_REQUEST_DELETE",
                            params: {
                                KODE_SERVICE: req.body.kodeService
                            }
                        });
                    })
                    .step("serviceInsertDetail", function (execute, data) {
                        detail.forEach(function (item) {
                            // console.log(item)
                            execute({
                                procedure: "NG2_SERVICE_INSERT_DETAIL",
                                params: {
                                    KODE_SERVICE: req.body.kodeService,
                                    PARTID: item.KD_SPAREPART,
                                    QTY: item.QTY,
                                    HARGA: item.HARGA,
                                    NO_PO: item.NO_INVOICE
                                }
                            });
                        });
                    })
                    .end(function (result) {
                        result.transaction.commit();
                        var kodeService = result.sets.getKodeService[0][0][0]
                        httpMsgs.sendJson(req, resp, { result: "Sukses Menyimpan Data dan Membuat Service dengan No : " + kodeService.kodeService });
                    })
                    .error(function (err) {
                        httpMsgs.show500(req, resp, err);
                    });
            } else {
                sqlSer.getTransactionContext(settings.dbConfig)
                    .step("insertService", function (execute, data) {
                        execute({
                            procedure: "NG2_SERVICE_FINISHING_All_UPDATE",
                            params: {
                                KODE_SERVICE: req.body.kodeService,
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
                                NAMA_PERBAIKAN: req.body.perbaikan,
                                NAMA_PENYEBAB: req.body.penyebab,
                                KELENGKAPAN: req.body.kelengkapan,
                                CATATAN: req.body.catatan,
                                BIAYA: req.body.biaya,
                                BIAYA_TRANSPORT: req.body.biayaTransport,
                                BIAYA_PPN: req.body.biayaPPN,
                                BIAYA_TOTAL: req.body.biayaTotal,
                                STATUS: "Done",
                                TANGGAL_SELESAI: dateFormat(req.body.tanggalSelesai, "yyyy-mm-dd"),
                                TANGGAL_KEMBALI: req.body.tanggalKembali,
                                KODE_TEKNISI: req.body.kodeTeknisi,
                                INPUTTED_BY: req.body.inputtedby,
                                INPUTTED_BY_BASS: req.body.inputtedbyBass,
                                INPUTTED_DATE: dateFormat(req.body.inputtedDate, "yyyy-mm-dd HH:MM:ss"),
                                KODE_TRANSPORTASI: req.body.kodeTransportasi,
                                NOMOR_NOTA: req.body.nomorNota,
                                DIAMBIL_OLEH: req.body.diambilOleh
                            }
                        });
                    })
                    .step("detailServiceRequestDelete", function (execute, data) {
                        execute({
                            procedure: "NG2_DETAIL_SERVICE_REQUEST_DELETE",
                            params: {
                                KODE_SERVICE: req.body.kodeService
                            }
                        });
                    })
                    .step("serviceInsertDetail", function (execute, data) {
                        detail.forEach(function (item) {
                            // console.log(item)
                            execute({
                                procedure: "NG2_SERVICE_INSERT_DETAIL",
                                params: {
                                    KODE_SERVICE: req.body.kodeService,
                                    PARTID: item.KD_SPAREPART,
                                    QTY: item.QTY,
                                    HARGA: item.HARGA,
                                    NO_PO: item.NO_INVOICE
                                }
                            });
                        });
                    })
                    .end(function (result) {
                        result.transaction.commit();
                        httpMsgs.sendJson(req, resp, { result: "Sukses Menyimpan Data" });
                    })
                    .error(function (err) {
                        httpMsgs.show500(req, resp, err);
                    });
            }
        }
    })
};