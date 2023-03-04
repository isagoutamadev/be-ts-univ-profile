import { ResponseCode } from "../responses/global.response";

export default class HttpException extends Error {
    public statusCode: ResponseCode;
    public message: string;

    constructor(message: string, statusCode?: ResponseCode) {
        super(message);
        this.statusCode = statusCode || ResponseCode.INTERNAL_SERVER_ERROR;
        this.message = message;
    }
}