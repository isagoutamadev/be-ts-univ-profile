import Controller from '@/utils/interfaces/controller.interface';
import { NextFunction, Router, Request, Response } from 'express';
import response from '@/helpers/response.helper';
import { ResponseCode } from '@/utils/responses/global.response';
import { Student } from '@/models/student.model';
import {  } from '@/schemas/student.schema';
import { validate, ReqType } from '@/middlewares/validate.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';
import HttpException from '@/utils/exceptions/http.exception';
import { StudentsService } from './student.service';
import { Paging } from '@/utils/responses/pagination.response';
import { PagingSchema } from '@/schemas/paging.schema';
import { UUIDSchema } from '@/schemas/global.schema';

export class StudentController implements Controller {
    public path = 'students';
    public router = Router();
    private service = new StudentsService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.get(
            '/',
            authMiddleware(),
            validate(PagingSchema, ReqType.QUERY),
            this.get
        );

        this.router.get(
            '/:id',
            authMiddleware(),
            validate(UUIDSchema, ReqType.PARAMS),
            this.findById
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
    
    private findById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {id} = req.params;

            const result = await this.service.find({id});

            return response.ok(result, res);
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    }
}