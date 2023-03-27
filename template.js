const CONTROLLER = `import Controller from '@/utils/interfaces/controller.interface';
import { NextFunction, Router, Request, Response } from 'express';
import response from '@/helpers/response.helper';
import { ResponseCode } from '@/utils/responses/global.response';
import { {MODEL_NAME} } from '@/models/{MODULE_NAME}.model';
import {  } from '@/schemas/{MODULE_NAME}.schema';
import { validate, ReqType } from '@/middlewares/validate.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';
import HttpException from '@/utils/exceptions/http.exception';
import { {SERVICE_NAME} } from './{MODULE_NAME}.service';
import { Paging } from '@/utils/responses/pagination.response';
import { PagingSchema } from '@/schemas/paging.schema';

export class {CONTROLLER_NAME} implements Controller {
    public path = '{MODULE_NAME}s';
    public router = Router();
    private service = new {SERVICE_NAME}();

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
    }

    private get = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    }
}`;

const SERVICE = `import { {MODEL_NAME} } from "@/models/{MODULE_NAME}.model";
import { Paging } from "@/utils/responses/pagination.response";
import { {REPOSITORY_NAME} } from "./{MODULE_NAME}.repository";
import HttpException from "@/utils/exceptions/http.exception";
import { ResponseCode } from "@/utils/responses/global.response";
import { v4 as uuid } from "uuid";

export class {SERVICE_NAME} {
    private repository = new {REPOSITORY_NAME}();
    public get = async (search: {MODEL_NAME}, page: number, limit: number): Promise<Paging<{MODEL_NAME}>> => {
        try {            
           throw new HttpException("Not Found", ResponseCode.NOT_FOUND);
        } catch (error) {
            throw error;
        }
    }
}`;
const toQuery = "`(${query.toQuery()}) x`"
const REPOSITORY = `import { {MODEL_NAME} } from "@/models/{MODULE_NAME}.model";
import knex from "@/utils/knex/knex"
import { Pagination, Paging } from "@/utils/responses/pagination.response";

export class {REPOSITORY_NAME} {
    async get(search: {MODEL_NAME}, page: number, limit: number): Promise<Paging<{MODEL_NAME}>> {
        try {
            const select = [
                "id",
            ];

            const query = knex("").select(select);

            const offset = limit * page - limit;
            const queryCount = knex().count("id as total").from(knex.raw(${toQuery})).first();

            const [datas, count] = await Promise.all([
                await query.limit(limit).offset(offset),
                await queryCount
            ]);
            const pagination = new Pagination<{MODEL_NAME}>(
                datas,
                //@ts-ignore
                count.total,
                page,
                limit
            );

            return pagination.getPaging();
        } catch (error) {
            throw error;
        }
    }
}`;

const MODEL = `export interface {MODEL_NAME} {
    
}`;

const SCHEMA = 'import Joi from "joi";';

module.exports = {
    CONTROLLER,
    SERVICE,
    REPOSITORY,
    MODEL,
    SCHEMA,
}