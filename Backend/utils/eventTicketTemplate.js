const eventTicketTemplate = (student, event, qrCodeImage) => {

return `
<div style="font-family: Arial, sans-serif; background:#F6F1EB; padding:40px;">

<div style="max-width:600px; margin:auto; background:#FFFFFF; border-radius:10px; overflow:hidden;">

<div style="background:#9B96E5; padding:20px; text-align:center; color:white;">
<h2>EventSphere</h2>
<p>Your Campus Event Hub</p>
</div>

<div style="padding:30px; color:#3F3D56;">

<h3>Hello ${student.name} 👋</h3>

<p>You have successfully registered for the event:</p>

<ul style="line-height:1.8">
<li><b>Event:</b> ${event.eventName}</li>
<li><b>Date:</b> ${event.date}</li>
<li><b>Time:</b> ${event.time}</li>
<li><b>Venue:</b> ${event.venue}</li>
</ul>

<p>Please show the following QR code at the event entry.</p>

<div style="text-align:center; margin:25px 0;">
<img src="${qrCodeImage}" alt="QR Ticket" style="width:200px;height:200px;border:1px solid #ddd;padding:10px;border-radius:8px;" />
</div>

<p style="margin-top:30px;">
Regards,<br>
<b>EventSphere Team</b>
</p>

</div>

<div style="background:#EED8D6; padding:15px; text-align:center; font-size:12px; color:#3F3D56;">
© ${new Date().getFullYear()} EventSphere
</div>

</div>

</div>
`;
};

module.exports = eventTicketTemplate;