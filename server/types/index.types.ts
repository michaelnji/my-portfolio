// Define your types here (return types from API calls)

export type StatusCode = 200 | 400 | 404 | 403 | 500 | 401;
export type ErrorCodes = 400 | 404 | 403 | 500 | 401;

//make sure to add your defined types to ServerData
export type ServerData = null // | YourTYpe
export interface ServerResponse<
    Status extends StatusCode,
    Data extends ServerData,
> {
    status: Status;
    message?: string;
    ok: Status extends 200 ? true : false;
    data?: Status extends 200 ? Data : null;
    error?: Status extends 200 ? null : string;
}
