import { Response } from 'express';
import { GlobalResponse, ResponseCode, ResponseMessage } from '@/utils/responses/global.response';

function global<T>(res: Response, response: GlobalResponse<T>): Response {
    const finalResponse = new GlobalResponse(response.code, response.message, response.result);
    return res.status(response.code).send(finalResponse);
}

function ok<T>(result: T, res: Response) {
    const finalResponse = new GlobalResponse(ResponseCode.OK, ResponseMessage.OK, result);
    return res.status(finalResponse.code).send(finalResponse);
}

function created<T>(result: T, res: Response) {
    const finalResponse = new GlobalResponse(ResponseCode.CREATED, ResponseMessage.CREATED, result);
    return res.status(finalResponse.code).send(finalResponse);
}

function badRequest<T>(result: T, res: Response, message?: string) {
    const finalResponse = new GlobalResponse(ResponseCode.BAD_REQUEST, message || ResponseMessage.BAD_REQUEST, result);
    return res.status(finalResponse.code).send(finalResponse);
}

function unauthorized<T>(result: T, res: Response, message?: string) {
    const finalResponse = new GlobalResponse(ResponseCode.UNAUTHORIZED, message || ResponseMessage.UNAUTHORIZED, result);
    return res.status(finalResponse.code).send(finalResponse);
}

function forbidden<T>(result: T, res: Response, message?: string) {
    const finalResponse = new GlobalResponse(ResponseCode.FORBIDDEN, message || ResponseMessage.FORBIDDEN, result, res.app.locals.auth);
    return res.status(finalResponse.code).send(finalResponse);
}

function notFound<T>(result: T, res: Response, message?: string) {
    const finalResponse = new GlobalResponse(ResponseCode.NOT_FOUND, message || ResponseMessage.NOT_FOUND, result);
    return res.status(finalResponse.code).send(finalResponse);
}

function gone<T>(result: T, res: Response, message?: string) {
    const finalResponse = new GlobalResponse(ResponseCode.GONE, message || ResponseMessage.GONE, result);
    return res.status(finalResponse.code).send(finalResponse);
}

function error<T>(result: T, res: Response, message?: string) {
    const finalResponse = new GlobalResponse(ResponseCode.INTERNAL_SERVER_ERROR, message || ResponseMessage.INTERNAL_SERVER_ERROR, result);
    return res.status(finalResponse.code).send(finalResponse);
}

export default {
    global,
    ok,
    created,
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    gone,
    error
}