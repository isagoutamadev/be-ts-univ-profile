import { Request, Response, NextFunction } from "express";
import { Schema, ValidationError } from "joi";
import response from "@/helpers/response.helper";
import { ResponseCode } from "@/utils/responses/global.response";

export enum ReqType {
    HEADERS = 'headers',
    QUERY = 'query',
    BODY = 'body',
    PARAMS = 'params'
}
export function validate(schema: Schema, reqType: ReqType) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req[reqType], { abortEarly: false });

            return next();
        }
        catch (err: any) {
            let result: string[] = [];
            if (err instanceof ValidationError) {
                result = err.details.map((detail) => detail.message);   
            }

            return response.badRequest(result, res);
        }
    }
}