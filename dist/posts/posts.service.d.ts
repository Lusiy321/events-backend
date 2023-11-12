import { Posts } from './posts.model';
import { CreatePostDto } from './dto/create.posts.dto';
export declare class PostsService {
    private postsModel;
    constructor(postsModel: Posts);
    findAllPosts(): Promise<Posts[]>;
    findById(id: string): Promise<Posts>;
    create(posts: CreatePostDto): Promise<Posts>;
    postUpdate(id: string, posts: CreatePostDto): Promise<Posts>;
    postDelete(id: string): Promise<Posts>;
}
