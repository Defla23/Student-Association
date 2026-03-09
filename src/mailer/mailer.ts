import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


export const sendEmail = async (to: string, subject: string, html?: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 465,
            service:'gmail',
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.MAIL_USER,
            to,
            subject,
            html
        };

       const mailRes = await transporter.sendMail(mailOptions)
         console.log("Email sent:", mailRes);
         if (mailRes.accepted.length > 0) return'Email sent successfully';
         if (mailRes.rejected.length > 0) return `Failed to send email to: ${mailRes.rejected.join(", ")}`;
         return 'Email server not responding';
    } catch (error: any) {
        console.error("Error sending email:", error.message);
        return JSON.stringify({ message: "Failed to send email", error: error.message });
        throw error;
    }
};