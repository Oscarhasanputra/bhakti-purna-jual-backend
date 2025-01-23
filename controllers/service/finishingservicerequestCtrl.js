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

// TEKNISI_SELECT <-- ada di file masterCtrl.js

// PERBAIKAN_SORT_SELECT
exports.getPerbaikan = function (req, resp) {
    // console.log("exec NG2_PERBAIKAN_SORT_SELECT '"+req.body.kodeBarang+"', '"+req.body.namaPenyebab+"', '"+req.body.namaKerusakan+"'")
    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_PERBAIKAN_SORT_SELECT",
            params: {
                KODE_BARANG: req.body.kodeBarang,
                NAMA_KERUSAKAN: req.body.namaKerusakan,
                NAMA_PENYEBAB: req.body.namaPenyebab
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// SERVICE_SELECT <== ada di file serviceCtrl.js

// NG2_BIAYA_TRANSPORTASI_SELECT
exports.getBiayaTransportasi = function (req, resp) {
    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_BIAYA_TRANSPORTASI_SELECT"
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// NG2_INVOICE_SELECT_SERVICE_REQUEST
exports.invoiceServiceRequest = function (req, resp) {
    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_INVOICE_SELECT_SERVICE_REQUEST",
            params: {
                KODE_BASS: req.body.kodeBass,
                KODE_INVOICE: req.body.kodeInvoice,
                KODE_BARANG: req.body.kodeBarang,
                KODE_FINISHING: req.body.kodeFinishing,
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_GET_REVIEW_CLAIM_SERVICE] @KODE_SERVICE
exports.getReviewClainService = function (req, resp) {
    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_GET_REVIEW_CLAIM_SERVICE",
            params: {
                KODE_SERVICE: req.body.kodeService
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_TRANSPORTASI_GET] @KODE_TRANSPORTASI
exports.getTransportasi = function (req, resp) {
    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_TRANSPORTASI_GET",
            params: {
                KODE_TRANSPORTASI: req.body.kodeTransportasi
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_CALCULATE_PPN]
exports.calculatePPN = function (req, resp) {
    isAuth(req, resp, function (flag) {

        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_CALCULATE_PPN",
            params: {
                HARGA_SUKU_CADANG: req.body.hargaSukuCadang,
                HARGA_SERVICE: req.body.hargaService,
                HARGA_TRANSPORT: req.body.hargaTransport,
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_KERUSAKAN_SORT_SELECT] <== udah ada di serviceCtrl.js

// [NG2_PENYEBAB_SORT_SELECT]
exports.getPenyebab = function (req, resp) {
    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_PENYEBAB_SORT_SELECT",
            params: {
                KODE_BARANG: req.body.kodeBarang,
                NAMA_KERUSAKAN: req.body.namaKerusakan
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_DETAIL_SERVICE_REQUEST_GET] @KODE_SERVICE
exports.getDetailServiceRequest = function (req, resp) {
    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_DETAIL_SERVICE_REQUEST_GET",
            params: {
                KODE_SERVICE: req.body.kodeService
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_STOCK_INVOICE_SELECT_BY_KODE_PART_AND_INVOICE]
exports.getStokInvoiceSelectByKodePartAndInvoice = function (req, resp) {
    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_STOCK_INVOICE_SELECT_BY_KODE_PART_AND_INVOICE",
            params: {
                KODE_BASS: req.body.kodeBass,
                KODE_PART: req.body.kodePart,
                NO_INVOICE: req.body.noInvoice,
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_DETAIL_SERVICE_REQUEST_RECEIVED] @KODE_SERVICE
exports.getDetailServiceRequestReceived = function (req, resp) {
    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_DETAIL_SERVICE_REQUEST_RECEIVED",
            params: {
                KODE_SERVICE: req.body.kodeService
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_SPAREPART_SELECT]
exports.getSparepart = function (req, resp) {
    isAuth(req, resp, function (flag) {
        // console.log("exec NG2_SPAREPART_SELECT '"+req.body.kodeBass+"', '"+req.body.kodeBarang+"', '"+"%"+req.body.kodeInvoice+"%"+"', '"+"%"+req.body.kodeSparepart+"%"+"', '"+req.body.jenisService+"', '"+req.body.kodeFinishing+"'")
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_SPAREPART_SELECT",
            params: {
                KODE_BASS: req.body.kodeBass,
                KODE_BARANG: req.body.kodeBarang,
                NOMOR_INVOICE: "%" + req.body.kodeInvoice + "%",
                KODE_SPAREPART: "%" + req.body.kodeSparepart + "%",
                JENIS_SERVICE: req.body.jenisService,
                KODE_FINISHING: req.body.kodeFinishing
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, data[0][0]);
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });
    });
};

// [NG2_SERVICE_FINISHING_EDIT] [NG2_SERVICE_UPDATE_STATUS] [NG2_DETAIL_SERVICE_REQUEST_DELETE]
exports.saveServiceFinishing = function (req, resp) {
    var detail = req.body.dataDetail;

    if (req.body.tanggalKembali != "") {
        req.body.tanggalKembali = dateFormat(req.body.tanggalKembali, "yyyy-mm-dd")
    } else {
        req.body.tanggalKembali = undefined
    }

    sqlSer.getTransactionContext(settings.dbConfig)
        .step("serviceFinishingEdit", {
            procedure: "NG2_SERVICE_FINISHING_EDIT",
            params: {
                KODE_SERVICE: req.body.kodeService,
                TANGGAL_SELESAI: dateFormat(req.body.tanggalSelesai, "yyyy-mm-dd"),
                TANGGAL_KEMBALI: req.body.tanggalKembali,
                KODE_TEKNISI: req.body.kodeTeknisi,
                BIAYA: req.body.biaya,
                BIAYA_TRANSPORT: req.body.biayaTransport,
                BIAYA_PPN: req.body.biayaPPN,
                BIAYA_TOTAL: req.body.biayaTotal,
                NAMA_PERBAIKAN: req.body.perbaikan,
                NAMA_PENYEBAB: req.body.penyebab,
                KODE_TRANSPORTASI: req.body.kodeTransportasi,
                NOMOR_NOTA: req.body.nomorNota,
                NOMOR_SERI: req.body.nomorSeri,
                TANGGAL_BELI: req.body.tanggalBeli,
                KODE_PENGADUAN: req.body.kodePengaduan,
                STATUS_BARANG: req.body.statusProduk,
                DIAMBIL_OLEH: req.body.diambilOleh
            }
        })
        .step("serviceUpdateStatus", function (execute, data) {
            execute({
                procedure: "NG2_SERVICE_UPDATE_STATUS",
                params: {
                    KODE_SERVICE: req.body.kodeService,
                    STATUS: req.body.status
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
};

// [NG2_SERVICE_INSERT_DETAIL]
exports.serviceInsertDetail = function (req, resp) {
    var detail = req.body.data;

    isAuth(req, resp, function (flag) {
        detail.forEach(function (item) {
            // console.log(item)
            sqlSer.execute(settings.dbConfig, {
                procedure: "NG2_SERVICE_INSERT_DETAIL",
                params: {
                    KODE_SERVICE: req.body.kodeService,
                    PARTID: req.body.partID,
                    QTY: req.body.qty,
                    HARGA: req.body.harga,
                    NO_PO: req.body.noPO
                }
            }).then(function (data) {
                //data is the query result set
                httpMsgs.sendJson(req, resp, data[0][0]);
            }, function (err) {
                httpMsgs.show500(req, resp, err);
            });
        });
    });
};

// update status
exports.updateStatus = function (req, resp) {
    isAuth(req, resp, function (flag) {

        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_SERVICE_UPDATE_STATUS",
            params: {
                KODE_SERVICE: req.body.kodeService,
                STATUS: req.body.status
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, { result: "Sukses" });
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });

    });
}

// STOK INSERT
exports.stokInsert = function (req, resp) {
    isAuth(req, resp, function (flag) {

        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_STOCK_INSERT",
            params: {
                KODE_BASS: req.body.kodeBass,
                PARTID: req.body.partID,
                NO_INVOICE: req.body.noInvoice,
                TANGGAL: req.body.tanggal,
                DESCRIPTION: req.body.description,
                QUANTITY: req.body.qty,
                KODE_FINISHING: req.body.kodeFinishing
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, { result: "Sukses" });
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });

    });
}

// [NG2_SERVICE_UPDATE_STATUS] [NG2_SERVICE_ADD_REJECTION_COMMENT]
exports.reject = function (req, resp) {
    sqlSer.getTransactionContext(settings.dbConfig)
        .step("serviceUpdateStatus", {
            procedure: "NG2_SERVICE_UPDATE_STATUS",
            params: {
                KODE_SERVICE: req.body.kodeService,
                STATUS: req.body.status
            }
        })
        .step("serviceAddRejectionComment", function (execute, data) {
            execute({
                procedure: "NG2_SERVICE_ADD_REJECTION_COMMENT",
                params: {
                    KODE_SERVICE: req.body.kodeService,
                    REJECTION_COMMENT: req.body.rejectionComment
                }
            });
        })
        .end(function (result) {
            result.transaction.commit();
            httpMsgs.sendJson(req, resp, result);
        })
        .error(function (err) {
            httpMsgs.show500(req, resp, err);
        });
};

// UPDATE_STATUS_TO_BEFORE_CLAIM_SERVICE
exports.updateStatusBeforeClaimService = function (req, resp) {
    isAuth(req, resp, function (flag) {
        sqlSer.execute(settings.dbConfig, {
            procedure: "NG2_UPDATE_STATUS_TO_BEFORE_CLAIM_SERVICE",
            params: {
                KODE_SERVICE: req.body.kodeService,
            }
        }).then(function (data) {
            //data is the query result set
            httpMsgs.sendJson(req, resp, { result: "Sukses" });
        }, function (err) {
            httpMsgs.show500(req, resp, err);
        });

    });
}