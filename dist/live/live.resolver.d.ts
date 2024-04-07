import { Live } from './live.model';
import { LiveService } from './live.service';
import { CreateLiveDto, SearchLive, search_live } from './dto/create.live.dto';
import * as Upload from 'graphql-upload/Upload.js';
export declare class LiveResolver {
    private readonly liveService;
    cloudinaryService: any;
    usersService: any;
    constructor(liveService: LiveService);
    getMessages(query: SearchLive): Promise<search_live>;
    createMessage(context: any, image: Upload, data: CreateLiveDto): Promise<Live>;
}
