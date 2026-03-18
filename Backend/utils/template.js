const icon = (path) => `
<svg width="20" height="20"
viewBox="0 0 24 24"
fill="none"
stroke="#9B96E5"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">
${path}
</svg>
`;

const icons = {
  user: icon(`
    <path d="M20 21v-2a4 4 0 0 0-4-4H8
    a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  `),

  lock: icon(`
    <rect x="3" y="11"
    width="18" height="11"
    rx="2"/>
    <path d="M7 11V7
    a5 5 0 0 1 10 0v4"/>
  `),

  calendar: icon(`
    <rect x="3" y="4"
    width="18" height="18"
    rx="2"/>
    <line x1="16" y1="2"
    x2="16" y2="6"/>
    <line x1="8" y1="2"
    x2="8" y2="6"/>
    <line x1="3" y1="10"
    x2="21" y2="10"/>
  `),
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");



const baseTemplate = (
  title,
  content,
  iconSvg
) => {

  return `

<div style="
background:#F6F1EB;
padding:40px;
font-family:Arial, sans-serif;
">

<div style="
max-width:600px;
margin:auto;
background:white;
border-radius:12px;
overflow:hidden;
box-shadow:0 10px 25px rgba(0,0,0,0.1);
">

<!-- HEADER -->

<div style="
background:linear-gradient(90deg,#9B96E5,#F08A6C);
padding:30px 20px;
color:white;
text-align:center;
font-size:24px;
font-weight:700;
">

EventSphere Notification

</div>


<!-- BODY -->

<div style="
padding:40px 30px;
color:#3F3D56;
">

<div style="
display:flex;
align-items:center;
gap:12px;
margin-bottom:15px;
">

${iconSvg}

<h2 style="
margin:0;
font-size:20px;
color:#9B96E5;
">
${title}
</h2>

</div>

<div style="
margin-top:15px;
line-height:1.6;
font-size:15px;
color:#3F3D56;
">

${content}

</div>

</div>


<!-- FOOTER -->

<div style="
background:#EED8D6;
padding:20px;
text-align:center;
font-size:12px;
color:#3F3D56;
border-top:1px solid #E5E7EB;
">

EventSphere • College Event Management System

</div>

</div>

</div>

`;
};



// ================= REGISTER

exports.registrationTemplate = (name) =>
  baseTemplate(
    "Account Created",
    `
<p style="margin-bottom:15px;">Hello <b style="color:#9B96E5;">${name}</b>,</p>

<p style="margin:15px 0; line-height:1.6;">
Your account has been created successfully!
</p>

<div style="
background:#F6F1EB;
border-left:4px solid #9B96E5;
padding:15px;
margin:20px 0;
border-radius:6px;
">
  <p style="margin:0; color:#3F3D56;">
    You can now explore exciting college events, connect with peers, and register for activities that interest you.
  </p>
</div>

<p style="margin:15px 0; line-height:1.6; color:#3F3D56;">
  Next steps: complete your profile details, review upcoming events, and keep notifications enabled so you never miss registration windows or event updates.
</p>
`,
    icons.user
  );



// ================= RESET

exports.resetTemplate = (otp) =>
  baseTemplate(
    "Reset Password",
    `
<p style="margin-bottom:15px;">Use this OTP to reset your password:</p>

<div style="
background:#F6F1EB;
border-left:4px solid #9B96E5;
padding:20px;
margin:20px 0;
border-radius:6px;
text-align:center;
">
  <div style="
font-size:28px;
font-weight:bold;
color:#9B96E5;
letter-spacing:3px;
font-family:monospace;
">
${otp}
  </div>
</div>

<p style="margin-top:15px; color:#666; font-size:13px;">
<svg style="width:14px; height:14px; margin-right:4px; display:inline; color:#9B96E5;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <polyline points="12 6 12 12 16 14"></polyline>
</svg><strong>Valid for 5 minutes only</strong>. Do not share this code with anyone.
</p>
`,
    icons.lock
  );



// ================= PASSWORD CHANGED

exports.passwordChangedTemplate = () =>
  baseTemplate(
    "Password Changed",
    `
<p style="margin-bottom:15px; line-height:1.6;">
Your password has been updated successfully!
</p>

<div style="
background:#F6F1EB;
border-left:4px solid #F08A6C;
padding:15px;
margin:20px 0;
border-radius:6px;
">
  <p style="margin:0; color:#3F3D56; font-size:14px;">
    <svg style="width:14px; height:14px; margin-right:6px; display:inline; color:#F08A6C;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg><strong>Security reminder:</strong> If you did not make this change or have any concerns, please contact admin immediately.
  </p>
</div>
`,
    icons.lock
  );



// ================= EVENT REGISTER

exports.eventRegisterTemplate = (eventData) => {
  const event = typeof eventData === 'string' ? eventData : eventData.name;
  const details = typeof eventData === 'object' ? eventData : {};
  const rules = Array.isArray(details.rules)
    ? details.rules.filter((rule) => String(rule || "").trim().length > 0)
    : [];

  const qrImageSrc = details.qrCodeCid
    ? `cid:${details.qrCodeCid}`
    : details.qrCodeDataUrl;

  const qrCodeSection = qrImageSrc
    ? `
<div style="
background:#FFFFFF;
border:1px solid #E5E7EB;
padding:18px;
margin:20px 0;
border-radius:10px;
text-align:center;
">
  <h4 style="margin:0 0 10px 0; color:#9B96E5; font-size:15px;">Your Entry QR Code</h4>
  <img src="${qrImageSrc}" alt="Event Entry QR Code" style="width:180px; height:180px; border-radius:8px;" />
  <p style="margin:10px 0 0 0; font-size:13px; color:#3F3D56;">
    Show this QR code at the venue entrance for ${escapeHtml(event)}.
  </p>
</div>
`
    : "";

  const rulesSection = rules.length
    ? `
<div style="
background:#FFF7F3;
border-left:4px solid #F08A6C;
padding:15px;
margin:20px 0;
border-radius:6px;
">
  <h4 style="margin:0 0 10px 0; color:#9B96E5; font-size:15px;">
    Rules & Regulations for ${escapeHtml(event)}
  </h4>
  <ol style="margin:0; padding-left:20px; color:#3F3D56; line-height:1.6;">
    ${rules
      .map((rule) => `<li style="margin:6px 0;">${escapeHtml(rule)}</li>`)
      .join("")}
  </ol>
</div>
`
    : "";

  
  return baseTemplate(
    "Event Registration",
    `
You have successfully registered for:

<div style="
background:#F6F1EB;
border-left:4px solid #9B96E5;
padding:15px;
margin:20px 0;
border-radius:6px;
">
  <h3 style="margin:0 0 10px 0; color:#9B96E5; font-size:16px;">
    ${event}
  </h3>
  ${details.date ? `<p style="margin:8px 0; color:#3F3D56; display:flex; align-items:center;"><svg style="width:14px; height:14px; margin-right:6px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg><strong>Date:</strong> ${details.date}</p>` : ''}
  ${details.time ? `<p style="margin:8px 0; color:#3F3D56; display:flex; align-items:center;"><svg style="width:14px; height:14px; margin-right:6px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><strong>Time:</strong> ${details.time}</p>` : ''}
  ${details.location ? `<p style="margin:8px 0; color:#3F3D56; display:flex; align-items:center;"><svg style="width:14px; height:14px; margin-right:6px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg><strong>Location:</strong> ${details.location}</p>` : ''}
  ${details.capacity ? `<p style="margin:8px 0; color:#3F3D56; display:flex; align-items:center;"><svg style="width:14px; height:14px; margin-right:6px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg><strong>Capacity:</strong> ${details.capacity}</p>` : ''}
</div>

${qrCodeSection}

${rulesSection}

Thank you for registering!
`,
    icons.calendar
  );
};



// ================= REMINDER

exports.reminderTemplate = (eventData) => {
  const event = typeof eventData === 'object' ? eventData.name : eventData;
  const details = typeof eventData === 'object' ? eventData : {};

  return baseTemplate(
    "Event Reminder",
    `
Reminder for your upcoming event:

<div style="
background:#F6F1EB;
border-left:4px solid #F08A6C;
padding:15px;
margin:20px 0;
border-radius:6px;
">
  <h3 style="margin:0 0 10px 0; color:#9B96E5; font-size:16px;">
    ${event}
  </h3>
  ${details.date ? `<p style="margin:8px 0; color:#3F3D56; display:flex; align-items:center;"><svg style="width:14px; height:14px; margin-right:6px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg><strong>Date:</strong> ${details.date}</p>` : ''}
  ${details.time ? `<p style="margin:8px 0; color:#3F3D56; display:flex; align-items:center;"><svg style="width:14px; height:14px; margin-right:6px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><strong>Time:</strong> ${details.time}</p>` : ''}
  ${details.location ? `<p style="margin:8px 0; color:#3F3D56; display:flex; align-items:center;"><svg style="width:14px; height:14px; margin-right:6px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg><strong>Location:</strong> ${details.location}</p>` : ''}
  ${details.description ? `<p style="margin:8px 0; color:#3F3D56; display:flex; align-items:flex-start;"><svg style="width:14px; height:14px; margin-right:6px; margin-top:2px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><strong>Description:</strong> ${details.description}</p>` : ''}
</div>

Don't miss out! See you there!
`,
    icons.calendar
  );
};



// ================= NEW EVENT

exports.newEventTemplate = (eventData) => {
  const event = typeof eventData === 'object' ? eventData.name : eventData;
  const details = typeof eventData === 'object' ? eventData : {};

  return baseTemplate(
    "New Event Created",
    `
<p style="margin-bottom:15px;"><strong>Hello,</strong></p>

<p style="margin:15px 0; line-height:1.6;">
  A new event has been created.
</p>

<div style="
background:#F6F1EB;
border-left:4px solid #9B96E5;
padding:15px;
margin:20px 0;
border-radius:6px;
">
  <h3 style="margin:0 0 10px 0; color:#9B96E5; font-size:16px;">
    Event Name: ${event}
  </h3>
  <p style="margin:8px 0; color:#3F3D56;"><strong>Date:</strong> ${details.date || "TBA"}</p>
  <p style="margin:8px 0; color:#3F3D56;"><strong>Time:</strong> ${details.time || "TBA"}</p>
  <p style="margin:8px 0; color:#3F3D56;"><strong>Venue:</strong> ${details.location || "TBA"}</p>
  <p style="margin:8px 0; color:#3F3D56;"><strong>Description:</strong> ${details.description || "No short description available."}</p>
</div>

<p style="margin:15px 0; line-height:1.6; color:#3F3D56;">
  Visit website to register.
</p>
`,
    icons.calendar
  );
};

// ================= CANCEL EVENT

exports.eventCancelTemplate = (eventData) => {
  const event = typeof eventData === 'object' ? eventData.name : eventData;
  const details = typeof eventData === 'object' ? eventData : {};

  return baseTemplate(
    "Event Registration Cancelled",
    `
You have successfully cancelled your registration for:

<div style="
background:#F6F1EB;
border-left:4px solid #F08A6C;
padding:15px;
margin:20px 0;
border-radius:6px;
">
  <h3 style="margin:0 0 10px 0; color:#9B96E5; font-size:16px;">
    ${event}
  </h3>
  ${details.date ? `<p style="margin:8px 0; color:#3F3D56; display:flex; align-items:center;"><svg style="width:14px; height:14px; margin-right:6px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg><strong>Date:</strong> ${details.date}</p>` : ''}
  ${details.time ? `<p style="margin:8px 0; color:#3F3D56; display:flex; align-items:center;"><svg style="width:14px; height:14px; margin-right:6px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><strong>Time:</strong> ${details.time}</p>` : ''}
  ${details.location ? `<p style="margin:8px 0; color:#3F3D56; display:flex; align-items:center;"><svg style="width:14px; height:14px; margin-right:6px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg><strong>Location:</strong> ${details.location}</p>` : ''}
</div>

If this was a mistake, you can register again from EventSphere.
`,
    icons.calendar
  );
};

// ================= ANNOUNCEMENT

exports.announcementTemplate = ({ title, message, createdAt }) =>
  baseTemplate(
    "New Announcement",
    `
<p style="margin-bottom:15px; line-height:1.6;">
A new announcement has been posted on <b style="color:#9B96E5;">EventSphere</b>.
</p>

<div style="
background:#F6F1EB;
border-left:4px solid #9B96E5;
padding:15px;
margin:20px 0;
border-radius:6px;
">
  <h3 style="margin:0 0 10px 0; color:#9B96E5; font-size:16px;">
    ${title}
  </h3>
  <p style="margin:8px 0; color:#3F3D56; line-height:1.6;">
    ${message}
  </p>
  ${createdAt ? `<p style="margin:10px 0 0 0; color:#666; font-size:13px;"><strong>Posted:</strong> ${createdAt}</p>` : ''}
</div>

<p style="margin:15px 0; line-height:1.6; color:#3F3D56;">
  Please review this announcement carefully and check your dashboard notifications for any follow-up updates, deadlines, or schedule changes.
</p>
`,
    icons.calendar
  );

// ================= PROFILE APPROVED

exports.profileApprovedTemplate = (name = "Student") =>
  baseTemplate(
    "Profile Approved",
    `
<p style="margin-bottom:15px; line-height:1.6;">
Hello <b style="color:#9B96E5;">${name}</b>,
</p>

<p style="margin:15px 0; line-height:1.6; color:#3F3D56;">
Your profile has been approved by admin.
</p>

<p style="margin:15px 0; line-height:1.6; color:#3F3D56;">
You can now register for events. Check your dashboard for upcoming events, availability updates, and announcements.
</p>
`,
    icons.user
  );

// ================= FEEDBACK REQUEST

exports.feedbackRequestTemplate = (eventData) => {
  const event = typeof eventData === "object" ? eventData.name : eventData;
  const details = typeof eventData === "object" ? eventData : {};

  return baseTemplate(
    "Share Your Feedback",
    `
<p style="margin-bottom:15px; line-height:1.6;">
Hello <b style="color:#9B96E5;">${details.studentName ? escapeHtml(details.studentName) : "there"}</b>,
</p>

<p style="margin:15px 0; line-height:1.6; color:#3F3D56;">
Thank you for attending <b style="color:#9B96E5;">${escapeHtml(event)}</b>!
We would love to hear about your experience.
</p>

<div style="
background:#F6F1EB;
border-left:4px solid #9B96E5;
padding:15px;
margin:20px 0;
border-radius:6px;
">
  <h3 style="margin:0 0 8px 0; color:#9B96E5; font-size:16px;">
    ${escapeHtml(event)}
  </h3>
  ${details.date ? `<p style="margin:8px 0; color:#3F3D56;"><strong>Date:</strong> ${escapeHtml(details.date)}</p>` : ""}
  ${details.venue ? `<p style="margin:8px 0; color:#3F3D56;"><strong>Venue:</strong> ${escapeHtml(details.venue)}</p>` : ""}
</div>

<p style="margin:15px 0; line-height:1.6; color:#3F3D56;">
Your feedback helps us improve future events. Please visit EventSphere and go to <b>My Registrations</b> to rate the event and leave a comment.
</p>
`,
    icons.calendar
  );
};