import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create.posts.dto';
import { Posts } from './posts.model';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    createPost(post: CreatePostDto): Promise<Posts>;
    findPosts(): Promise<Posts[]>;
    findPostById(id: string): Promise<Posts>;
    updatePost(id: string, post: CreatePostDto): Promise<Posts>;
    deletePost(id: string): Promise<Posts>;
}
