const express = require('express')
const app = express()
const port = 3000
const { Tracer, ExplicitContext, BatchRecorder, jsonEncoder } = require("zipkin");
const { HttpLogger } = require("zipkin-transport-http");
const zipkinMiddleware = require("zipkin-instrumentation-express").expressMiddleware;

const ZIPKIN_ENDPOINT = process.env.ZIPKIN_ENDPOINT || "http://localhost:9411";

// Get ourselves a zipkin tracer
const tracer = new Tracer({
    ctxImpl: new ExplicitContext(),
    recorder: new BatchRecorder({
        logger: new HttpLogger({
            endpoint: `${ZIPKIN_ENDPOINT}/api/v2/spans`,
            jsonEncoder: jsonEncoder.JSON_V2,
        }),
    }),
    localServiceName: "date-service",
});
app.use(zipkinMiddleware({ tracer }));

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/hello', (req, res) => {
    res.send('Hello World!')
})
app.get('/world', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})