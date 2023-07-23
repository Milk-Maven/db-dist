"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.post = void 0;
// const baseUrl = "http://localhost:3001/trpc";
const baseUrl = "https://venture-wisconsin-f695fbca93bb.herokuapp.com/trpc";
const post = (endpoint, payload = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield postData(`${baseUrl}/${endpoint}`, payload);
    if (!res)
        throw Error("Data not found");
    return res;
});
exports.post = post;
function postData(endpoint, data = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // Default options are marked with *
        let response = yield fetch(endpoint, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        response = yield response.json();
        // @ts-ignore
        return response.result.data;
    });
}
function get(path, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = data ? `?input=${encodeURI(JSON.stringify(data))}` : "";
        let response = yield fetch(`${baseUrl}/${path}${params}`);
        response = yield response.json();
        // @ts-ignore
        return response.result.data;
    });
}
exports.get = get;
