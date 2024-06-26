/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { Categories } from 'src/users/utils/user.types';
export type OrdersDocument = Orders & Document;
export declare class Orders extends Model<Orders> {
    phone: string;
    name: string;
    description: string;
    category: Array<Categories>;
    tg_chat: number;
    exactLocation: string;
    viber_chat: string;
    location: string;
    price: string;
    date: string;
    active: boolean;
    sms: number;
    verify: boolean;
    approve_count: number;
    accepted_users: Array<string>;
}
export declare const OrderSchema: import("mongoose").Schema<Orders, Model<Orders, any, any, any, import("mongoose").Document<unknown, any, Orders> & Orders & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Orders, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Orders>> & import("mongoose").FlatRecord<Orders> & {
    _id: import("mongoose").Types.ObjectId;
}>;
