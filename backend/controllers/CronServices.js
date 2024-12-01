
const { sendEmail } = require('./Mailer');
const cron = require('node-cron');
cron.schedule('* * * * *', async () => {
    console.log('running a task every minute');
});
// cron.schedule('52 21 * * *', async () => {
//     try {
//         console.log("Starting birthday promo job:", new Date().toLocaleString());
//         // const today = new Date();
//         // const month = today.getMonth() + 1;
//         // const day = today.getDate();

//         // const birthdayUsers = await Tourist.find({
//         //     $expr: {
//         //         $and: [
//         //             { $eq: [{ $month: "$dateOfBirth" }, month] },
//         //             { $eq: [{ $dayOfMonth: "$dateOfBirth" }, day] }
//         //         ]
//         //     }
//         // });

//         // console.log(`Found ${birthdayUsers.length} users with birthdays today`);

//         // for (const user of birthdayUsers) {
//         //     try {
//         //         const name = "HI"
//         //         const discount = 20;

//         //         const subject = `🎉 Happy Birthday from Tripal!`;
//         //         const html = `
//         //             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         //                 <h1 style="color: #5a9ea0;">Happy Birthday, ${user.userName}! 🎂</h1>

//         //                 <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
//         //                     <h2 style="color: #036264; margin: 0;">🎁 Your Birthday Gift</h2>
//         //                     <p style="font-size: 18px;">Enjoy <strong>${discount}% OFF</strong> your next adventure!</p>
//         //                     <div style="background: #ffffff; padding: 15px; border-radius: 4px; text-align: center; margin: 15px 0;">
//         //                         <p style="font-size: 24px; font-weight: bold; color: #5a9ea0; margin: 0;">
//         //                             ${name}
//         //                         </p>
//         //                     </div>
//         //                     <p style="color: #666; font-size: 14px;">Valid for the next 24 hours</p>
//         //                 </div>

//         //                 <p>Don't miss out on this exclusive birthday offer! 
//         //                     Book your next trip today and make your birthday month even more special.</p>

//         //                 <p style="color: #666; font-size: 12px;">
//         //                     * Promo code expires in 24 hours • Cannot be combined with other offers
//         //                 </p>

//         //                 <p style="margin-top: 30px;">
//         //                     Happy Travels!<br/>
//         //                     The Tripal Team ✈️
//         //                 </p>
//         //             </div>
//         //         `;

//         //         await sendEmail(user.email, subject, html);
//         //         console.log(`Birthday email sent to ${user.userName}`);

//         // } catch (error) {
//         //     console.error(`Error processing birthday email for ${user.userName}:`, error.message);
//         //     continue;
//         // }
//         // }
//     } catch (error) {
//         console.error('Birthday promo job failed:', error);
//     }
// }, {
//     scheduled: true,
//     timezone: "Africa/Cairo"
// });

