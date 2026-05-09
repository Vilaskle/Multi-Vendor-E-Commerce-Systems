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




export const sendOrderEmail = async ({
  to,
  name,
  type,
  orderId,
  orderDate,
  amount,
  productName,
  quantity,
  reason,
  refundId,
  oldSize,
  newSize,
  oldColor,
newColor,
  refundDetails ,
   paymentMethod  
}) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  /* ================= SUBJECT ================= */

  const subjectMap = {
    CANCEL: "Order Cancelled & Refund Initiated",
    RETURN_REQUESTED: "Return Request Received",
    RETURN_APPROVED: "Return Approved",
    RETURN_REJECTED: "Return Request Rejected",
    RETURN_COMPLETED: "Return Completed & Refund Initiated",
    EXCHANGE_REQUESTED: "Exchange Request Received",
    EXCHANGE_SHIPPED: "Replacement Item Shipped",
  };

  /* ================= TEMPLATES ================= */

  const templates = {

    CANCEL: `
  <p>Hi ${name},</p>

  <p>Your order has been successfully cancelled.</p>

  <p><strong>Order Details:</strong><br/>
  Order ID: #${orderId}<br/>
  Order Date: ${orderDate}<br/>
  Total Amount: ₹${amount}</p>

  ${
    paymentMethod === "ONLINE"
      ? `
        <p><strong>Refund Details:</strong><br/>
        Your refund of ₹${amount} has been initiated and will be credited to your original payment method within 5–7 business days.</p>

        <p><strong>Refund Reference ID:</strong> ${refundId}</p>
      `
      : `
        <p>You chose Cash on Delivery. Since no payment was made, no refund is required.</p>
      `
  }

  <p>If you did not request this cancellation or need any help, please contact our support team.</p>

  <p>Thank you for shopping with us.</p>

  <p>Best regards,<br/>Your Store Team</p>
`,

    /* ✅ RETURN REQUEST */
    RETURN_REQUESTED: `
      <p>Hi ${name},</p>

      <p>We have received your return request.</p>

      <p><strong>Order Details:</strong><br/>
      Order ID: #${orderId}<br/>
      Product: ${productName}<br/>
      Quantity: ${quantity}</p>

      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}

<p>Our team will review your request and arrange a pickup shortly.</p>

${refundId ? "" : `
${amount ? `Amount: ₹${amount}<br/>` : ""}
${refundDetails?.upiId ? `UPI: ${refundDetails.upiId}<br/>` : ""}
${refundDetails?.bankAccountNumber ? `
Account No: ${refundDetails.bankAccountNumber}<br/>
IFSC: ${refundDetails.bankIFSC}<br/>
Bank: ${refundDetails.bankName}<br/>
Name: ${refundDetails.accountHolderName}
` : ""}
</p>
`}
      <p>Once the item is picked up and verified, your refund will be initiated.</p>

      <p>If you need help, feel free to contact support.</p>

      <p>Best regards,<br/>Your Store Team</p>
    `,

    RETURN_APPROVED: `
  <p>Hi ${name},</p>

  <p>Your return request has been approved.</p>

  <p><strong>Order Details:</strong><br/>
  Order ID: #${orderId}<br/>
  Product: ${productName}<br/>
  Quantity: ${quantity}</p>

  <p>Our team will arrange a pickup soon.</p>

  <p>Once the item is received and verified, your refund will be processed.</p>

  <p>Thank you for your patience.</p>

  <p>Best regards,<br/>Your Store Team</p>
`,

RETURN_REJECTED: `
  <p>Hi ${name},</p>

  <p>We regret to inform you that your return request has been rejected.</p>

  <p><strong>Order Details:</strong><br/>
  Order ID: #${orderId}<br/>
  Product: ${productName}<br/>
  Quantity: ${quantity}</p>

  ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}

  <p>If you believe this was a mistake, please contact our support team.</p>

  <p>Thank you for your understanding.</p>

  <p>Best regards,<br/>Your Store Team</p>
`,
    /* ✅ RETURN COMPLETED + REFUND */
    RETURN_COMPLETED: `
      <p>Hi ${name},</p>

      <p>Your returned item has been successfully received and verified.</p>

      <p><strong>Order Details:</strong><br/>
      Order ID: #${orderId}<br/>
      Product: ${productName}</p>

      <p><strong>Refund Details:</strong><br/>
We have initiated your refund of ₹${amount}. 

${
  paymentMethod === "COD"
    ? "The amount has been transferred to your provided bank account."
    : "The amount will be credited to your original payment method within 5–7 business days."
}
</p>
      <p><strong>Refund Reference ID:</strong> ${refundId}</p>

      <p>Thank you for your patience.</p>

      <p>Best regards,<br/>Your Store Team</p>
    `,

    /* ✅ EXCHANGE REQUEST */
    EXCHANGE_REQUESTED: `
      <p>Hi ${name},</p>

      <p>We have received your exchange request.</p>

      <p><strong>Order Details:</strong><br/>
      Order ID: #${orderId}<br/>
      Product: ${productName}</p>

      <p><strong>Requested Exchange:</strong><br/>
${
  oldSize || newSize
    ? `${oldSize || "-"} → ${newSize || "-"}`
    : ""
}
${
  oldColor || newColor
    ? `<br/>${oldColor || "-"} → ${newColor || "-"}`
    : ""
}
</p>
      <p>Our team will arrange pickup of the original item and process your exchange.</p>

      <p><strong>No refund will be issued as this is a product exchange.</strong></p>

      <p>We will notify you once the replacement is shipped.</p>

      <p>Best regards,<br/>Your Store Team</p>
    `,

    /* ✅ EXCHANGE SHIPPED */
    EXCHANGE_SHIPPED: `
      <p>Hi ${name},</p>

      <p>Your replacement item has been shipped successfully.</p>

      <p><strong>Order ID:</strong> #${orderId}<br/>
Replaced Product: ${productName}
${
  newSize || newColor
    ? `<br/><strong>Updated To:</strong><br/>
        ${newSize ? `Size: ${newSize}` : ""}
        ${newSize && newColor ? "<br/>" : ""}
        ${newColor ? `Color: ${newColor}` : ""}`
    : ""
}
</p>

      <p>The item will be delivered within 3–5 business days.</p>

      <p>Thank you for your patience and cooperation.</p>

      <p>Best regards,<br/>Your Store Team</p>
    `,
  };

  /* ================= FINAL HTML ================= */

  const html = `
    <div style="font-family: Arial; padding:20px; line-height:1.6;">
      ${templates[type]}
      <hr/>
      <p style="font-size:12px; color:#777;">
        © ${new Date().getFullYear()} Multi-Vendor Platform
      </p>
    </div>
  `;

  /* ================= SEND ================= */

  await transporter.sendMail({
    from: `"Your Store" <${process.env.EMAIL_USER}>`,
    to,
    subject: subjectMap[type],
    html,
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