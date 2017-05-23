'use strict';
const nodemailer = require('nodemailer');
const _config =
{
    host: "smtp.qq.com", // SMTP 端口
    port: 25,
    // secureConnection: true, // 使用 SSL
    auth: {
        //user: '360535004@qq.com',
        //pass: 'jigtlblikppscage'
        user:'236882283@qq.com',
        pass:'hayoekaftgaibifc'
    }
}
let mailOptions = {
    from: '"管理员" <236882283@qq.com>', // sender address
    // to: 'shaojian@ceair.com, 32370419@qq.com', // list of receivers
    subject: '您有新的活动添加成功', // Subject line
    // text: '这只是一个test操作' // plain text body
    // html:``
}
let transporter = nodemailer.createTransport(_config);
let postEmail = (option) => {
    return new Promise((resolve,reject)=>{
        transporter.sendMail(Object.assign(mailOptions,option), (error, info) => {
            if (error) {
                return console.log(error);
            }
            resolve(info)
            // console.log('Message %s sent: %s', info.messageId, info.response);
        });
    })
};
module.exports = postEmail;
