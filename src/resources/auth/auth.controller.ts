import Controller from '@/utils/interfaces/controller.interface';
import { NextFunction, Router, Request, Response } from 'express';
import response from '@/helpers/response.helper';
import { ResponseCode } from '@/utils/responses/global.response';
import { User } from '@/models/user.model';
import { FcmSchema, LoginSchema } from '@/schemas/auth.schema';
import { validate, ReqType } from '@/middlewares/validate.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { AuthService } from '@/resources/auth/auth.service';
import HttpException from '@/utils/exceptions/http.exception';
import { JWT } from '@/models/jwt.model';

// const service = new AuthService();

export class AuthController implements Controller {
    public path = '';
    public router = Router();
    private service = new AuthService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.get(
            '/auth',
            authMiddleware(),
            this.detail
        );

        this.router.get(
            '/version',
            this.getVersion
        );

        this.router.post(
            '/login',
            validate(LoginSchema, ReqType.BODY),
            this.login
        );
        
        this.router.post(
            '/login/sso',
            this.loginSso
        );
        
        this.router.post(
            'auth/fcm',
            authMiddleware(),
            validate(FcmSchema, ReqType.BODY),
            this.updateFCM
        );
    }

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { body } = req;
            const user: User = {
                ...body
            };

            const result = await this.service.login(user);

            return response.global<JWT>(res, {
                code: ResponseCode.OK,
                result,
            });
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    }
    
    private loginSso = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { token } = req.body;

            const decodeBase64 = Buffer.from(token, 'base64').toString('utf-8');
            const jsonParsed: User = JSON.parse(decodeBase64);

            const result = await this.service.login({
                email: jsonParsed.username,
                password: jsonParsed.password,
            });

            return response.global<JWT>(res, {
                code: ResponseCode.OK,
                result,
            });
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    }

    private detail = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { auth } = res.app.locals;
            
            return response.global<User>(res, {
                code: ResponseCode.OK,
                result: auth,
            });
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    }
    
    private updateFCM = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { auth } = res.app.locals;
            const { device_id, fcm_token } = req.body;
            await this.service.updateById({
                id: auth.id,
                device_id: String(device_id),
                fcm_token: String(fcm_token),
            });

            return response.global<User>(res, {
                code: ResponseCode.OK,
                result: {
                    device_id,
                    fcm_token
                },
            });
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    }
    
    private getVersion = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            return response.global<any>(res, {
                code: ResponseCode.OK,
                result: {
                    last_updated_epoch: 1674201737,
                    version: "2.0.1"
                }
            });
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    }
}
