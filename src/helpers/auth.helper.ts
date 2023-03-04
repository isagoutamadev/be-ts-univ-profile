import * as crypto from "crypto";
import jwt from "jsonwebtoken";

export default class AuthHelper {
    static encrypt(text?: string): string {
        const key = process.env.ENCRYPT_KEY || "";
        const digest = 'hex';

        const textMD5 = crypto.createHash('md5').update(text || "").digest(digest);
        const md5 = crypto.createHash('md5').update(key + textMD5 + key).digest(digest);
        const sha1 = crypto.createHash('sha1').update(md5).digest(digest);
        const sha256 = crypto.createHash('sha256').update(sha1).digest(digest);

        return sha256;
    }

    static jwtEncode(data: object): string {
        const key = process.env.ENCRYPT_KEY || "";
        
        return jwt.sign(data, key, {expiresIn: '1 days'});;
    }

    static jwtDecode(token: string): string | jwt.JwtPayload {
        try {
            const key = process.env.ENCRYPT_KEY || "";
            const keySSO = process.env.SSO_KEY || "";
            let decoded = {
                is_sso: false,
            };
            try {
                // @ts-ignore
                decoded = jwt.verify(token, key);
                decoded.is_sso = false;
            } catch (error) {
                const decodeBase64 = Buffer.from(token, 'base64').toString('utf-8');
                const jsonParsed = JSON.parse(decodeBase64);
                // @ts-ignore
                decoded = jwt.verify(jsonParsed.token, keySSO);
                // @ts-ignore
                decoded = decoded.users;
                decoded.is_sso = true;
            }
            return decoded;
        } catch (error) {
            throw error;
        }
    }
}