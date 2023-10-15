// Import Base Modules
import {error} from 'node:console';
import axios, {AxiosInstance} from 'axios';

// Create a Request Instance
const instance: AxiosInstance = axios.create({
    baseURL: 'https://preview.openfrp.net',
    method: 'post',
});

// Define UserData
interface UserData {
    session: string;
    authorization: string;
    cookie: string;
}

// Define LoginInfo
interface LoginInfo extends UserData {
    data: string;
    flag: boolean;
    msg: string;
}

type Callback = (data: LoginInfo) => void;
type Refuse = (data: Error) => void;

class OpenFrp {
    private authorization?: string;
    private readonly cookie: string;
    private readonly username: string;
    private readonly password: string;

    public constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
        this.cookie = `cf_clearance=qwW7jaeY8tIJp7T1FhbEQFoHCmcnUodqSgKyM9pjaAU-1696049038-0-1-c2dc2997.53e30ffb.95dd7677-160.0.0; username=${this.username}; __cf_bm=SbfY7jTcCCkb.C4F76S_4EUYkPNpuFNU_OclSvNHI7E-1696048551-0-AVHDJo06FV6XsT9eI2kXKqkpEXNC7Ai/VvfPeeBebeBitD12BZm98Br48y0b96Zanh7Y5a79dcoIZ5pPowoIoSo=`
    }

    public get getUserData(): Promise<UserData> {
        return new Promise(async (callBack: Callback, refuse: Refuse): Promise<void> => {

            try {
                const {data, headers}: axios.AxiosResponse<LoginInfo> = await instance({
                    url: '/web/user/login',
                    headers: {
                        Cookie: this.cookie
                    },
                    data: {
                        user: this.username,
                        password: this.password,
                    }
                })
                this.authorization = data.flag ? headers.authorization : null;
                const {flag, data: session, msg: message}: LoginInfo = data;
                if (flag) {
                    const {data}: axios.AxiosResponse<LoginInfo> = await instance({
                        url: '/web/frp/api/getUserInfo',
                        headers: {
                            Authorization: this.authorization,
                            cookie: `${this.cookie}; username=${this.username}; authorization=${this.authorization}; session=${session}`
                        },
                        data: {session}
                    });
                    callBack({...data, session, authorization: this.authorization || '', cookie: this.cookie});
                } else {
                    refuse(new Error(message));
                }
            } catch (e: Error | any) {
                throw error(e.message);
            }
        })
    }

    public static async Sign(session: string, authorization: string, cookie: string): Promise<LoginInfo | void> {
        const {data}: axios.AxiosResponse<LoginInfo> = await instance({
            url: '/web/frp/api/userSign',
            headers: {
                Authorization: authorization,
                Cookie: cookie
            },
            data: {session},
        });
        if (data.flag) {
            return data;
        }
        throw new Error('Get user data error');
    }
}

export default OpenFrp;
export {OpenFrp};
export type {UserData, LoginInfo}