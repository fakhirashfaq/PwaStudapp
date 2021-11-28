import * as functions from 'firebase-functions';
import { Constants } from '../../src/app/shared/utils/constants';
import { firestore } from './db';
import * as admin from 'firebase-admin';
const nodemailer = require('nodemailer');

/**
 * @description Unsubscribe Newsletter
 * @summary req will be as follows:
 * "https://us-central1-stubud-bb83b.cloudfunctions.net/unsubscribeNewsletter/" + email;
 *
 */
export const unsubscribeNewsletter = functions.https.onRequest((req, res) => {

   const urlValues: string[] = req.originalUrl.split(Constants.slash);

   if (!isReqValuesValid(urlValues)) { // Invalid request parameters
      console.info("Invalid request passed. Request: ", req.originalUrl);
      res.sendStatus(404).end();
      return;
   }

   const email: string = urlValues[1];

   const transporter = nodemailer.createTransport({ // Create A Nodemailer Transporter. transporter is going to be an object that is able to send mail
      host: 'server215.web-hosting.com',
      port: 465,
      secure: true,
      auth: {
         user: 'noreply@stubud.com',
         pass: 'TempP@ass2021'
      }
   });

   Promise.all(
      [firestore.doc(Constants.fbPathRefDiscountsUpdatesDoc).set({
         [email]: admin.firestore.FieldValue.delete()
      }, { merge: true })
         ,
      transporter.sendMail(getMailContent(email)).then(() => {
         console.info("Unsubscribed mail sent to user: ", email)
         return Promise.resolve();
      }).catch((error: any) => {
         console.error("Error sending unsubscribe mail to user: " + email, error);
         throw new functions.https.HttpsError('unknown', "Nodemailer failed to send mail to user: " + email);
      })
      ]
   )
      .then(() => {
         console.info("Email: " + email + " unsubscribed.");
         res.redirect(Constants.domain);
      })
      .catch((error) => {
         console.error("Unable to unsubscribed email: " + email, (error));
         res.redirect(Constants.domain);
      })

});

// res.redirect(Constants.domain)
/**
 * @description Check if request contains necessary values
 *
 * @param {string[]} requestValues
 * @return {*}  {boolean}
 */
function isReqValuesValid(requestValues: string[]): boolean {
   return !!requestValues[1] ? true : false;
}

/**
 * @description Get email unsubscribed content
 *
 * @param {string} email
 * @returns {*}
 */
