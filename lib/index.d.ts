interface UserData {
    session: string;
    authorization: string;
    cookie: string;
}
interface LoginInfo extends UserData {
    data: string;
    flag: boolean;
    msg: string;
}
declare class OpenFrp {
    private authorization?;
    private readonly cookie;
    private readonly username;
    private readonly password;
    constructor(username: string, password: string);
    get getUserData(): Promise<UserData>;
    static Sign(session: string, authorization: string, cookie: string): Promise<LoginInfo | void>;
}
export default OpenFrp;
export { OpenFrp };
export type { UserData, LoginInfo };
//# sourceMappingURL=index.d.ts.map