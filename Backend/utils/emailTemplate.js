const emailTemplate = (userData) => {
  // Handle both old format (just name string) and new format (object with name and event details)
  const name = typeof userData === 'string' ? userData : userData?.name;
  const eventData = typeof userData === 'object' && userData?.event ? userData.event : null;

  let eventDetailsHTML = '';

  if (eventData) {
    const eventName = typeof eventData === 'string' ? eventData : eventData?.name;
    const details = typeof eventData === 'object' ? eventData : {};

    const iconStyle = 'display:inline-block; width:16px; height:16px; margin-right:8px; color:#9B96E5;';

    eventDetailsHTML = `
    <div style="background:#F6F1EB; border-left:4px solid #9B96E5; padding:20px; margin:25px 0; border-radius:8px;">
      <div style="display:flex; align-items:center; margin-bottom:15px;">
        <svg style="${iconStyle}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
        <h3 style="margin:0; color:#9B96E5; font-size:18px;">Event Details</h3>
      </div>

      <div style="color:#3F3D56;">
        <p style="margin:12px 0;"><strong style="color:#9B96E5;">Event:</strong> ${eventName}</p>
        ${details.date ? `
        <p style="margin:12px 0; display:flex; align-items:center;">
          <svg style="width:14px; height:14px; margin-right:6px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <strong>Date:</strong> ${details.date}
        </p>` : ''}
        ${details.time ? `
        <p style="margin:12px 0; display:flex; align-items:center;">
          <svg style="width:14px; height:14px; margin-right:6px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <strong>Time:</strong> ${details.time}
        </p>` : ''}
        ${details.location ? `
        <p style="margin:12px 0; display:flex; align-items:center;">
          <svg style="width:14px; height:14px; margin-right:6px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <strong>Location:</strong> ${details.location}
        </p>` : ''}
        ${details.capacity ? `
        <p style="margin:12px 0; display:flex; align-items:center;">
          <svg style="width:14px; height:14px; margin-right:6px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <strong>Capacity:</strong> ${details.capacity}
        </p>` : ''}
        ${details.description ? `
        <p style="margin:12px 0; display:flex; align-items:flex-start;">
          <svg style="width:14px; height:14px; margin-right:6px; margin-top:2px; color:#9B96E5; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <strong>Description:</strong> ${details.description}
        </p>` : ''}
      </div>
    </div>
    `;
  }

  return `
  <div style="font-family: Arial, sans-serif; background:#F6F1EB; padding:40px;">

    <div style="max-width:600px; margin:auto; background:#FFFFFF; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.1);">

      <div style="background:linear-gradient(90deg, #9B96E5 0%, #F08A6C 100%); padding:30px 20px; text-align:center; color:white;">
        <h1 style="margin:0; font-size:28px; font-weight:700;">EventSphere</h1>
        <p style="margin:8px 0; font-size:14px; opacity:0.95;">Your Campus Event Hub</p>
      </div>

      <div style="padding:40px 30px; color:#3F3D56;">
        <h2 style="margin-top:0; color:#9B96E5; font-size:20px;">Welcome ${name}!</h2>

        <p style="line-height:1.6; margin:15px 0;">
          Your registration was successful!
        </p>

        <p style="line-height:1.6; margin:15px 0;">
          You are now registered and ready to attend. ${eventData ? 'Here are your event details:' : 'You can explore more events and register for activities that interest you.'}
        </p>

        ${eventDetailsHTML}

        <div style="text-align:center; margin:35px 0;">
          <a href="http://localhost:5173"
             style="background:#F08A6C;
                    color:white;
                    padding:14px 32px;
                    text-decoration:none;
                    border-radius:8px;
                    font-weight:600;
                    font-size:16px;
                    display:inline-block;
                    transition:all 0.3s ease;">
            View More Events
          </a>
        </div>

        <p style="line-height:1.6; margin:20px 0; color:#666; font-size:14px;">
          <svg style="width:14px; height:14px; margin-right:6px; display:inline; color:#9B96E5;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>Check your email for any updates<br>
          <svg style="width:14px; height:14px; margin-right:6px; display:inline; color:#9B96E5;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>You can manage your registrations anytime<br><br>
          Best regards,<br>
          <b style="color:#9B96E5;">EventSphere Team</b>
        </p>
      </div>

      <div style="background:#EED8D6; padding:20px; text-align:center; font-size:12px; color:#3F3D56; border-top:1px solid #E5E7EB;">
        © ${new Date().getFullYear()} EventSphere • All rights reserved
      </div>

    </div>

  </div>
  `;
};

module.exports = emailTemplate;