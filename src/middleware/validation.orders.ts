import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { CreateOrderDto } from 'src/orders/dto/create.order.dto';

@Injectable()
export class ValidationOrders implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const dtoInstance = plainToClass(CreateOrderDto, req.body);
    const errors: ValidationError[] = await validate(dtoInstance);

    if (errors.length > 0) {
      const errorMessages = errors.map((error: ValidationError) => {
        return {
          property: error.property,
          constraints: error.constraints,
        };
      });

      return res.status(400).json({
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    next();
  }
}
