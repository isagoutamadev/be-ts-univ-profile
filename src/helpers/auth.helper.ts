import * as crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default class AuthHelper {
    static encrypt(text: string): string {
        const saltRounds = Number(process.env.SALT_ROUNDS);

        const hash = bcrypt.hashSync(text, saltRounds);

        return hash;
    }

    static compare(text: string, encrypted: string): boolean {
        return bcrypt.compareSync(text, encrypted);
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