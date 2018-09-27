const request = require('request');

const sendMsg = async (_url, _conversationId, _activityId, _dataMsg) => {
    let valueToken = await getToken();
    return new Promise((resolve, reject) => {
        request({
            url: `${_url}v3/conversations/${_conversationId}/activities/${_activityId}`,
            method: "POST",
            headers: {
                "Authorization": "Bearer " + valueToken,
                "Content-Type": "application/json"
            },
            json: _dataMsg
        }, (error, response, body) => {
            console.log("thang:: ", response.statusCode);
            console.log("body:: ", body);
            console.log("error:: ", error);
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        })
    })
}

const getToken = () => {
    return new Promise((resolve, reject) => {
        request({
            url: "https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token",
            method: "POST",
            form: {
                "grant_type": process.env.SKYPE_GRANT_TYPE,
                "client_id": process.env.SKYPE_CLIENT_ID,
                "client_secret": process.env.SKYPE_CLIENT_SECRET,
                "scope": process.env.SKYPE_SCOPE
            }
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let temp = JSON.parse(body);
                resolve(temp.access_token);
            }
            reject(body);
        })
    })
}

module.exports = { sendMsg }