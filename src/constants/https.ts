export enum HttpResponseStatus {
    SUCCESS = 200,
    CREATE_SUCCESS = 201,
    BAD_REQUEST = 400,
    UNAUTHENTICATED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404
}

export enum HttpResponseMessage {
    SUCCESS = "Success",
    CREATE_SUCCESS = "Create successfully !",
    BAD_REQUEST = "Bad request" ,
    UNAUTHORIZED = "Unauthorized" ,
    FORBIDDEN = "Forbidden",
    NOT_FOUND = "Not found" ,
}