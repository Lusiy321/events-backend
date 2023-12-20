declare var http: any;
declare var options: {
    hostname: string;
    port: number;
    path: string;
    method: string;
    headers: {
        'Content-Type': string;
    };
};
declare function getPublicUrl(): Promise<unknown>;
