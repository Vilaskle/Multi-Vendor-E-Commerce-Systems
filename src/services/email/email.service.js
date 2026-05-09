
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

// ─── ADD THIS AT BOTTOM OF email.service.js ───────────────────────────────────
// Vendor status notification emails
export const sendVendorStatusEmail = async ({ to, vendorName, status, reason = "" }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const templates = {
    // Case 1: vendor just registered → under review
    UNDER_REVIEW: {
      subject: "Your Vendor Application is Under Review",
      color: "#f59e0b",
      icon: "⏳",
      title: "Application Under Review",
      body: `
        <p style="color: #555; font-size: 15px;">
          Thank you for registering as a vendor on our platform.
        </p>
        <p style="color: #555; font-size: 15px;">
          Your application and documents have been received successfully.
          Our admin team will verify your details and get back to you shortly.
        </p>
        <div style="
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 14px 18px;
          border-radius: 4px;
          margin: 20px 0;
        ">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            ⏱️ Verification usually takes <strong>1–2 business days</strong>.
            You will receive an email once your account is reviewed.
          </p>
        </div>
        <p style="color: #555; font-size: 14px;">
          Please do not attempt to login until you receive an approval email.
        </p>
      `,
    },

    // Case 2: admin approved the vendor
    APPROVED: {
      subject: "🎉 Congratulations! Your Vendor Account is Approved",
      color: "#22c55e",
      icon: "✅",
      title: "Account Approved",
      body: `
        <p style="color: #555; font-size: 15px;">
          Great news! Your vendor account has been <strong>successfully approved</strong>
          by our admin team.
        </p>
        <div style="
          background: #f0fdf4;
          border-left: 4px solid #22c55e;
          padding: 14px 18px;
          border-radius: 4px;
          margin: 20px 0;
        ">
          <p style="margin: 0; color: #166534; font-size: 14px;">
            ✅ You can now <strong>login to your vendor panel</strong> and start
            listing your products.
          </p>
        </div>
        <p style="color: #555; font-size: 14px;">
          You can login using your registered email address via OTP.
        </p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${process.env.VENDOR_PANEL_URL || "#"}"
             style="
               display: inline-block;
               padding: 14px 28px;
               background-color: #22c55e;
               color: #ffffff;
               text-decoration: none;
               border-radius: 6px;
               font-size: 16px;
               font-weight: bold;
             ">
            Login to Vendor Panel
          </a>
        </div>
      `,
    },

    // Case 3: admin rejected the vendor
    REJECTED: {
      subject: "Update on Your Vendor Application",
      color: "#ef4444",
      icon: "❌",
      title: "Application Not Approved",
      body: `
        <p style="color: #555; font-size: 15px;">
          Thank you for your interest in becoming a vendor on our platform.
        </p>
        <p style="color: #555; font-size: 15px;">
          After reviewing your application and documents, we are unable to
          approve your vendor account at this time.
        </p>
        ${
          reason
            ? `
          <div style="
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 14px 18px;
            border-radius: 4px;
            margin: 20px 0;
          ">
            <p style="margin: 0 0 6px; color: #991b1b; font-size: 14px; font-weight: bold;">
              Reason for rejection:
            </p>
            <p style="margin: 0; color: #991b1b; font-size: 14px;">
              ${reason}
            </p>
          </div>
        `
            : ""
        }
        <p style="color: #555; font-size: 14px;">
          If you believe this is a mistake or would like to re-apply with
          corrected documents, please contact our support team.
        </p>
      `,
    },
  };

  const template = templates[status];
  if (!template) throw new Error(`Invalid vendor email status: ${status}`);

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
      <div style="max-width: 520px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">

        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 40px;">${template.icon}</span>
          <h2 style="color: ${template.color}; margin: 10px 0 0;">
            ${template.title}
          </h2>
        </div>

        <p style="color: #555; font-size: 15px;">
          Hello <strong>${vendorName}</strong>,
        </p>

        ${template.body}

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

        <p style="color: #777; font-size: 13px; text-align: center;">
          © ${new Date().getFullYear()} Multi-Vendor E-Commerce Platform
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Multi-Vendor Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject: template.subject,
    html: htmlTemplate,
  });
};