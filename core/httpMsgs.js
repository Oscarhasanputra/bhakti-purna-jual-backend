var settings = require("../settings");

exports.show500 = function (req, resp, err) {
    if (settings.httpMsgsFormat === 'HTML') {
        resp.writeHead(500, "Internal Error occuared", { "Content-Type": "text/html" });
        resp.write("<html><head><title>500</title></head><body>500: Internal Error. Details: " + err + "</body></html>");
    } else {
        resp.writeHead(500, "Internal Error occurred", { "Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "Error occurred: " + err }));
        // resp.write(JSON.stringify(err));
    }
    resp.end();
}

exports.show511 = function (req, resp, err) {
    if (settings.httpMsgsFormat === 'HTML') {
        resp.writeHead(511, "Network Authentication Required", { "Content-Type": "text/html" });
        resp.write("<html><head><title>511</title></head><body>511: Network Authentication Required. Details: " + err + "</body></html>");
    } else {
        resp.writeHead(511, "Network Authentication Required", { "Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "Network Authentication Required: " + err }));
        // resp.write(JSON.stringify(err));
    }
    resp.end();
}

exports.showErrorExpired = function (req, resp, err) {
    if (settings.httpMsgsFormat === 'HTML') {
        resp.writeHead(555, "Login Expired", { "Content-Type": "text/html" });
        resp.write("<html><head><title>555</title></head><body>555: Token Expired. Details: " + err + "</body></html>");
    } else {
        resp.writeHead(555, "Login Expired", { "Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "Token Expired: " + err }));
        // resp.write(JSON.stringify(err));
    }
    resp.end();
}

exports.sendJson = function (req, resp, data) {
    resp.writeHead(200, { "Content-Type": "application/json" });
    if (data) {
        resp.write(JSON.stringify(data));
    }
    resp.end();
}

exports.show405 = function (req, resp) {
    if (settings.httpMsgsFormat === 'HTML') {
        resp.writeHead(405, "Method not supported", { "Content-Type": "text/html" });
        resp.write("<html><head><title>405</title></head><body>405: Method not supported.</body></html>");
    } else {
        resp.writeHead(405, "Method not supported", { "Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "Method not supported" }));
    }
    resp.end();
}

exports.show413 = function (req, resp) {
    if (settings.httpMsgsFormat === 'HTML') {
        resp.writeHead(404, "Resource not found", { "Content-Type": "text/html" });
        resp.write("<html><head><title>413</title></head><body>404: Resource not found.</body></html>");
    } else {
        resp.writeHead(404, "Resource not found", { "Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "Resource not found" }));
    }
    resp.end();
}

exports.show413 = function (req, resp) {
    if (settings.httpMsgsFormat === 'HTML') {
        resp.writeHead(413, "Request Entity Too Large", { "Content-Type": "text/html" });
        resp.write("<html><head><title>413</title></head><body>413: Request Entity Too Large.</body></html>");
    } else {
        resp.writeHead(413, "Request Entity Too Large", { "Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "Request Entity Too Large" }));
    }
    resp.end();
}

exports.send200 = function (req, resp) {
    resp.writeHead(200, { "Content-Type": "application/json" });
    resp.write(JSON.stringify(
        { status: "success", code: 200 }
    ));
    resp.end();
}

exports.showHome = function (req, resp) {
    if (settings.httpMsgsFormat === 'HTML') {
        resp.writeHead(200, { "Content-Type": "text/html" });
        resp.write("<html><head><title>200</title></head><body>Your server connected dude ! :)</body></html>");
    } else {
        resp.writeHead(200, { "Content-Type": "application/json" });
        resp.write(JSON.stringify(
            { status: "Your server connected dude ! :)" }
        ));
    }
    resp.end();
}