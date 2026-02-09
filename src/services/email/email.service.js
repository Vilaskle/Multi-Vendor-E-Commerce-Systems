
// import nodemailer from "nodemailer";

// export const sendEmailOtp = async (toEmail, otp) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const htmlTemplate = `
//     <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
//       <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">
        
//         <h2 style="color: #333; text-align: center;">
//           One-Time Password (OTP)
//         </h2>

//         <p style="color: #555; font-size: 15px;">
//           Hello,
//         </p>

//         <p style="color: #555; font-size: 15px;">
//           You requested to log in to your account. Please use the following
//           <strong>One-Time Password (OTP)</strong> to continue:
//         </p>

//         <div style="
//           text-align: center;
//           font-size: 28px;
//           letter-spacing: 4px;
//           font-weight: bold;
//           color: #1a73e8;
//           background: #eef3ff;
//           padding: 15px;
//           border-radius: 6px;
//           margin: 20px 0;
//         ">
//           ${otp}
//         </div>

//         <p style="color: #555; font-size: 14px;">
//           This OTP is valid for <strong>5 minutes</strong>. Please do not share
//           this code with anyone for security reasons.
//         </p>

//         <p style="color: #999; font-size: 13px;">
//           If you did not request this login, please ignore this email.
//         </p>

//         <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

//         <p style="color: #777; font-size: 13px; text-align: center;">
//           © ${new Date().getFullYear()} E-Commerce App. All rights reserved.
//         </p>

//       </div>
//     </div>
//   `;

//   await transporter.sendMail({
//     from: `"E-Commerce App" <${process.env.EMAIL_USER}>`,
//     to: toEmail,
//     subject: "Your One-Time Password (OTP)",
//     html: htmlTemplate,
//   });
// };


// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });




// export const sendVendorEmailOtp = async (toEmail, otp) => {
//    const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
  
//   const htmlTemplate = `
//     <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
//       <div style="max-width: 520px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">
        
//         <h2 style="color: #333; text-align: center;">
//           Vendor Login – One-Time Password
//         </h2>

//         <p style="color: #555; font-size: 15px;">
//           Hello Vendor,
//         </p>

//         <p style="color: #555; font-size: 15px;">
//           You requested to log in to your vendor account. Please use the following
//           <strong>One-Time Password (OTP)</strong> to continue:
//         </p>

//         <div style="
//           text-align: center;
//           font-size: 30px;
//           letter-spacing: 5px;
//           font-weight: bold;
//           color: #0b5ed7;
//           background: #eef3ff;
//           padding: 16px;
//           border-radius: 6px;
//           margin: 22px 0;
//         ">
//           ${otp}
//         </div>

//         <p style="color: #555; font-size: 14px;">
//           This OTP is valid for <strong>5 minutes</strong>.  
//           Do not share this code with anyone.
//         </p>

//         <p style="color: #999; font-size: 13px;">
//           If you did not request this login, please ignore this email.
//         </p>

//         <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

//         <p style="color: #777; font-size: 13px; text-align: center;">
//           © ${new Date().getFullYear()} Multi-Vendor Platform
//         </p>
//       </div>
//     </div>
//   `;

//   await transporter.sendMail({
//     from: `"Multi-Vendor Platform" <${process.env.EMAIL_USER}>`,
//     to: toEmail,
//     subject: "Your Vendor Login OTP",
//     html: htmlTemplate,
//   });
// };




import nodemailer from "nodemailer";

// 🔹 Central OTP Email Sender
export const sendOtpEmail = async ({
  to,
  otp,
  purpose = "LOGIN",        // LOGIN | REGISTER | RESET_PASSWORD
  role = "USER",            // USER | VENDOR | ADMIN
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const titles = {
    LOGIN: "One-Time Password (OTP)",
    REGISTER: "Verify Your Email",
    RESET_PASSWORD: "Reset Your Password",
  };

  const roleGreeting = {
    USER: "Hello",
    VENDOR: "Hello Vendor",
    ADMIN: "Hello Admin",
  };

  const purposeText = {
    LOGIN: "to log in to your account",
    REGISTER: "to verify your email address",
    RESET_PASSWORD: "to reset your password",
  };

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
      <div style="max-width: 520px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">
        
        <h2 style="color: #333; text-align: center;">
          ${titles[purpose]}
        </h2>

        <p style="color: #555; font-size: 15px;">
          ${roleGreeting[role]},
        </p>

        <p style="color: #555; font-size: 15px;">
          You requested ${purposeText[purpose]}.  
          Please use the following <strong>One-Time Password (OTP)</strong>:
        </p>

        <div style="
          text-align: center;
          font-size: 30px;
          letter-spacing: 5px;
          font-weight: bold;
          color: #1a73e8;
          background: #eef3ff;
          padding: 16px;
          border-radius: 6px;
          margin: 22px 0;
        ">
          ${otp}
        </div>

        <p style="color: #555; font-size: 14px;">
          This OTP is valid for <strong>5 minutes</strong>.  
          Do not share this code with anyone.
        </p>

        <p style="color: #999; font-size: 13px;">
          If you did not request this, please ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

        <p style="color: #777; font-size: 13px; text-align: center;">
          © ${new Date().getFullYear()} Multi-Vendor E-Commerce Platform
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"E-Commerce App" <${process.env.EMAIL_USER}>`,
    to,
    subject: titles[purpose],
    html: htmlTemplate,
  });
};
