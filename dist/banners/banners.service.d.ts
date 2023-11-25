import { Banner } from './banners.model';
import { CreateBannerDto } from './dto/create.banners.dto';
export declare class BannersService {
    private bannerModel;
    constructor(bannerModel: Banner);
    createBanner(banner: CreateBannerDto): Promise<Banner>;
    findAllBanners(): Promise<Banner[]>;
    findBannerById(id: string): Promise<Banner>;
    deleteBanner(id: string): Promise<Banner>;
    updateBanner(id: string, data: CreateBannerDto): Promise<Banner>;
}
