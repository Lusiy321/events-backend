import { Banner } from './banners.model';
import { CreateBannerDto } from './dto/create.banners.dto';
import { User } from 'src/users/users.model';
export declare class BannersService {
    private bannerModel;
    private userModel;
    constructor(bannerModel: Banner, userModel: User);
    createBanner(banner: CreateBannerDto): Promise<Banner>;
    findAllBanners(): Promise<Banner[]>;
    findBannerById(id: string): Promise<Banner>;
    deleteBanner(id: string): Promise<Banner>;
    updateBanner(id: string, data: CreateBannerDto): Promise<Banner>;
    getRightBanner(): Promise<Object[]>;
}
