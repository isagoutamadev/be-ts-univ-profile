import { Request, Response, NextFunction } from "express";
import response from "@/helpers/response.helper";
import AuthHelper from "@/helpers/auth.helper";

export function permissionMiddleware(permissions: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // permission
        try {
            const { auth } = res.app.locals;

            const authPermissions: String[] = auth.role.permissions;
            
            for (let i = 0; i < permissions.length; i++) {
                const permission = permissions[i];
                if (authPermissions.includes(permission)) {
                    return next();
                }
                
            }

            return response.forbidden({}, res);
        }
        catch (err: any) {
            console.log(err);
            
            return response.error({
                result: err.message
            }, res);
        }
    }
}