export const emailTemplate = {
  welcome: (firstName: string) => `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    
    <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:8px;">
      
      <h2 style="color:#2c3e50;">Students Association</h2>

      <p>Hello ${firstName},</p>

      <p>
        Thank you for registering at <b>Students Association</b>! 
        We're excited to have you on board.
      </p>

      <p>
        You can now login to your account and explore the various features 
        we offer including event registrations, articles, and more.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a href="http://localhost:5000/login"
           style="background:#2563eb; color:white; padding:12px 25px; 
           text-decoration:none; border-radius:5px; font-weight:bold;">
           Login to your account
        </a>
      </div>

      <p>
        Best regards,<br>
        <b>Students Association Team</b>
      </p>

      <hr style="margin-top:30px;">

      <p style="font-size:12px; color:#777;">
        If you did not create this account, please ignore this email.
      </p>

    </div>

  </div>
  `,


   verify: (firstName: string, code: string) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hello ${firstName}!</h2>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>Please enter this code in the app to verify your email address.</p>
        <br />
        <p> Thank you,<br/>Students Association Team</p>
    </div>
    `,

  verifiedSuccess: (firstName: string) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Hello ${firstName},</h2>
      <p> Your account has been verified successfully!</p>
      <p>You can now login to your account.</p>
      <br/>
      <p> Thank you,<br/>Cake by Liz</p>
    </div>
    `,
};