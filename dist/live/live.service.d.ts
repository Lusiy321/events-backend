import { User } from 'src/users/users.model';
import { CreateLiveDto, SearchLive, search_live } from './dto/create.live.dto';
import { Live } from './live.model';
import { CloudinaryService } from 'src/users/cloudinary.service';
export declare class LiveService {
    private userModel;
    private liveModel;
    private readonly cloudinaryService;
    constructor(userModel: User, liveModel: Live, cloudinaryService: CloudinaryService);
    findAllUsersMessage(query: SearchLive): Promise<search_live>;
    createMessage(req: any, content: CreateLiveDto, file: any): Promise<Live>;
    findToken(req: any): Promise<User>;
}
