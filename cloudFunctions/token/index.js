// 云函数入口文件
const cloud = require('wx-server-sdk');
const axios = require('axios');
var rp = require('request-promise');
const fs = require('fs');
var stream = require('stream');
let appid = 'wxcf3e54c49f32683c';
let appsecret = 'da40805b4b57b246f96617cf01082fed';

cloud.init()



// 云函数入口函数
exports.main = async(event, context) => {
  console.log(event)
  try {
    const resultValue = await rp('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + appsecret)
    const token = JSON.parse(resultValue).access_token;
    console.log('------ TOKEN:', token);

    const response = await axios({
      method: 'post',
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
      responseType: 'stream',
      params: {
        access_token: token,
      },
      data: {
        page: event.page,
        width: 300,
        scene: event.id,
      },
    });

    //return event.id

    const file_add =  await cloud.uploadFile({
      cloudPath: 'xcxcodeimages/' + Date.now() + '.png',
      fileContent: response.data,
    });


    let cloud_file = file_add.fileID;

    const fileList = [cloud_file];
    const result = await cloud.getTempFileURL({
      fileList: fileList,
    })
    return {
      code_add: result.fileList[0].tempFileURL,
      fileID: cloud_file
    }

  } catch (err) {
    console.log('>>>>>> ERROR:', err)
  }
}