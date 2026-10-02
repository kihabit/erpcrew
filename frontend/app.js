const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname);

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".txt": "text/plain; charset=utf-8"
};

function getRequestPath(url) {
    return decodeURIComponent(url.split("?")[0]) || "/";
}

function findFile(requestPath) {
    if (requestPath === "/") {
        const file = path.join(PUBLIC_DIR, "index.html");

        return fs.existsSync(file) ? file : null;
    }

    requestPath = requestPath.replace(/\/+$/, "");

    // Direct static file
    const directFile = path.join(PUBLIC_DIR, requestPath);

    if (
        directFile.startsWith(PUBLIC_DIR) &&
        fs.existsSync(directFile) &&
        fs.statSync(directFile).isFile()
    ) {
        return directFile;
    }

    // Next.js static export route:
    // /about-us -> /about-us/index.html
    const routeFile = path.join(
        PUBLIC_DIR,
        requestPath,
        "index.html"
    );

    if (
        routeFile.startsWith(PUBLIC_DIR) &&
        fs.existsSync(routeFile) &&
        fs.statSync(routeFile).isFile()
    ) {
        return routeFile;
    }

    // /about-us -> /about-us.html
    const htmlFile = path.join(
        PUBLIC_DIR,
        requestPath + ".html"
    );

    if (
        htmlFile.startsWith(PUBLIC_DIR) &&
        fs.existsSync(htmlFile) &&
        fs.statSync(htmlFile).isFile()
    ) {
        return htmlFile;
    }

    return null;
}

const server = http.createServer((req, res) => {
    const originalPath = req.url.split("?")[0];

    console.log("REQUEST:", originalPath);

    try {
        const requestPath = getRequestPath(req.url);
        const filePath = findFile(requestPath);

        console.log("REQUEST PATH:", requestPath);
        console.log("FILE:", filePath);

        if (!filePath) {
            const notFound = path.join(
                PUBLIC_DIR,
                "404.html"
            );

            res.statusCode = 404;
            res.setHeader(
                "Content-Type",
                "text/html; charset=utf-8"
            );

            if (fs.existsSync(notFound)) {
                fs.createReadStream(notFound).pipe(res);
            } else {
                res.end("404 Not Found");
            }

            return;
        }

        const extension = path
            .extname(filePath)
            .toLowerCase();

        const contentType =
            MIME_TYPES[extension] ||
            "application/octet-stream";

        res.statusCode = 200;

        res.setHeader(
            "Content-Type",
            contentType
        );

        fs.createReadStream(filePath).pipe(res);

    } catch (error) {
        console.error("SERVER ERROR:", error);

        res.statusCode = 500;

        res.setHeader(
            "Content-Type",
            "text/plain; charset=utf-8"
        );

        res.end("Internal Server Error");
    }
});

server.listen(PORT, "0.0.0.0", () => {
    console.log("================================");
    console.log("KDS ERP CREW UAT SERVER");
    console.log("================================");
    console.log("PORT:", PORT);
    console.log("PUBLIC:", PUBLIC_DIR);
});