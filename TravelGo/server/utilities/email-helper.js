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

module.exports = { sendCreateEmail, sendUpdateEmail };