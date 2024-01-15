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
import { Categories } from 'src/users/dto/caterory.interface';
export type OrdersDocument = OrdersArchive & Document;
export declare class OrdersArchive extends Model<OrdersArchive> {
    phone: string;
    name: string;
    description: string;
    category: Array<Categories>;
    telegram: string;
    tg_chat: number;
    botLink: string;
    exactLocation: string;
    viber: string;
    location: string;
    price: string;
    date: string;
    active: boolean;
    sms: number;
    verify: boolean;
    approve_count: number;
    accepted_users: Array<string>;
}
export declare const OrdersArchiveSchema: import("mongoose").Schema<OrdersArchive, Model<OrdersArchive, any, any, any, import("mongoose").Document<unknown, any, OrdersArchive> & OrdersArchive & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrdersArchive, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<OrdersArchive>> & import("mongoose").FlatRecord<OrdersArchive> & {
    _id: import("mongoose").Types.ObjectId;
}>;
