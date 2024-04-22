const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json',
};

class baseResponse {
    constructor() {
        this.success = false;
        this.message = '';
        this.data = null;
    }

    static successResponse(data, message = '') {
        return {
            success: true,
            message: message,
            data: data
        }
    }

    static errorResponse(message = '') {
        return {
            success: false,
            message: message,
            data: null
        }
    }
}

const responseHandler = {
    // 成功查詢並資料內容
    sendSuccess: (res, apiStatus, message, data) => {
        res.set(headers);
        res.status(apiStatus).send(baseResponse.successResponse(data, message));
    },
    // 回傳客戶端錯誤
    sendError: (res, apiStatus, message) => {
        res.set(headers);
        res.status(apiStatus).send(baseResponse.errorResponse(message));
    },
};

module.exports = responseHandler;