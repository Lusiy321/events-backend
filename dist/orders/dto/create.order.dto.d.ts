import { Categories } from 'src/users/utils/user.types';
export declare class CreateOrderDto {
    readonly phone: string;
    readonly name: string;
    readonly category: Array<Categories>;
    readonly description: string;
    readonly location: string;
    readonly price: string;
    readonly date: string;
}
