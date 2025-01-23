var express = require('express');
var httpMsgs = require("../core/httpMsgs");

//controller for login
var loginCtrl = require("../controllers/login/loginCtrl");

//controller for home
var homeCtrl = require("../controllers/home/homeCtrl");

//controller for master
//centung
var masterkaryawanCtrl = require("../controllers/master/masterkaryawanCtrl");
var masterkotaCtrl = require("../controllers/master/masterkotaCtrl");
var masterzonaCtrl = require("../controllers/master/masterzonaCtrl");
//kevin
var masterBassCtrl = require("../controllers/master/masterBassCtrl");
var masterBassLookUpCtrl = require("../controllers/master/masterBassLookUpCtrl");
var masterCustomerCtrl = require("../controllers/master/masterCustomerCtrl");
var masterTeknisiCtrl = require("../controllers/master/masterTeknisiCtrl");
var masterApplicationCtrl = require("../controllers/master/masterApplicationCtrl");
var masterRoleCtrl = require("../controllers/master/masterRoleCtrl");
var masterTransportasiCtrl = require("../controllers/master/masterTransportasiCtrl");
var masterCabangZonaCtrl = require("../controllers/master/masterCabangZonaCtrl");

// Controller for Service
var serviceRequestCtrl = require("../controllers/service/servicerequestCtrl");
var finishingServiceRequestCtrl = require("../controllers/service/finishingservicerequestCtrl");
var finishingServiceRequestAllCtrl = require("../controllers/service/finishingservicerequestallCtrl");
var claimserviceCtrl = require("../controllers/service/claimserviceCtrl");
var claimlistCtrl = require("../controllers/service/claimlistCtrl");
var reviewclaimCtrl = require("../controllers/service/reviewclaimCtrl");
var paidclaimCtrl = require("../controllers/service/paidclaimCtrl");

//controller for parts
var partCtrl = require("../controllers/part/partCtrl");
var maintainPartCtrl = require("../controllers/part/maintainPartCtrl");
var partReceivingCtrl = require("../controllers/part/partReceivingCtrl");
var invoiceListCtrl = require("../controllers/part/invoiceListCtrl");
var lookupPartCtrl = require("../controllers/part/lookupPartCtrl");

//controller for report
var reportClaimCtrl = require("../controllers/report/reportClaimCtrl");
var reportServiceCtrl = require("../controllers/report/reportServiceCtrl");
var reportFinishingServiceCtrl = require("../controllers/report/reportFinishingServiceCtrl");
var reportLookUpCtrl = require("../controllers/report/reportLookUpCtrl");
var reportRejectedServiceCtrl = require("../controllers/report/reportRejectedServiceCtrl");
var reportPartOrderCtrl = require("../controllers/report/reportPartOrderCtrl");
var reportPartReceivingCtrl = require("../controllers/report/reportPartReceivingCtrl");


