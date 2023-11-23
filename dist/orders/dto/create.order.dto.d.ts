import { Categories } from 'src/users/dto/caterory.interface';
export declare class CreateOrderDto {
    readonly phone: string;
    readonly name: string;
    readonly category: Array<Categories>;
    readonly description: string;
    readonly location: string;
    readonly price: string;
    readonly botLink: string;
    readonly date: string;
}
