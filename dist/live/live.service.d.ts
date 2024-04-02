import { User } from 'src/users/users.model';
import { CreateLiveDto } from './dto/create.live.dto';
import { Live } from './live.model';
export declare class LiveService {
    private userModel;
    private liveModel;
    constructor(userModel: User, liveModel: Live);
    findAllUsers(): Promise<Live[]>;
    create(req: any, content: CreateLiveDto): Promise<Live>;
    findToken(req: any): Promise<User>;
}
