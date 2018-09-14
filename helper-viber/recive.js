const apiViber = require("./apiViber");
const apiRocket = require("../helper-rocket/apiRest");
const ProcessStr = require("../libs/processStr");
const config = require("../config");
const mongodb = require("../database/mongodb");

const handleMessage = async (_data) => {
    /**
     * _Data: {event, timestamp, message_token, sender: {id, name, avatar, language, country, api_version}, message, silent}
     */

    var checkDataUser = await mongodb.findOne(config.mongodb.collection, {"uid": _data.sender.id}).then(data => data);

    if(checkDataUser){

    }else{

    }

    let nameSender = _data.sender.name.toLowerCase().trim().replace(/(\s)/g, ".");
    nameSender = ProcessStr.clearUnikey(nameSender);

    let nameRoomRocket = `Viber.${nameSender}`;

    let infoRoomRocket = await apiRocket.infoChannel(nameRoomRocket).then(data => data).catch(data => data);

    let idRoomRocket;
    if (infoRoomRocket.success) {
        idRoomRocket = infoRoomRocket.channel._id;
    } else {
        let createRoomRocket = await apiRocket.createChannelRocket(nameRoomRocket).then(data => data).catch(data => data);
        // Phương thức không đồng bộ
        let createWebhookRocket = apiRocket.createOutGoingWebhookRocket_VIBER(nameRoomRocket).then(data => data).catch(data => data);
        idRoomRocket = createRoomRocket.success ? createRoomRocket.channel._id : undefined;
    }

    // kiểm tra giá trị
    if (typeof idRoomRocket == "undefined") return;

    forwardRocket(idRoomRocket, _data);
}

// Chuyển tiếp tin nhắn ZALO sang Rocket
const forwardRocket = (_idRoomRocket, _dataMsg) => {
    apiRocket.sendMsgRock(_idRoomRocket,
        _dataMsg.message, _dataMsg.sender.name, _dataMsg.sender.avatar);
}

module.exports = {handleMessage}