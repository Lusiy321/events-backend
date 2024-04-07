import { Live } from '../live.model';
export declare class CreateLiveDto {
    readonly content: string;
    readonly image?: string;
}
export declare class SearchLive {
    page?: number;
    limit?: number;
}
export declare class search_live {
    totalPages: number;
    currentPage: number;
    data: Live[];
}
