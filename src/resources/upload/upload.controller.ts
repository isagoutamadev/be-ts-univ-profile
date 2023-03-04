import Controller from "@/utils/interfaces/controller.interface";
import { NextFunction, Router, Request, Response } from "express";
import response from "@/helpers/response.helper";
import { ResponseCode } from "@/utils/responses/global.response";
import { Upload } from "@/models/upload.model";
import { GetFileSchema } from "@/schemas/upload.schema";
import { validate, ReqType } from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import HttpException from "@/utils/exceptions/http.exception";
import { UploadService } from "./upload.service";
import { Paging } from "@/utils/responses/pagination.response";
import { PagingSchema } from "@/schemas/paging.schema";
import multer from "multer";
import fs from "fs";

export class UploadController implements Controller {
    public path = "uploads";
    public router = Router();
    private service = new UploadService();
    private storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploaded/");
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const splitFileName = file.originalname.split('.');
            req.body.filename = uniqueSuffix + '.' + splitFileName[splitFileName.length - 1];
            req.body.original_filename = file.originalname;
            console.log(req.body);
            cb(null, req.body.filename);
        },
    });
    //create multer instance
    private upload = multer({ storage: this.storage });

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.get(
            "/:filename",
            validate(GetFileSchema, ReqType.PARAMS),
            this.findFile
        );

        this.router.post(
            "/image",
            authMiddleware(),
            this.upload.single("file"),
            this.uploadImage
        );
    }

    private findFile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {

        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    };

    private uploadImage = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { auth } = res.app.locals;
            this.service.create({
                ...req.body,
                created_by: auth.id,
            });
            return response.created(req.body, res);
        } catch (err: any) {
            return next(new HttpException(err.message, err.statusCode));
        }
    };
}
