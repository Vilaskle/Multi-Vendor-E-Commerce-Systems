
// import nodemailer from "nodemailer";

// // 🔹 Central OTP Email Sender
// export const sendOtpEmail = async ({
//   to,
//   otp,
//   purpose = "LOGIN",        // LOGIN | REGISTER | RESET_PASSWORD
//   role = "USER",            // USER | VENDOR | ADMIN
// }) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
//   const titles = {
//     LOGIN: "One-Time Password (OTP)",
//     REGISTER: "Verify Your Email",
//     RESET_PASSWORD: "Reset Your Password",
//   };

//   const roleGreeting = {
//     USER: "Hello",
//     VENDOR: "Hello Vendor",
//     ADMIN: "Hello Admin",
//   };

//   const purposeText = {
//     LOGIN: "to log in to your account",
//     REGISTER: "to verify your email address",
//     RESET_PASSWORD: "to reset your password",
//   };

//   const htmlTemplate = `
//     <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
//       <div style="max-width: 520px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">
        
//         <h2 style="color: #333; text-align: center;">
//           ${titles[purpose]}
//         </h2>

//         <p style="color: #555; font-size: 15px;">
//           ${roleGreeting[role]},
//         </p>

//         <p style="color: #555; font-size: 15px;">
//           You requested ${purposeText[purpose]}.  
//           Please use the following <strong>One-Time Password (OTP)</strong>:
//         </p>

//         <div style="
//           text-align: center;
//           font-size: 30px;
//           letter-spacing: 5px;
//           font-weight: bold;
//           color: #1a73e8;
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
//           If you did not request this, please ignore this email.
//         </p>

//         <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

//         <p style="color: #777; font-size: 13px; text-align: center;">
//           © ${new Date().getFullYear()} Multi-Vendor E-Commerce Platform
//         </p>
//       </div>
//     </div>
//   `;

//   await transporter.sendMail({
//     from: `"E-Commerce App" <${process.env.EMAIL_USER}>`,
//     to,
//     subject: titles[purpose],
//     html: htmlTemplate,
//   });
// };




import nodemailer from "nodemailer";

/**
 * sendOtpEmail
 * - Used for OTP (register, login)
 * - Used for reset password (link)
 *
 * @param {string} to - receiver email
 * @param {string} otp - OTP number OR reset link
 * @param {string} purpose - REGISTER | LOGIN | RESET_PASSWORD
 * @param {string} role - USER | VENDOR | ADMIN
 */
export const sendOtpEmail = async ({ to, otp, purpose, role }) => {
  // 1️⃣ Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2️⃣ Decide if OTP or LINK
  const isResetLink = purpose === "RESET_PASSWORD";

  // 3️⃣ Dynamic title & message
  const titleMap = {
    REGISTER: "Verify Your Email",
    LOGIN: "Your Login OTP",
    RESET_PASSWORD: "Reset Your Password",
  };

  const messageMap = {
    REGISTER:
      "Use the OTP below to verify your email address.",
    LOGIN:
      "Use the OTP below to log in to your account.",
    RESET_PASSWORD:
      "Click the button below to reset your password.",
  };

  // 4️⃣ Action block (OTP or Button)
  const actionBlock = isResetLink
    ? `
      <a href="${otp}"
         style="
           display: inline-block;
           padding: 14px 26px;
           background-color: #1a73e8;
           color: #ffffff;
           text-decoration: none;
           border-radius: 6px;
           font-size: 16px;
           font-weight: bold;
         ">
        Reset Password
      </a>
    `
    : `
      <div style="
        text-align: center;
        font-size: 30px;
        letter-spacing: 6px;
        font-weight: bold;
        color: #1a73e8;
        background: #eef3ff;
        padding: 16px;
        border-radius: 6px;
        margin: 22px 0;
      ">
        ${otp}
      </div>
    `;

  // 5️⃣ HTML template
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
      <div style="max-width: 520px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">
        
        <h2 style="text-align: center; color: #333;">
          ${titleMap[purpose]}
        </h2>

        <p style="color: #555; font-size: 15px;">
          Hello ${role},
        </p>

        <p style="color: #555; font-size: 15px;">
          ${messageMap[purpose]}
        </p>

        <div style="text-align: center; margin: 25px 0;">
          ${actionBlock}
        </div>

        <p style="color: #555; font-size: 14px;">
          This ${
            isResetLink ? "link" : "OTP"
          } is valid for <strong>${
            isResetLink ? "15 minutes" : "5 minutes"
          }</strong>.
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

  // 6️⃣ Send mail
  await transporter.sendMail({
    from: `"Multi-Vendor Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject: titleMap[purpose],
    html: htmlTemplate,
  });
};