"use strict";
exports.__esModule = true;
var express = require("express");
var IORedis = require("ioredis");
var bodyPrser = require("body-parser");
var app = express();
var redis = new IORedis({
    port: 6379,
    host: "atlogredist01",
    family: 4,
    password: "DTClhKGzUCgQofrzYOa3"
});
app.use(bodyPrser.json());
app.use(function (req, res, next) {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.post("/save_score", function (req, res) {
    console.log(JSON.stringify(req.body));
    redis.send_command("HSET", "score", req.body.user, JSON.stringify(req.body))
        .then(function (res) {
        console.log(res);
    });
    res.send({ status: "OK" });
});
app.post("/get_scores", function (req, res) {
    console.log("Retrieve all scores");
    redis.send_command("HVALS", "score").then(function (response) {
        console.log(response);
        res.send(response);
    });
});
var server = app.listen(6969, function () {
    // @ts-ignore
    var host = server.address().host;
    // @ts-ignore
    var port = server.address().port;
    console.log("Listening at " + host + ":" + port);
});
