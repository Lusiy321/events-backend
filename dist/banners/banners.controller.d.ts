import { BannersService } from './banners.service';
import { Banner } from './banners.model';
import { CreateBannerDto } from './dto/create.banners.dto';
export declare class BannersController {
    private readonly bannerService;
    constructor(bannerService: BannersService);
    create(data: CreateBannerDto): Promise<Banner>;
    findBanners(): Promise<Banner[]>;
    findBannerById(id: string): Promise<Banner>;
    updateBanners(id: string, data: CreateBannerDto): Promise<Banner>;
    findBannerAndDel(id: string): Promise<Banner>;
}
