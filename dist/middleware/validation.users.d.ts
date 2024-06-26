/// <reference types="cookie-parser" />
import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
export declare class ValidationUsers implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
