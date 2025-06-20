import type { ErrorCodes, ServerData, StatusCode } from "../types/index.types";

/**
 * Sends a server response for an unsuccessful request.
 *
 * @param {ErrorCodes} status - The status code indicating an error response.
 * @param {string} message - The error message.
 * @return {{status: ErrorCodes; message: string; ok: false}} The response object.
 */
export function sendServerResponse(status: ErrorCodes, message: string,): {
    status: ErrorCodes;
    message: string;
    ok: false
}

/**
 * Sends a server response for a successful request.
 *
 * @param {200} status - The status code indicating a successful response.
 * @param {string} message - The message to be sent in the response.
 * @param {ServerData} data - The data to be sent in the response.
 * @return {{status: 200; data: ServerData; message: string; ok: true}} The response object.
 */
export function sendServerResponse(status: 200, message: string, data: ServerData,): {
    status: 200;
    data: ServerData;
    message: string;
    ok: true
}




/**
 * Sends a server response based on the provided status code.
 *
 * @param {StatusCode} status - The status code for the response.
 * @param {string} [message] - The message to be sent in the response (optional).
 * @param {ServerData} [data] - The data to be sent in the response (optional, only for successful response).
 * @return {Object} The response object containing status, data, message, and ok flag.
 */
export function sendServerResponse(status: StatusCode | ErrorCodes, message?: string, data?: ServerData,) {

    if (status === 200) {

        return {
            status,
            data,
            message,
            ok: true

        }
    }



    return {
        status,
        message,
        ok: false

    }

}
