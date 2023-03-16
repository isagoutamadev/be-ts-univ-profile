import Controller from '@/utils/interfaces/controller.interface';
import { NextFunction, Router, Request, Response } from 'express';
import response from '@/helpers/response.helper';
import { ResponseCode } from '@/utils/responses/global.response';
import { User } from '@/models/user.model';
import { CreateUserSchema, UserSearchSchema, UserUpdateSchema } from '@/schemas/user.schema';
import { validate, ReqType } from '@/middlewares/validate.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';
import HttpException from '@/utils/exceptions/http.exception';
import { UserService } from './user.service';
import { Paging } from '@/utils/responses/pagination.response';
import { PagingSchema } from '@/schemas/paging.schema';
import { permissionMiddleware } from '@/middlewares/permission.middleware';
import { UUIDSchema } from '@/schemas/global.schema';

// const service = new AuthService();

export class UserController implements Controller {
    public path = 'users';
    public router = Router();
    private service = new UserService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.get(
            '/',
            authMiddleware(),
            // permissionMiddleware(['user_view']),
            validate(PagingSchema, ReqType.QUERY),
            validate(UserSearchSchema, ReqType.QUERY),
            this.getUsers
        );
        
        this.router.post(
            '/',
            authMiddleware(),
            // permissionMiddleware(['user_view']),
            validate(CreateUserSchema, ReqType.BODY),
            this.create
        );
        
        this.router.get(
            '/:id',
            authMiddleware(),
            // permissionMiddleware(['user_view']),
            this.detail
        );

        this.router.put(
            '/:id',
            authMiddleware(),
            // permissionMiddleware(['user_update']),
            validate(UUIDSchema, ReqType.PARAMS),
            validate(UserUpdateSchema, ReqType.BODY),
            this.update
        );
    }

    private getUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { auth } = res.app.locals;
            const { page, limit } = req.query;

            const search = {
                ...req.query,
            };

            // @ts-ignore
            const result = await this.service.getUsers(search, page, limit, auth);
            
            return response.global<Paging<User>>(res, {
                code: ResponseCode.OK,
                result: result,
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
            const { id } = req.params;

            const result = await this.service.find({id}, auth);
            
            return response.global<User>(res, {
                code: ResponseCode.OK,
                result: result,
            });
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    }
    
    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { auth } = res.app.locals;
            console.log(auth);

            const result = await this.service.create(req.body, auth);
            
            return response.created<User>(result, res);
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    }
    
    private update = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { auth } = res.app.locals;
            const { uuid } = req.params;
            const {user, employee} = req.body;
            const result = await this.service.update({
                ...user,
                uuid: uuid,
                updated_by: auth.id,
            });
            
            return response.ok<User>(result, res);
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    }
}
