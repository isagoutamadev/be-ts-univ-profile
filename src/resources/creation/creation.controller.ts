import Controller from "@/utils/interfaces/controller.interface";
import { NextFunction, Router, Request, Response } from "express";
import response from "@/helpers/response.helper";
import { ResponseCode } from "@/utils/responses/global.response";
import { Creation } from "@/models/creation.model";
import { CreateCreationSchema } from "@/schemas/creation.schema";
import { validate, ReqType } from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import HttpException from "@/utils/exceptions/http.exception";
import { CreationService } from "./creation.service";
import { Paging } from "@/utils/responses/pagination.response";
import { PagingSchema } from "@/schemas/paging.schema";
import { UUIDSchema } from "@/schemas/global.schema";

export class CreationController implements Controller {
    public path = "creations";
    public router = Router();
    private service = new CreationService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.get(
            "/contents/types",
            // authMiddleware(),
            validate(PagingSchema, ReqType.QUERY),
            this.getTypes
        );

        this.router.get(
            "/",
            // authMiddleware(),
            validate(PagingSchema, ReqType.QUERY),
            this.get
        );

        this.router.post(
            "/",
            authMiddleware(),
            validate(CreateCreationSchema, ReqType.BODY),
            this.create
        );

        this.router.get(
            "/:id",
            // authMiddleware(),
            validate(UUIDSchema, ReqType.PARAMS),
            this.detail
        );
    }

    private getTypes = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { limit, page } = req.query;
            const result = await this.service.getTypes(req.query, Number(page), Number(limit));

            return response.ok(result, res);
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    };

    private get = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { limit, page } = req.query;
            const result = await this.service.get(req.query, Number(page), Number(limit));

            return response.ok(result, res);
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    };
    
    private detail = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { id } = req.params;

            const result = await this.service.find({id});

            return response.ok(result, res);
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    };

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { auth } = res.app.locals;
            const result = await this.service.create(req.body, auth);

            return response.created(result, res);
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    };
}
