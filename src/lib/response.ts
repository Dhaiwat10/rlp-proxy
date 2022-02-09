import { ResponseOutput, APIOutput } from '../types'

export const successResponse = (data : APIOutput | null) => {
    let response : ResponseOutput;

    response = {
        status : {
            error_code : 0,
            error_alert : "",
            error_message : "Success"
        },
        data
    }

    return response;
}

export const errorResponse = 
(
    data : APIOutput | null, 
    error_code : number = 500, 
    error_message : string = "Error", 
    error_alert : string = "Error"
) => {
    let response : ResponseOutput;

    response = {
        status : {
            error_code,
            error_alert,
            error_message
        },
        data 
    }

    return response;
}