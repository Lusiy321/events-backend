import { LiveService } from './live.service';
export declare class LiveController {
    private readonly liveService;
    constructor(liveService: LiveService);
    like(req: any, postId: string): Promise<any>;
    dislike(req: any, postId: string): Promise<any>;
    deletePost(req: any, postId: string): Promise<any>;
}
