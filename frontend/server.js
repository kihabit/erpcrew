const { createServer } = require("http");
const next = require("next");

const app = next({
    dev: false,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        handle(req, res);
    });

    const port = process.env.PORT || 3000;

    server.listen(port, "0.0.0.0", () => {
        console.log(`Next.js running on port ${port}`);
    });
});