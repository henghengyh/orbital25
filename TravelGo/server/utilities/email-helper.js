const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const senderEmail = 'travelgo.developerteam@gmail.com'
const bodyTextHtml = function (user, note) {
    return `
    <p>Dear <strong>${user.name}</strong>,</p>
    <p>This is a system generated email.</p>
    <p>${note}</p>
    <p>Best regards,<br>TravelGo Team</p>
  `;
}

/** sendCreateEmail
 * @param {ItinerarySchema} itinerary - The itinerary object
 * @returns {undefined}
 */
function sendCreateEmail(itinerary) {
    const user = itinerary.user;
    if (user.emailSignUp === false) {
        console.log('User has opted out of email notifications.');
        return;
    }
    const note = `Your itinerary to <strong>${itinerary.destination}</strong> has been successfully created!<br><br>
    
    Start Date: <strong>${itinerary.startDate.toDateString()}</strong><br>
    End Date: <strong>${itinerary.endDate.toDateString()}</strong><br>
    Number of People: <strong>${itinerary.numberOfPeople}</strong><br><br>
    
    You can now add activities and manage your trip details in TravelGo.`;
    const msg = {
        to: user.email,
        from: senderEmail,
        subject: 'Itinerary Created - ' + itinerary.destination,
        text: bodyTextHtml(user, note),
        html: bodyTextHtml(user, note),
    };

    sgMail.send(msg)
        .then(() => console.log('Email successfully sent to ' + user.email))
};

/** sendUpdateEmail
 * @param {ItinerarySchema} itinerary - The itinerary object
 * @param {ActivitySchema} activity - The activity object
 * @param {number} duration - The number of hours until the activity starts
 * @returns {undefined}
 */
function sendUpdateEmail(itinerary, activity, duration) {
    const user = itinerary.user;
    if (user.emailSignUp === false) {
        console.log('User has opted out of email notifications.');
        return;
    }
    const note = `WARNING: The activity ${activity.name}, which is scheduled to start in ${duration} hours, has been updated.\n`;
    const msg = {
        to: user.email,
        from: senderEmail,
        subject: 'Activity Reminder - ' + activity.name,
        text: bodyTextHtml(user, note),
        html: bodyTextHtml(user, note),
    };

    sgMail.send(msg)
        .then(() => console.log('Email successfully sent to ' + user.email))
};

/** sendCodeToEmail
 * @param {string} email - The email address to send the code to
 * @param {string} code - The verification code to send
 */
function sendCodeToEmail(email, code) {
    const msg = {
        to: email,
        from: senderEmail,
        subject: 'TravelGo: Your Verification Code',
        text: `Hi there,\n\nYour verification code is: ${code}\n\nPlease enter this code to continue.\n\nThanks,\nTravelGo Team`,
        html: `
      <div style="background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #333333;">TravelGo Verification</h2>
          <p style="font-size: 16px; color: #555555;">
            Hi there,
          </p>
          <p style="font-size: 16px; color: #555555;">
            Use the verification code below to complete your action:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #1a73e8; letter-spacing: 4px;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px; color: #999999;">
            If you didn’t request this code, please ignore this email.
          </p>
          <p style="font-size: 14px; color: #999999;">
            — The TravelGo Team
          </p>
        </div>
      </div>
    `,
    };

    sgMail.send(msg)
        .then(() => console.log('Verification code sent to ' + email))
        .catch(error => {
            console.error('Error sending verification code:', error);
            throw new Error('Failed to send verification code');
        });
};

/** sendCollabInvitation
 * @param {string} email - The email address to send the code to
 * @param {string} inviterName - person inviting
 * @param {string} inviteeName - person invited
 * @param {string} tripName 
 * @param {string} message - Inviter's message
 * @param {string} itineraryId - itineraryID
 * @param {string} token - Token for accepting the invite
 */
function sendCollabInvitation(email, inviterName, inviteeName, tripName, message, itineraryId, token) {
    const acceptUrl = `${process.env.NODE_APP_API_URL}/collaboration/accept?token=${token}`;
    const msg = {
        to: email,
        from: senderEmail,
        subject: 'TravelGo: Collaboration Invitation',
        text: `Dear ${inviteeName}, you have been invited to collaborate on a TravelGo itinerary. Message: ${message}`,
        html: `
        <div style="background-color: #f9f9f9; padding: 30px;">
            <div style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #333333;">Collaboration Invitation</h2>
            <p style="font-size: 16px; color: #555555;">
                Dear ${inviteeName}, you have been invited to collaborate on a TravelGo itinerary (${tripName}) by <b>${inviterName}</b>.
            </p>
            <p style="font-size: 16px; color: #555555;">
                Message from the inviter:
            </p>
            <blockquote style="background-color: #f1f1f1; padding: 10px; border-left: 4px solid #ccc;">
                <p style="margin: 0;">${message}</p>
            </blockquote>
            <div style="margin: 30px 0; text-align: center;">
                <a href="${acceptUrl}" style="background: #1a73e8; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 18px;">
                    Accept Invitation
                </a>
            </div>
            <p style="font-size: 14px; color: #999999;">
                Please log in to your TravelGo account to edit the itinerary together.
            </p>
            </div>
        </div>
        `,
    };

    sgMail.send(msg)
        .then(() => console.log('Collaboration invitation sent to ' + email))
        .catch(error => {
            console.error('Error sending collaboration invitation:', error);
            throw new Error('Failed to send collaboration invitation');
        });
}

/** sendCollabAcceptedEmail
 * @param {string} inviterEmail - The email address to send the code to
 * @param {string} inviterName - person inviting
 * @param {string} inviteeName - person invited
 * @param {string} tripName 
 */
function sendCollabAcceptedEmail(inviterEmail, inviterName, inviteeName, tripName) {
    const msg = {
        to: inviterEmail,
        from: senderEmail,
        subject: 'TravelGo: Collaboration Invitation Accepted',
        text: `Hi ${inviterName},\n\n${inviteeName} has accepted your invitation to collaborate on the itinerary "${tripName}".\n\nYou can now work together on your trip!\n\nBest regards,\nTravelGo Team`,
        html: `
            <div style="background-color: #f9f9f9; padding: 30px;">
                <div style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h2 style="color: #333333;">Collaboration Accepted!</h2>
                    <p style="font-size: 16px; color: #555555;">
                        Hi <b>${inviterName}</b>,
                    </p>
                    <p style="font-size: 16px; color: #555555;">
                        <b>${inviteeName}</b> has accepted your invitation to collaborate on the itinerary "<b>${tripName}</b>".
                    </p>
                    <p style="font-size: 16px; color: #555555;">
                        You can now work together on your trip!
                    </p>
                    <p style="font-size: 14px; color: #999999;">
                        — The TravelGo Team
                    </p>
                </div>
            </div>
        `,
    };

    sgMail.send(msg)
        .then(() => console.log('Collaboration accepted email sent to ' + inviterEmail))
        .catch(error => {
            console.error('Error sending collaboration accepted email:', error);
            throw new Error('Failed to send collaboration accepted email');
        });
}


module.exports = {
    sendCreateEmail,
    sendUpdateEmail,
    sendCodeToEmail,
    sendCollabInvitation,
    sendCollabAcceptedEmail
};