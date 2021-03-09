const nodemailer = require("nodemailer");
const {google} = require("googleapis");

const CLIENT_ID = "709905521344-ijshbio7o3vipf8rrle94efbs6p1vbul.apps.googleusercontent.com";
const CLIENT_SECRET = "_bxX0w4GZHRcTMOxxehle3RZ";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04bmcNWq6B-MOCgYIARAAGAQSNwF-L9IruICY5qds7MHTOAb1ZXOjYqJQeJseF6wJQrvZXi497KpRxL7m8vqvFLJ1Iwq6JhWCGHU";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const sendMail = async (name,email,subject,text,sbj1,sbj2,msg1,msg2)=>{
   try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
        service : "gmail",
        auth : {
            type : "OAuth2",
            user : "careforyou11022001@gmail.com",
            clientId : CLIENT_ID,
            clientSecret : CLIENT_SECRET,
            refreshToken : REFRESH_TOKEN,
            accessToken : accessToken
        }
    })

    const mailOptions1 = {
        from : "Care For You <careforyou11022001@gmail.com>",
        to: email,
        subject : sbj1,
        text : msg1
    };
    const mailOptions2 = {
        from : `Care For You <careforyou11022001@gmail.com>`,
        to: "careforyou11022001@gmail.com",
        subject : sbj2,
        text : msg2
    };

    const result1 = await transport.sendMail(mailOptions1);
    const result2 = await transport.sendMail(mailOptions2);
    // console.log(result1);
    // console.log(result2);
    return result1,result2;
   } catch (error) {
       return error;
   }
}

module.exports = sendMail;