function getMailContent(email: string): any {
   return { // setup e-mail data with unicode symbols
      from: 'Stubud <noreply@stubud.com>', // sender address
      to: email, // list of receivers
      bcc: 'kar39.stubud@gmail.com',
      tile: `Hello There`,
      subject: `Unsubscribed`, // Subject line
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
   <head>
      <!--[if gte mso 9]>
      <xml>
         <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
         </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
      <meta content="width=device-width" name="viewport"/>
      <!--[if !mso]><!-->
      <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
      <!--<![endif]-->
      <title>Unsubscribed</title>
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet" type="text/css"/>
      <link href="https://fonts.googleapis.com/css?family=Permanent+Marker" rel="stylesheet" type="text/css"/>
      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css"/>
      <!--<![endif]-->
      <style type="text/css">
         body {
         margin: 0;
         padding: 0;
         }
         table,
         td,
         tr {
         vertical-align: top;
         border-collapse: collapse;
         }
         * {
         line-height: inherit;
         }
         a[x-apple-data-detectors=true] {
         color: inherit !important;
         text-decoration: none !important;
         }
      </style>
      <style id="media-query" type="text/css">
         @media (max-width: 520px) {
         .block-grid,
         .col {
         min-width: 320px !important;
         max-width: 100% !important;
         display: block !important;
         }
         .block-grid {
         width: 100% !important;
         }
         .col {
         width: 100% !important;
         }
         .col_cont {
         margin: 0 auto;
         }
         img.fullwidth,
         img.fullwidthOnMobile {
         width: 100% !important;
         }
         .no-stack .col {
         min-width: 0 !important;
         display: table-cell !important;
         }
         .no-stack.two-up .col {
         width: 50% !important;
         }
         .no-stack .col.num2 {
         width: 16.6% !important;
         }
         .no-stack .col.num3 {
         width: 25% !important;
         }
         .no-stack .col.num4 {
         width: 33% !important;
         }
         .no-stack .col.num5 {
         width: 41.6% !important;
         }
         .no-stack .col.num6 {
         width: 50% !important;
         }
         .no-stack .col.num7 {
         width: 58.3% !important;
         }
         .no-stack .col.num8 {
         width: 66.6% !important;
         }
         .no-stack .col.num9 {
         width: 75% !important;
         }
         .no-stack .col.num10 {
         width: 83.3% !important;
         }
         .video-block {
         max-width: none !important;
         }
         .mobile_hide {
         min-height: 0px;
         max-height: 0px;
         max-width: 0px;
         display: none;
         overflow: hidden;
         font-size: 0px;
         }
         .desktop_hide {
         display: block !important;
         max-height: none !important;
         }
         }
      </style>
   </head>
   <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
      <!--[if IE]>
      <div class="ie-browser">
         <![endif]-->
         <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;" valign="top" width="100%">
            <tbody>
               <tr style="vertical-align: top;" valign="top">
                  <td style="word-break: break-word; vertical-align: top;" valign="top">
                     <!--[if (mso)|(IE)]>
                     <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                           <td align="center" style="background-color:#FFFFFF">
                              <![endif]-->
                              <div style="background-color:transparent;">
                                 <div class="block-grid mixed-two-up no-stack" style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                       <!--[if (mso)|(IE)]>
                                       <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;">
                                          <tr>
                                             <td align="center">
                                                <table cellpadding="0" cellspacing="0" border="0" style="width:500px">
                                                   <tr class="layout-full-width" style="background-color:transparent">
                                                      <![endif]-->
                                                      <!--[if (mso)|(IE)]>
                                                      <td align="center" width="125" style="background-color:transparent;width:125px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top">
                                                         <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                            <tr>
                                                               <td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;">
                                                                  <![endif]-->
                                                                  <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 123px; width: 125px;">
                                                                     <div class="col_cont" style="width:100% !important;">
                                                                        <!--[if (!mso)&(!IE)]><!-->
                                                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                                           <!--<![endif]-->
                                                                           <div align="center" class="img-container center fixedwidth" style="padding-right: 15px;padding-left: 15px;">
                                                                              <!--[if mso]>
                                                                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                                 <tr style="line-height:0px">
                                                                                    <td style="padding-right: 15px;padding-left: 15px;" align="center">
                                                                                       <![endif]--><a href="https://stubud-bb83b.firebaseapp.com/" style="outline:none" tabindex="-1" target="_blank"><img align="center" alt="Stubud" border="0" class="center fixedwidth" src="https://firebasestorage.googleapis.com/v0/b/stubud-bb83b.appspot.com/o/assets%2Flogo.png?alt=media&amp;token=ecd662b6-31bc-4724-9cdd-19d97de32257" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 75px; max-width: 100%; display: block;" title="Stubud" width="75"/></a>
                                                                                       <!--[if mso]>
                                                                                    </td>
                                                                                 </tr>
                                                                              </table>
                                                                              <![endif]-->
                                                                           </div>
                                                                           <!--[if (!mso)&(!IE)]><!-->
                                                                        </div>
                                                                        <!--<![endif]-->
                                                                     </div>
                                                                  </div>
                                                                  <!--[if (mso)|(IE)]>
                                                               </td>
                                                            </tr>
                                                         </table>
                                                         <![endif]-->
                                                         <!--[if (mso)|(IE)]>
                                                      </td>
                                                      <td align="center" width="375" style="background-color:transparent;width:375px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top">
                                                         <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                            <tr>
                                                               <td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;">
                                                                  <![endif]-->
                                                                  <div class="col num9" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 369px; width: 375px;">
                                                                     <div class="col_cont" style="width:100% !important;">
                                                                        <!--[if (!mso)&(!IE)]><!-->
                                                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                                           <!--<![endif]-->
                                                                           <!--[if mso]>
                                                                           <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                              <tr>
                                                                                 <td style="padding-right: 35px; padding-left: 35px; padding-top: 30px; padding-bottom: 5px; font-family: Arial, sans-serif">
                                                                                    <![endif]-->
                                                                                    <div style="color:#585858;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:30px;padding-right:35px;padding-bottom:5px;padding-left:35px;">
                                                                                       <div class="txtTinyMce-wrapper" style="font-size: 14px; line-height: 1.2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #585858; mso-line-height-alt: 17px;">
                                                                                          <p style="margin: 0; font-size: 14px; line-height: 1.2; text-align: right; word-break: break-word; mso-line-height-alt: 17px; margin-top: 0; margin-bottom: 0;"><a href="https://stubud-bb83b.firebaseapp.com/auth/login" rel="noopener" style="color: #585858;text-decoration: none" target="_blank">Login to Stubud.com</a><br/></p>
                                                                                       </div>
                                                                                    </div>
                                                                                    <!--[if mso]>
                                                                                 </td>
                                                                              </tr>
                                                                           </table>
                                                                           <![endif]-->
                                                                           <!--[if (!mso)&(!IE)]><!-->
                                                                        </div>
                                                                        <!--<![endif]-->
                                                                     </div>
                                                                  </div>
                                                                  <!--[if (mso)|(IE)]>
                                                               </td>
                                                            </tr>
                                                         </table>
                                                         <![endif]-->
                                                         <!--[if (mso)|(IE)]>
                                                      </td>
                                                   </tr>
                                                </table>
                                             </td>
                                          </tr>
                                       </table>
                                       <![endif]-->
                                    </div>
                                 </div>
                              </div>
                              <div style="background-color:transparent;">
                                 <div class="block-grid" style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                       <!--[if (mso)|(IE)]>
                                       <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;">
                                          <tr>
                                             <td align="center">
                                                <table cellpadding="0" cellspacing="0" border="0" style="width:500px">
                                                   <tr class="layout-full-width" style="background-color:transparent">
                                                      <![endif]-->
                                                      <!--[if (mso)|(IE)]>
                                                      <td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top">
                                                         <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                            <tr>
                                                               <td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;">
                                                                  <![endif]-->
                                                                  <div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                                                     <div class="col_cont" style="width:100% !important;">
                                                                        <!--[if (!mso)&(!IE)]><!-->
                                                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                                           <!--<![endif]-->
                                                                           <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
                                                                              <tbody>
                                                                                 <tr style="vertical-align: top;" valign="top">
                                                                                    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                                                       <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
                                                                                          <tbody>
                                                                                             <tr style="vertical-align: top;" valign="top">
                                                                                                <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                           <!--[if (!mso)&(!IE)]><!-->
                                                                        </div>
                                                                        <!--<![endif]-->
                                                                     </div>
                                                                  </div>
                                                                  <!--[if (mso)|(IE)]>
                                                               </td>
                                                            </tr>
                                                         </table>
                                                         <![endif]-->
                                                         <!--[if (mso)|(IE)]>
                                                      </td>
                                                   </tr>
                                                </table>
                                             </td>
                                          </tr>
                                       </table>
                                       <![endif]-->
                                    </div>
                                 </div>
                              </div>
                              <div style="background-color:transparent;">
                                 <div class="block-grid" style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                       <!--[if (mso)|(IE)]>
                                       <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;">
                                          <tr>
                                             <td align="center">
                                                <table cellpadding="0" cellspacing="0" border="0" style="width:500px">
                                                   <tr class="layout-full-width" style="background-color:transparent">
                                                      <![endif]-->
                                                      <!--[if (mso)|(IE)]>
                                                      <td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top">
                                                         <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                            <tr>
                                                               <td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;">
                                                                  <![endif]-->
                                                                  <div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                                                     <div class="col_cont" style="width:100% !important;">
                                                                        <!--[if (!mso)&(!IE)]><!-->
                                                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                                           <!--<![endif]-->
                                                                           <table cellpadding="0" cellspacing="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top" width="100%">
                                                                              <tr style="vertical-align: top;" valign="top">
                                                                                 <td align="center" style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;" valign="top" width="100%">
                                                                                    <h1 style="color:#000000;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:26px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;"><strong>Unsubscribed!!</strong></h1>
                                                                                 </td>
                                                                              </tr>
                                                                           </table>
                                                                           <!--[if (!mso)&(!IE)]><!-->
                                                                        </div>
                                                                        <!--<![endif]-->
                                                                     </div>
                                                                  </div>
                                                                  <!--[if (mso)|(IE)]>
                                                               </td>
                                                            </tr>
                                                         </table>
                                                         <![endif]-->
                                                         <!--[if (mso)|(IE)]>
                                                      </td>
                                                   </tr>
                                                </table>
                                             </td>
                                          </tr>
                                       </table>
                                       <![endif]-->
                                    </div>
                                 </div>
                              </div>
                              <div style="background-color:transparent;">
                                 <div class="block-grid" style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                       <!--[if (mso)|(IE)]>
                                       <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;">
                                          <tr>
                                             <td align="center">
                                                <table cellpadding="0" cellspacing="0" border="0" style="width:500px">
                                                   <tr class="layout-full-width" style="background-color:transparent">
                                                      <![endif]-->
                                                      <!--[if (mso)|(IE)]>
                                                      <td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top">
                                                         <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                            <tr>
                                                               <td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;">
                                                                  <![endif]-->
                                                                  <div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                                                     <div class="col_cont" style="width:100% !important;">
                                                                        <!--[if (!mso)&(!IE)]><!-->
                                                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                                           <!--<![endif]-->
                                                                           <!--[if mso]>
                                                                           <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                              <tr>
                                                                                 <td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif">
                                                                                    <![endif]-->
                                                                                    <div style="color:#585858;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                                                       <div class="txtTinyMce-wrapper" style="font-size: 14px; line-height: 1.2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #585858; mso-line-height-alt: 17px;">
                                                                                          <p style="margin: 0; font-size: 17px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 20px; mso-ansi-font-size: 18px; margin-top: 0; margin-bottom: 0;"><span style="font-size: 17px; mso-ansi-font-size: 18px;">Your opinion matters to us.<br/></span></p><br>
                                                                                          <p style="margin: 0; font-size: 17px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 20px; mso-ansi-font-size: 18px; margin-top: 0; margin-bottom: 0;"> </p>
                                                                                          <p style="margin: 0; font-size: 17px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 20px; mso-ansi-font-size: 18px; margin-top: 0; margin-bottom: 0;">We received your request to unsubscribe and you won't receive anymore updates, promotions and newsletters from us.</p><br>
                                                                                          <p style="margin: 0; font-size: 17px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 20px; mso-ansi-font-size: 18px; margin-top: 0; margin-bottom: 0;"> </p>
                                                                                          <p style="margin: 0; font-size: 17px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 20px; mso-ansi-font-size: 18px; margin-top: 0; margin-bottom: 0;">If you change your mind at anytime, you can re-subscribe to our newsletter on our website.</p><br>
                                                                                          <p style="margin: 0; font-size: 17px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 20px; mso-ansi-font-size: 18px; margin-top: 0; margin-bottom: 0;"> </p>
                                                                                          <p style="margin: 0; font-size: 17px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 20px; mso-ansi-font-size: 18px; margin-top: 0; margin-bottom: 0;">Have a great day,</p><br>
                                                                                          <p style="margin: 0; font-size: 17px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 20px; mso-ansi-font-size: 18px; margin-top: 0; margin-bottom: 0;"> </p>
                                                                                          <p style="margin: 0; font-size: 17px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 20px; mso-ansi-font-size: 18px; margin-top: 0; margin-bottom: 0;">Cheers.</p>
                                                                                       </div>
                                                                                    </div>
                                                                                    <!--[if mso]>
                                                                                 </td>
                                                                              </tr>
                                                                           </table>
                                                                           <![endif]-->
                                                                           <!--[if (!mso)&(!IE)]><!-->
                                                                        </div>
                                                                        <!--<![endif]-->
                                                                     </div>
                                                                  </div>
                                                                  <!--[if (mso)|(IE)]>
                                                               </td>
                                                            </tr>
                                                         </table>
                                                         <![endif]-->
                                                         <!--[if (mso)|(IE)]>
                                                      </td>
                                                   </tr>
                                                </table>
                                             </td>
                                          </tr>
                                       </table>
                                       <![endif]-->
                                    </div>
                                 </div>
                              </div>
                              <div style="background-color:transparent;">
                                 <div class="block-grid" style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                       <!--[if (mso)|(IE)]>
                                       <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;">
                                          <tr>
                                             <td align="center">
                                                <table cellpadding="0" cellspacing="0" border="0" style="width:500px">
                                                   <tr class="layout-full-width" style="background-color:transparent">
                                                      <![endif]-->
                                                      <!--[if (mso)|(IE)]>
                                                      <td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top">
                                                         <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                            <tr>
                                                               <td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;">
                                                                  <![endif]-->
                                                                  <div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                                                     <div class="col_cont" style="width:100% !important;">
                                                                        <!--[if (!mso)&(!IE)]><!-->
                                                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                                           <!--<![endif]-->
                                                                           <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
                                                                              <tbody>
                                                                                 <tr style="vertical-align: top;" valign="top">
                                                                                    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                                                       <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
                                                                                          <tbody>
                                                                                             <tr style="vertical-align: top;" valign="top">
                                                                                                <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                           <!--[if (!mso)&(!IE)]><!-->
                                                                        </div>
                                                                        <!--<![endif]-->
                                                                     </div>
                                                                  </div>
                                                                  <!--[if (mso)|(IE)]>
                                                               </td>
                                                            </tr>
                                                         </table>
                                                         <![endif]-->
                                                         <!--[if (mso)|(IE)]>
                                                      </td>
                                                   </tr>
                                                </table>
                                             </td>
                                          </tr>
                                       </table>
                                       <![endif]-->
                                    </div>
                                 </div>
                              </div>
                              <div style="background-color:transparent;">
                                 <div class="block-grid" style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                       <!--[if (mso)|(IE)]>
                                       <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;">
                                          <tr>
                                             <td align="center">
                                                <table cellpadding="0" cellspacing="0" border="0" style="width:500px">
                                                   <tr class="layout-full-width" style="background-color:transparent">
                                                      <![endif]-->
                                                      <!--[if (mso)|(IE)]>
                                                      <td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top">
                                                         <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                            <tr>
                                                               <td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;">
                                                                  <![endif]-->
                                                                  <div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                                                     <div class="col_cont" style="width:100% !important;">
                                                                        <!--[if (!mso)&(!IE)]><!-->
                                                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                                           <!--<![endif]-->
                                                                           <!--[if mso]>
                                                                           <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                              <tr>
                                                                                 <td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif">
                                                                                    <![endif]-->
                                                                                    <div style="color:#585858;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                                                       <div class="txtTinyMce-wrapper" style="font-size: 14px; line-height: 1.2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #585858; mso-line-height-alt: 17px;">
                                                                                          <p style="margin: 0; text-align: center; line-height: 1.2; word-break: break-word; font-size: 17px; mso-line-height-alt: 20px; mso-ansi-font-size: 18px; margin-top: 0; margin-bottom: 0;"><span style="font-size: 17px; mso-ansi-font-size: 18px;">Need help? Contact us at <a href="mailto:services@stubud.com?subject=Help&amp;body=type%20your%20message%20here" style="color: #04a3ff;">services@stubud.com</a></span></p>
                                                                                       </div>
                                                                                    </div>
                                                                                    <!--[if mso]>
                                                                                 </td>
                                                                              </tr>
                                                                           </table>
                                                                           <![endif]-->
                                                                           <!--[if (!mso)&(!IE)]><!-->
                                                                        </div>
                                                                        <!--<![endif]-->
                                                                     </div>
                                                                  </div>
                                                                  <!--[if (mso)|(IE)]>
                                                               </td>
                                                            </tr>
                                                         </table>
                                                         <![endif]-->
                                                         <!--[if (mso)|(IE)]>
                                                      </td>
                                                   </tr>
                                                </table>
                                             </td>
                                          </tr>
                                       </table>
                                       <![endif]-->
                                    </div>
                                 </div>
                              </div>
                              <div style="background-color:transparent;">
                                 <div class="block-grid no-stack" style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #04a3ff;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#04a3ff;">
                                       <!--[if (mso)|(IE)]>
                                       <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;">
                                          <tr>
                                             <td align="center">
                                                <table cellpadding="0" cellspacing="0" border="0" style="width:500px">
                                                   <tr class="layout-full-width" style="background-color:#04a3ff">
                                                      <![endif]-->
                                                      <!--[if (mso)|(IE)]>
                                                      <td align="center" width="500" style="background-color:#04a3ff;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top">
                                                         <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                            <tr>
                                                               <td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;">
                                                                  <![endif]-->
                                                                  <div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                                                     <div class="col_cont" style="width:100% !important;">
                                                                        <!--[if (!mso)&(!IE)]><!-->
                                                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                                           <!--<![endif]-->
                                                                           <table cellpadding="0" cellspacing="0" class="social_icons" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top" width="100%">
                                                                              <tbody>
                                                                                 <tr style="vertical-align: top;" valign="top">
                                                                                    <td style="word-break: break-word; vertical-align: top; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                                                       <table align="center" cellpadding="0" cellspacing="0" class="social_table" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-tspace: 0; mso-table-rspace: 0; mso-table-bspace: 0; mso-table-lspace: 0;" valign="top">
                                                                                          <tbody>
                                                                                             <tr align="center" style="vertical-align: top; display: inline-block; text-align: center;" valign="top">
                                                                                                <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 7.5px; padding-left: 7.5px;" valign="top"><a href="https://www.facebook.com/stubudofficial/" target="_blank"><img alt="Facebook" height="32" src="https://cdn.exclaimer.com/Handbook%20Images/facebook-icon_64x64.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; display: block;" title="facebook" width="32"/></a></td>
                                                                                                <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 7.5px; padding-left: 7.5px;" valign="top"><a href="https://twitter.com/stubudofficial" target="_blank"><img alt="Twitter" height="32" src="https://cdn.exclaimer.com/Handbook%20Images/twitter-icon_64x64.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; display: block;" title="twitter" width="32"/></a></td>
                                                                                                <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 7.5px; padding-left: 7.5px;" valign="top"><a href="https://www.linkedin.com/in/stubud-ltd-0ab4711b0" target="_blank"><img alt="Linkedin" height="32" src="https://cdn.exclaimer.com/Handbook%20Images/linkedin-icon_64x64.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; display: block;" title="linkedin" width="32"/></a></td>
                                                                                                <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 7.5px; padding-left: 7.5px;" valign="top"><a href="https://www.instagram.com/stubudofficial/" target="_blank"><img alt="Instagram" height="32" src="https://cdn.exclaimer.com/Handbook%20Images/instagram-icon_64x64.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; display: block;" title="instagram" width="32"/></a></td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                           <!--[if mso]>
                                                                           <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                              <tr>
                                                                                 <td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif">
                                                                                    <![endif]-->
                                                                                    <div style="color:#ffffff;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                                                       <div class="txtTinyMce-wrapper" style="font-size: 14px; line-height: 1.2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff; mso-line-height-alt: 17px;">
                                                                                          <p align="center" style="margin: 0; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin-top: 0; margin-bottom: 0;">You received this email because you requested to unsubscribe to communications from STUBUD Ltd.</p><br>
                                                                                          <p align="center" style="margin: 0; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin-top: 0; margin-bottom: 0;"> </p>
                                                                                          <p align="center" style="margin: 0; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin-top: 0; margin-bottom: 0;">To ensure any delivery to your inbox, be sure to mark us as a Safe Sender by adding our email address to your contacts or address book.</p>
                                                                                       </div>
                                                                                    </div>
                                                                                    <!--[if mso]>
                                                                                 </td>
                                                                              </tr>
                                                                           </table>
                                                                           <![endif]-->
                                                                           <!--[if mso]>
                                                                           <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                              <tr>
                                                                                 <td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif">
                                                                                    <![endif]-->
                                                                                    <div style="color:#ffffff;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                                                       <div class="txtTinyMce-wrapper" style="font-size: 14px; line-height: 1.2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff; mso-line-height-alt: 17px;">
                                                                                          <p style="margin: 0; font-size: 14px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 17px; margin-top: 0; margin-bottom: 0;">Stubud Ltd.</p>
                                                                                          <p style="margin: 0; font-size: 14px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 17px; margin-top: 0; margin-bottom: 0;">17, Mallac Street | Rose-Hill | Mauritius</p>
                                                                                          <p style="margin: 0; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin-top: 0; margin-bottom: 0;">© Stubud Ltd. 2020 <strong>·</strong> All rights reserved</p>
                                                                                       </div>
                                                                                    </div>
                                                                                    <!--[if mso]>
                                                                                 </td>
                                                                              </tr>
                                                                           </table>
                                                                           <![endif]-->
                                                                           <!--[if (!mso)&(!IE)]><!-->
                                                                        </div>
                                                                        <!--<![endif]-->
                                                                     </div>
                                                                  </div>
                                                                  <!--[if (mso)|(IE)]>
                                                               </td>
                                                            </tr>
                                                         </table>
                                                         <![endif]-->
                                                         <!--[if (mso)|(IE)]>
                                                      </td>
                                                   </tr>
                                                </table>
                                             </td>
                                          </tr>
                                       </table>
                                       <![endif]-->
                                    </div>
                                 </div>
                              </div>
                              <!--[if (mso)|(IE)]>
                           </td>
                        </tr>
                     </table>
                     <![endif]-->
                  </td>
               </tr>
            </tbody>
         </table>
         <!--[if (IE)]>
      </div>
      <![endif]-->
   </body>
</html>
              ` // email content in HTML. You can write any Html template in here
   }
}