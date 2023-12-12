export declare enum role {
    superadmin = "superadmin",
    admin = "admin",
    smm = "smm",
    moderator = "moderator",
    contentManager = "contentManager"
}
export declare class RoleAdminDto {
    readonly role: role;
}
export declare const admSelect = "-password -createdAt -updatedAt";
