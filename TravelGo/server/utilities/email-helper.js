const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const senderEmail = 'travelgo.developerteam@gmail.com'
const bodyTextHtml = function(user, note) {
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
    subject:  'Activity Reminder - ' + activity.name,
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
    subject: 'TravelGO: Verification Code',
    text: `Your verification code is: ${code}`,
    html: `<strong>Your verification code is: ${code}</strong>`,
  };

  sgMail.send(msg)
  .then(() => console.log('Verification code sent to ' + email))
  .catch(error => {
    console.error('Error sending verification code:', error);
    throw new Error('Failed to send verification code');
  });
};

module.exports = { sendCreateEmail, sendUpdateEmail, sendCodeToEmail };