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
import { Categories } from './dto/caterory.interface';
import { verify } from './dto/verify.user.dto';
export type UserDocument = User & Document;
export declare class User extends Model<User> {
    firstName: string;
    email: string;
    password: string;
    title: string;
    description: string;
    phone: string;
    telegram: string;
    tg_chat: number;
    viber: string;
    whatsapp: string;
    location: string;
    master_photo: Photo;
    avatar: Photo;
    photo: Photo[];
    video: Photo[];
    category: Categories[];
    isOnline: boolean;
    paid: boolean;
    trial: boolean;
    price: string;
    social: Social;
    token: string;
    verified: verify;
    verify: boolean;
    googleId: string;
    facebookId: string;
    ban: boolean;
    totalRating: number;
    numberOfRatings: number;
    agree_order: number;
    disagree_order: number;
    trialEnds: Date;
    paidEnds: Date;
    accepted_orders: Array<string>;
}
export declare const UserSchema: import("mongoose").Schema<User, Model<User, any, any, any, import("mongoose").Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export interface Photo {
    publicId: string;
    url: string;
}
export interface Social {
    Instagram?: string;
    Facebook?: string;
    Youtube?: string;
    TikTok?: string;
    Vimeo?: string;
    SoundCloud?: string;
    Spotify?: string;
    AppleMusic?: string;
    Deezer?: string;
    WebSite?: string;
}