module.exports = function (app, express) {
    var router = express();

    // testing connection server
    router.route('/').get(httpMsgs.showHome);

    //start router for login

    // CEK_LOGIN BASS
    router.route('/login').post(loginCtrl.Cek_Login);
    // GET_DETAIL BASS
    // router.route('/get_bassdetail').post(loginCtrl.Get_Detail);
    // GET_ROLE_DETAIL
    // router.route('/get_roledetail').post(loginCtrl.Get_RoleDetail);
    // GET_SYSTEM_PARAMETER
    router.route('/get_systemparam').get(loginCtrl.Get_SystemParameter);
    //Change Password
    router.route('/changepassword').post(loginCtrl.changePassword);
    //Get Menu
    router.route('/get_menu').post(loginCtrl.Get_Menu);
    //Update General Setting
    router.route('/updategeneralsetting').post(loginCtrl.saveSetting);
    //end router for login

    //start router for masters

    //router for master karyawan
    //get role list
    router.route('/role_list').post(masterkaryawanCtrl.getRoleList);
    //get karyawan list
    router.route('/karyawan_list').post(masterkaryawanCtrl.getKaryawanList);
    //get karyawan detail list
    router.route('/karyawan_listdetail').post(masterkaryawanCtrl.getKaryawanListDetail);
    //save karyawan
    router.route('/karyawan_insert').post(masterkaryawanCtrl.saveKaryawan);
    //delete karyawan
    router.route('/karyawan_delete').post(masterkaryawanCtrl.deleteKaryawan);
    //aktifkan karyawan
    router.route('/karyawan_aktif').post(masterkaryawanCtrl.aktifkanKaryawan);
    //reset karyawan
    router.route('/karyawan_resetPass').post(masterkaryawanCtrl.resetPassKaryawan);
    //edit karyawan
    router.route('/Karyawan_edit').post(masterkaryawanCtrl.editKaryawan);

    //router for master zona
    //get zona list
    router.route('/zona_list').post(masterzonaCtrl.getZonaList);
    //save zona 
    router.route('/zona_insert').post(masterzonaCtrl.saveZona);
    //save zona 
    router.route('/zona_delete').post(masterzonaCtrl.deleteZona);
    //edit zona
    router.route('/zona_edit').post(masterzonaCtrl.editZona);

    //router for master kota
    //get kota list
    router.route('/kota_list').post(masterkotaCtrl.getKotaList);
    //get kota
    router.route('/kota_get').post(masterkotaCtrl.getKota);
    //insert kota
    router.route('/kota_insert').post(masterkotaCtrl.saveKota);
    //edit kota
    router.route('/kota_edit').post(masterkotaCtrl.editKota);

    // master/getkota
    router.route('/getKotaSelect').get(masterBassCtrl.getKotaSelect);
    // master/saveTambahBass
    router.route('/saveTambahBass').post(masterBassCtrl.saveTambahBass);
    // master/getListMasterBass
    router.route('/getListMasterBass').post(masterBassCtrl.getListMasterBass);
    // master/getListMasterBass
    router.route('/getBassSingle/:kode_bass').get(masterBassCtrl.getBassSingle);
    // master/updateBass
    router.route('/updateBass').post(masterBassCtrl.updateBass);
    // master/deletebass
    router.route('/deleteBass').post(masterBassCtrl.deleteBass);
    // master/activateBass
    router.route('/activateBass').post(masterBassCtrl.activateBass);
    // master/getListCustomer
    router.route('/getListCustomer').post(masterCustomerCtrl.getListCustomer);
    // master/saveTambahBass
    router.route('/saveTambahCustomer').post(masterCustomerCtrl.saveTambahCustomer);
    // master/deletecustomer
    router.route('/deleteCustomer').post(masterCustomerCtrl.deleteCustomer);
    // master/massdeletecustomer
    router.route('/massDeleteCustomer').post(masterCustomerCtrl.massDeleteCustomer);
    // master/getcustomersingle
    router.route('/getCustomerSingle').post(masterCustomerCtrl.getCustomerSingle);
    // master/updateCustomer
    router.route('/updateCustomer').post(masterCustomerCtrl.updateCustomer);
    // master/getTeknisiList
    router.route('/getTeknisiList').post(masterTeknisiCtrl.getTeknisiList);
    // master/saveTambahTeknisi
    router.route('/saveTambahTeknisi').post(masterTeknisiCtrl.saveTambahTeknisi);
    // master/deleteteknisi
    router.route('/deleteTeknisi').post(masterTeknisiCtrl.deleteTeknisi);
    // master/aktivateteknisi
    router.route('/activateTeknisi').post(masterTeknisiCtrl.activateTeknisi);
    // master/updateteknisi
    router.route('/updateTeknisi').post(masterTeknisiCtrl.updateTeknisi);
    // master/getTeknisiSingle
    router.route('/getTeknisiSingle').post(masterTeknisiCtrl.getTeknisiSingle);
    // master/getAplikasi
    router.route('/getAplikasi').post(masterApplicationCtrl.getMasterApplication);
    // master/getRoleList
    router.route('/getRoleList').post(masterRoleCtrl.getRoleList);
    // master/getRoleDetailList
    router.route('/getRoleDetailList').post(masterRoleCtrl.getRoleDetailList);
    // master/saveTambahRole
    router.route('/saveTambahRole').post(masterRoleCtrl.saveTambahRole);
    // master/updateRole
    router.route('/updateRole').post(masterRoleCtrl.updateRole);
    // master/deleteRole
    router.route('/deleteRole').post(masterRoleCtrl.deleteRole);
    // master/transportasiGet
    router.route('/transportasiGet').post(masterTransportasiCtrl.transportasiGet);
    // master/deleteTransportasi
    router.route('/deleteTransportasi').post(masterTransportasiCtrl.deleteTransportasi);
    // master/saveTambahTransportasi
    router.route('/saveTambahTransportasi').post(masterTransportasiCtrl.saveTambahTransportasi);
    // master/getTransportSingle
    router.route('/getTransportasiSingle').post(masterTransportasiCtrl.getTransportasiSingle);
    // master/updateTransportasi
    router.route('/updateTransportasi').post(masterTransportasiCtrl.updateTransportasi);
    // master/transportasiGet
    router.route('/mappingCabangZonaGet').post(masterCabangZonaCtrl.mappingCabangZonaGet);
    // master/getCabangList
    router.route('/getCabangList/:kode_bass').get(masterCabangZonaCtrl.masterCabangSelect);
    // master/getCabang
    router.route('/getCabang').get(masterCabangZonaCtrl.getCabang);
    // master/getZonaMapping
    router.route('/getZonaMapping').get(masterCabangZonaCtrl.getZonaMapping);
    // master/deleteMappingZona
    router.route('/deleteMappingZona').post(masterCabangZonaCtrl.deleteMappingZona);
    // master/saveMappingZona
    router.route('/saveMappingZona').post(masterCabangZonaCtrl.saveMappingZona);
    //end router for masters


    //start router for service

    // router for service request
    router.route('/getmerek').get(serviceRequestCtrl.getMerek);
    router.route('/getjenis').get(serviceRequestCtrl.getJenis);
    router.route('/getbarang').post(serviceRequestCtrl.getBarang);
    router.route('/getnearestbass').post(serviceRequestCtrl.getNearestBass);
    router.route('/getkerusakan').post(serviceRequestCtrl.getKerusakan);
    router.route('/getkota').post(serviceRequestCtrl.getKota);
    router.route('/getcustomerservice').post(serviceRequestCtrl.getCustomerService);
    router.route('/getservice').post(serviceRequestCtrl.getService);
    router.route('/getcustomer').post(serviceRequestCtrl.getCustomer);
    router.route('/getbarangbykode').post(serviceRequestCtrl.getBarangByKode);
    router.route('/getharga').post(serviceRequestCtrl.getHarga);
    router.route('/serviceupdate').post(serviceRequestCtrl.serviceUpdate);
    router.route('/serviceInsert').post(serviceRequestCtrl.serviceInsert);
    router.route('/getservicelist').post(serviceRequestCtrl.getServiceList);
    router.route('/sendmail').post(serviceRequestCtrl.sendMail);

    // router for finishing service request
    router.route('/getperbaikan').post(finishingServiceRequestCtrl.getPerbaikan);
    router.route('/getbiayatransportasi').post(finishingServiceRequestCtrl.getBiayaTransportasi);
    router.route('/invoiceservicerequest').post(finishingServiceRequestCtrl.invoiceServiceRequest);
    router.route('/getreviewclaimservice').post(finishingServiceRequestCtrl.getReviewClainService);
    router.route('/gettransportasi').post(finishingServiceRequestCtrl.getTransportasi);
    router.route('/calculateppn').post(finishingServiceRequestCtrl.calculatePPN);
    router.route('/getpenyebab').post(finishingServiceRequestCtrl.getPenyebab);
    router.route('/getdetailservicerequest').post(finishingServiceRequestCtrl.getDetailServiceRequest);
    router.route('/getstokinvoiceselectbykodepartandinvoice').post(finishingServiceRequestCtrl.getStokInvoiceSelectByKodePartAndInvoice);
    router.route('/getdetailservicerequestreceived').post(finishingServiceRequestCtrl.getDetailServiceRequestReceived);
    router.route('/getsparepart').post(finishingServiceRequestCtrl.getSparepart);
    router.route('/saveservicefinishing').post(finishingServiceRequestCtrl.saveServiceFinishing);
    router.route('/serviceinsertdetail').post(finishingServiceRequestCtrl.serviceInsertDetail);
    router.route('/reject').post(finishingServiceRequestCtrl.reject);
    router.route('/updatestatus').post(finishingServiceRequestCtrl.updateStatus);
    router.route('/stokInsert').post(finishingServiceRequestCtrl.stokInsert);
    router.route('/updateStatusBeforeClaimService').post(finishingServiceRequestCtrl.updateStatusBeforeClaimService);

    // finishing service request all
    router.route('/saveservicefinishingall').post(finishingServiceRequestAllCtrl.saveServiceFinishingAll)

    //claim service
    router.route('/claimservicelist').post(claimserviceCtrl.getClaimService);
    router.route('/claimservicesave').post(claimserviceCtrl.saveClaimService);

    //claim list
    router.route('/claimlist').post(claimlistCtrl.getClaimList);
    router.route('/claimdelete').post(claimlistCtrl.deleteClaim);
    router.route('/claimdetail').post(claimlistCtrl.getClaimDetail);
    router.route('/claimremovedetail').post(claimlistCtrl.removeClaimDetail);

    //review claim
    router.route('/claimreviewlist').post(reviewclaimCtrl.getReviewClaimList);
    router.route('/claimreviewservicelist').post(reviewclaimCtrl.getReviewServicebyClaim);
    router.route('/insertreviewclaim').post(reviewclaimCtrl.insertReviewClaim);
    router.route('/claimreviewbasslistbycabang').post(reviewclaimCtrl.getBassUnderCabang);
    router.route('/claimreviewbasslist').post(reviewclaimCtrl.getBassList);

    //paid claim
    router.route('/insertpaidclaim').post(paidclaimCtrl.insertPaidClaim);
    //end router for service


    //start router for parts

    //router for part order
    //get auto number no po
    router.route('/autonumberNoPO').post(partCtrl.getAutonumberNoPO);
    //savepo
    router.route('/savePO').post(partCtrl.savePO);
    //send email
    router.route('/sendEmail').post(partCtrl.sendEmail);
    //part order tipe po
    router.route('/tipePO').get(partCtrl.getTipePO);

    //router for part maintain
    //get list PO maintain PO
    router.route('/ListPO').post(maintainPartCtrl.getListPO);
    //delete list PO maintain PO
    router.route('/DeletePO').post(maintainPartCtrl.deletePO);

    //router for list faktur
    //get invoice list
    router.route('/ListInvoice').post(invoiceListCtrl.getListInvoice);
    //get detail invoice list
    router.route('/DetailInvoice').post(invoiceListCtrl.getDetailInvoice);
    //delete invoice
    router.route('/DeleteInvoice').post(invoiceListCtrl.deleteInvoice);

    //router for part receiving
    //save pr
    router.route('/savePR').post(partReceivingCtrl.savePR);
    //get PR invoice list
    router.route('/invoicePRList').post(partReceivingCtrl.getInvoicePRList);

    //router for part lookup
    //get bass list all
    router.route('/bassListAll').post(lookupPartCtrl.getBassListAll);
    //get bass list
    router.route('/bassList').post(lookupPartCtrl.getBassList);
    //get bass list under cabang
    router.route('/basslistbycabang').post(lookupPartCtrl.getBassUnderCabang);
    //list sparepart
    router.route('/sparepartList').post(lookupPartCtrl.getSparepartList);
    //list sparepart by kode sparepart
    router.route('/sparepartListbyKode').post(lookupPartCtrl.getSparepartListbyKode);
    //get service list
    router.route('/serviceList').post(lookupPartCtrl.getServiceList);
    //get service list by Kode
    router.route('/serviceListbyKode').post(lookupPartCtrl.getServiceListbyKode);
    //get PR list
    router.route('/prList').post(lookupPartCtrl.getPRList);
    //get PR list by kode
    router.route('/prListbyKode').post(lookupPartCtrl.getPRListbyKode);
    //get PO list
    router.route('/poList').post(lookupPartCtrl.getPOList);
    //get PO list by kode
    router.route('/poListbyKode').post(lookupPartCtrl.getPOListbyKode);
    //stockselect
    router.route('/stockselect/').post(lookupPartCtrl.getStockSelect);
    //list barang
    router.route('/barangList').post(lookupPartCtrl.getBarangList);
    //list exploded header
    router.route('/explodedHeaderList').post(lookupPartCtrl.getExplodedHeaderList);
    //list exploded detail
    router.route('/explodedDetailList').post(lookupPartCtrl.getExplodedDetailList);
    //exploded image
    router.route('/explodedImage').post(lookupPartCtrl.getExplodedImage);

    //end router for parts

    //router for reports
    // report/reportClaim dengan kode bass
    router.route('/reportClaim/:kode_bass/:tgl_Awal/:tgl_Akhir').get(reportClaimCtrl.reportClaim);
    // report/reportClaim tanpa kode bass
    router.route('/reportClaim/:tgl_Awal/:tgl_Akhir').get(reportClaimCtrl.reportClaim);
    // report/reportServiceList dengan kode bass tanpa status
    router.route('/reportServiceList/:kode_bass/:tgl_Awal/:tgl_Akhir').get(reportServiceCtrl.reportServiceList);
    // report/reportServiceList dengan kode bass dengan status
    router.route('/reportServiceList/:kode_bass/:tgl_Awal/:tgl_Akhir/:status').get(reportServiceCtrl.reportServiceList);
    // report/reportServiceList tanpa kode bass tanpa status
    router.route('/reportServiceList/:tgl_Awal/:tgl_Akhir').get(reportServiceCtrl.reportServiceList);
    // report/reportServiceList tanpa kode bass dengan status
    router.route('/reportServiceList/:tgl_Awal/:tgl_Akhir/:status').get(reportServiceCtrl.reportServiceList);
    // report/reportFinishingService
    router.route('/reportFinishingService/:kode_bass/:kode_zona/:tgl_Awal/:tgl_Akhir').get(reportFinishingServiceCtrl.reportFinishingService);
    // report/getZonaList
    router.route('/getZonaList/:kode_bass').get(reportLookUpCtrl.getZonaList);
    // report/getBassList
    router.route('/getBassList/:kode_bass_nama_bass').get(reportLookUpCtrl.getBassList);
    // report/getBassListUnderCabang
    router.route('/getBassListUnderCabang/:kode_bass').get(reportLookUpCtrl.getBassListUnderCabang);
    // report/getBassSelectByZonaAndCabang
    router.route('/getBassSelectByZonaAndCabang/:inputted_by_bass/:kode_zona').get(reportLookUpCtrl.getBassSelectByZonaAndCabang);
    // report/getBassCustomerList
    router.route('/getCustomerList').post(reportLookUpCtrl.getCustomerList);
    // report/getBassCustomerList
    router.route('/getCustomerListPusat').post(reportLookUpCtrl.getCustomerListPusat);
    // report/getRejectedServiceReportService
    router.route('/getRejectedServiceReportService/:kode_bass/:tgl_Awal/:tgl_Akhir').get(reportRejectedServiceCtrl.getRejectedServiceReportService);
    // report/getRejectedServiceReportService tanpa kode bass
    router.route('/getRejectedServiceReportService/:tgl_Awal/:tgl_Akhir').get(reportRejectedServiceCtrl.getRejectedServiceReportService);
    // report/reportPartOrder
    router.route('/reportPartOrder/:kode_bass/:kode_zona/:tgl_Awal/:tgl_Akhir').get(reportPartOrderCtrl.reportPartOrder);
    // report/getPartReceiving
    router.route('/reportPartReceiving/:kode_bass/:tgl_Awal/:tgl_Akhir').get(reportPartReceivingCtrl.getPartReceiving);

    // home/servicelist tab
    router.route('/serviceListHome').post(homeCtrl.getServiceSelectForHome);
    // home/partorder tab
    router.route('/getPartorderHomeSelect').post(homeCtrl.getPartorderHomeSelect);
    // home/partorderexpired tab
    router.route('/getPartOrderExpiredHomeSelect').post(homeCtrl.getPartOrderExpiredHomeSelect);
    // home/barangdalamperjalanan tab
    router.route('/getBarangDalamPerjalanan/:kode_bass').get(homeCtrl.getBarangDalamPerjalanan);
    // home/barangdalamperjalanan tab tanpa parameter
    router.route('/getBarangDalamPerjalanan').get(homeCtrl.getBarangDalamPerjalanan);



    return router;
};