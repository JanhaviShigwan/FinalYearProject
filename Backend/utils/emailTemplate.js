const emailTemplate = (name) => {

  return `
  <div style="font-family: Arial, sans-serif; background:#F6F1EB; padding:40px;">
    
    <div style="max-width:600px; margin:auto; background:#FFFFFF; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      
      <div style="background:#9B96E5; padding:20px; text-align:center; color:white;">
        <h1 style="margin:0;">EventSphere</h1>
        <p style="margin:5px 0;">Your Campus Event Hub</p>
      </div>

      <div style="padding:30px; color:#3F3D56;">
        <h2>Hello ${name} 👋</h2>

        <p>
          Welcome to <b>EventSphere</b>! 🎉  
          Your registration was successful.
        </p>

        <p>
          You can now explore exciting college events and register for them.
        </p>

        <div style="text-align:center; margin:30px 0;">
          <a href="http://localhost:5173"
             style="background:#F08A6C;
                    color:white;
                    padding:12px 25px;
                    text-decoration:none;
                    border-radius:6px;
                    font-weight:bold;">
            Explore Events
          </a>
        </div>

        <p>
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

module.exports = emailTemplate;