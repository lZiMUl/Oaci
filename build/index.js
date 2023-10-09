"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenFrp = void 0;
const tslib_1 = require("tslib");
const node_console_1 = require("node:console");
const axios_1 = tslib_1.__importDefault(require("axios"));
const instance = axios_1.default.create({
    baseURL: 'https://preview.openfrp.net',
    method: 'post',
});
class OpenFrp {
    authorization;
    cookie;
    username;
    password;
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.cookie = `cf_clearance=qwW7jaeY8tIJp7T1FhbEQFoHCmcnUodqSgKyM9pjaAU-1696049038-0-1-c2dc2997.53e30ffb.95dd7677-160.0.0; username=${this.username}; __cf_bm=SbfY7jTcCCkb.C4F76S_4EUYkPNpuFNU_OclSvNHI7E-1696048551-0-AVHDJo06FV6XsT9eI2kXKqkpEXNC7Ai/VvfPeeBebeBitD12BZm98Br48y0b96Zanh7Y5a79dcoIZ5pPowoIoSo=`;
    }
    get getUserData() {
        return new Promise(async (callBack, refuse) => {
            try {
                const { data, headers } = await instance({
                    url: '/web/user/login',
                    headers: {
                        Cookie: this.cookie
                    },
                    data: {
                        user: this.username,
                        password: this.password,
                    }
                });
                this.authorization = data.flag ? headers.authorization : null;
                const { flag, data: session, msg: message } = data;
                if (flag) {
                    const { data } = await instance({
                        url: '/web/frp/api/getUserInfo',
                        headers: {
                            Authorization: this.authorization,
                            cookie: `${this.cookie}; username=${this.username}; authorization=${this.authorization}; session=${session}`
                        },
                        data: { session }
                    });
                    callBack({ ...data, session, authorization: this.authorization || '', cookie: this.cookie });
                }
                else {
                    refuse(new Error(message));
                }
            }
            catch (e) {
                throw (0, node_console_1.error)(e.message);
            }
        });
    }
    static async sign(session, authorization, cookie) {
        const { data } = await instance({
            url: '/web/frp/api/userSign',
            headers: {
                Authorization: authorization,
                Cookie: cookie
            },
            data: { session },
        });
        if (data.flag) {
            return data;
        }
        throw new Error('Get user data error');
    }
}
exports.OpenFrp = OpenFrp;
exports.default = OpenFrp;
