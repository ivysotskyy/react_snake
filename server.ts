import IORedis from "ioredis";
const redis = new IORedis({
    port: 6379, // Redis port
    host: "atlogredist01", // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: "DTClhKGzUCgQofrzYOa3",
});
function put() {
    redis.set("userName", JSON.stringify({score: 10, time: 100}));
}
export {put}