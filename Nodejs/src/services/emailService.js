require('dotenv').config();
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend) => {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Ngô Văn Lân" <ngovanlan47@gmail.com>', // sender address
    to: dataSend.reciverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    //text: getBodyHTMLEmail(dataSend)// plain text body
    html: getBodyHTMLEmail(dataSend)
      // ,
  });
}

let getBodyHTMLEmail = (dataSend) => {
  let result = ''
  if(dataSend.language === 'vi') {
      result =   
          `
          <h3>Xin chào ${dataSend.patientName}!</h3>
          <p>Bạn nhận được email này vì bạn đã đặt một lịch hẹn khám bệnh trên ln.com</p>
          <p>Thông tin đặt lịch khám bệnh</p>
          <div><b>Thời gian: ${dataSend.time}</b></div>
          <div><b>Thời gian: ${dataSend.doctorName}</b></div>
      
          <p>Nếu các thông tin đã đúng như bạn lựa chọn vui lòng kích vào dường link bên dưới để xác nhận</p>
          <div><a href=${dataSend.redirectLink} target="_blank">Click vào đây</a></div>
          <div>Xin chân thành cảm ơn!</div>
          `
     
  }
  if(dataSend.language === 'en') {
     result =
      `
      <h3>Dear ${dataSend.patientName}!</h3>
      <p>You received this email because you booked a medical appointment on the ln website</p>
      <p>Information to book a medical appointment</p>
      <div><b>Time: ${dataSend.time}</b></div>
      <div><b>Doctor name: ${dataSend.doctorName}</b></div>
    
      <p>If the information is correct, please click on the link below to confirm</p>
      <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
      <div>Sincerely thank!</div>
      `

  }
  return result
}


let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = ''
  if(dataSend.language === 'vi') {
      result =   
          `
          <h3>Xin chào ${dataSend.patientName}!</h3>
          <p>Bạn nhận được email này vì bạn đã đặt một lịch hẹn khám bệnh trên ln.com thành công</p>
          <p>Thông tin đơn thuốc được gửi trong file đính kèm</p>
          <div>Xin chân thành cảm ơn!</div>
          `
     
  }
  if(dataSend.language === 'en') {
     result =
      `
      <h3>Dear ${dataSend.patientName}!</h3>
      <p>You received this email because you booked a medical appointment on the ln website success</p>
      <p>Prescription information is sent in the attached file</p>
      <div>Sincerely thank!</div>
      `
  }
  return result
}

let sendAttachment = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Ngô Văn Lân" <ngovanlan47@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Kết quả đặt lịch khám bệnh", // Subject line
    //text: getBodyHTMLEmail(dataSend)// plain text body
    html: getBodyHTMLEmailRemedy(dataSend),
    attachments: [
      {
        filename: `remedy${dataSend.patientId} - ${dataSend.patientName}.png `,
        content: dataSend.imgBase64.split("base64,")[1],
        encoding: 'base64'
      }
    ]
      // ,
  });
}
module.exports = {
    sendSimpleEmail, sendAttachment
}