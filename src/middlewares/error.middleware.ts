import { Request, Response, NextFunction } from "express";
import HttpException from "@/utils/exceptions/http.exception";
import response from "@/helpers/response.helper";

function errorMiddleware(
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
): Response{
    if (error.statusCode === 500) {
        console.log(error);
    }
    
    const status = error.statusCode;
    const message = error.message;

    return response.global<object>(res, {
        code: status,
        message: message,
        result: {}
    });
}

export default errorMiddleware;