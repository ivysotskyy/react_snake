// @ts-ignore
import {Request, Response} from "express";

const express = require("express");
const IORedis = require("ioredis");
const bodyPrser = require("body-parser")
const app = express();

const redis = new IORedis({
    port: 6379, // Redis port
    host: "atlogredist01", // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: "DTClhKGzUCgQofrzYOa3",
});
app.use(bodyPrser.json());
app.use((req: any, res: any, next: any) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post("/save_score", (req: Request, res: Response) => {
    console.log(JSON.stringify(req.body));
    redis.send_command("HSET", "score", req.body.user, JSON.stringify(req.body))
        .then((res: any) => {
            console.log(res)
        });
    res.send({status: "OK"});
});

app.post("/get_scores", (req:Request, res: Response) => {
    console.log("Retrieve all scores");
    redis.send_command("HVALS", "score").then((response: any) => {
        console.log(response)
        res.send(response);
    })
})

const server = app.listen(6969, () => {
    // @ts-ignore
    const host = server.address().host;
    // @ts-ignore
    const port = server.address().port;

    console.log("Listening at " + host + ":"+port);
})