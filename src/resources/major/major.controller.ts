import Controller from '@/utils/interfaces/controller.interface';
import { NextFunction, Router, Request, Response } from 'express';
import response from '@/helpers/response.helper';
import { ResponseCode } from '@/utils/responses/global.response';
import { Major } from '@/models/major.model';
import { MajorSchema } from '@/schemas/major.schema';
import { validate, ReqType } from '@/middlewares/validate.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';
import HttpException from '@/utils/exceptions/http.exception';
import { MajorService } from './major.service';
import { Paging } from '@/utils/responses/pagination.response';
import { PagingSchema } from '@/schemas/paging.schema';
import { UUIDSchema } from '@/schemas/global.schema';

export class MajorController implements Controller {
    public path = 'majors';
    public router = Router();
    private service = new MajorService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.get(
            '/',
            // authMiddleware(),
            validate(PagingSchema, ReqType.QUERY),
            this.get
        );

        this.router.post(
            '/',
            authMiddleware(),
            validate(MajorSchema, ReqType.BODY),
            this.create
        );
        
        this.router.get(
            '/:id',
            // authMiddleware(),
            validate(UUIDSchema, ReqType.PARAMS),
            this.detail
        );
        
        this.router.put(
            '/:id',
            authMiddleware(),
            validate(UUIDSchema, ReqType.PARAMS),
            validate(MajorSchema, ReqType.BODY),
            this.update
        );
        
        this.router.delete(
            '/:id',
            authMiddleware(),
            validate(UUIDSchema, ReqType.PARAMS),
            this.delete
        );
    }

    private get = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {
                page,
                limit
            } = req.query;

            const result = await this.service.get(req.query, Number(page), Number(limit));

            return response.ok(result, res);
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
            const {
                id
            } = req.params;
            const result = await this.service.find({id});

            return response.ok(result, res);
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
            const { auth } = req.app.locals;
            const result = await this.service.create(req.body, auth);

            return response.created(result, res);
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
            const { auth } = req.app.locals;
            const {
                id
            } = req.params;
            
            const result = await this.service.update({id, ...req.body}, auth);

            return response.ok(result, res);
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    }
    
    private delete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { auth } = req.app.locals;
            const {
                id
            } = req.params;
            
            const result = await this.service.delete({id}, auth);

            return response.ok(result, res);
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    }
}