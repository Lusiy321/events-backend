export declare class Photo {
    publicId: string;
    url: string;
}
export declare class Social {
    Instagram?: string;
    Facebook?: string;
    Youtube?: string;
    TikTok?: string;
    Vimeo?: string;
    SoundCloud?: string;
    Spotify?: string;
    AppleMusic?: string;
    Deezer?: string;
    WebSite?: string;
}
export declare class Categories {
    _id: string;
    name: string;
    subcategories: Subcategory[];
}
export declare class Subcategory {
    id: string;
    name: string;
}
