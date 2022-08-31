const Email = require('./Email')
const ReservationEmailContext = require('./ReservationEmailContext');
const EmailOptions = require('./EmailOptions');
const ReservationEmailTypes = require('./ReservationEmailTypes');
const ical = require('ical-generator');

module.exports = class ReservationEmail extends Email {
    constructor({reservation, reservationEmailType, receiver, adminPhoneNumbers}) {
        super();
        let unmodifiedReservationDate;
        if (reservation.date) {
            unmodifiedReservationDate = new Date(reservation.date.getFullYear(), reservation.date.getMonth(), reservation.date.getDate(), reservation.date.getHours());
        }

        const reservationEmailContext = new ReservationEmailContext({
            emailHeaderImageUrl: reservationEmailType.EmailHeaderImageUrl,
            emailTitle: reservationEmailType.EmailTitle,
            emailDetails: reservationEmailType.EmailDetails,
            reservation: reservation,
            adminPhoneNumbers: adminPhoneNumbers
        });

        this.emailOptions = new EmailOptions({
            receiver: receiver,
            subject: reservationEmailType.Subject,
            text: reservationEmailType.Text,
            template: reservationEmailType.EmailTemplate,
            context: reservationEmailContext,
            iCalEvent: this.createICalEvent(reservationEmailType, unmodifiedReservationDate, reservation, adminPhoneNumbers)
        });
    }

    send() {
        super.send(this.emailOptions);
    }

    createICalEvent(emailType, startDate, reservation, adminPhoneNumbers) {
        if (emailType.Type === ReservationEmailTypes.Created.Type ||
            emailType.Type === ReservationEmailTypes.Modified.Type ||
            emailType.Type === ReservationEmailTypes.Admin.Type) {
            const endDate = new Date(startDate);
            endDate.setHours(startDate.getHours() + 2);

            return ical({
                domain: 'gyenespaintball.hu',
                method: 'REQUEST',
                prodId: '//Google Inc//Google Calendar 70.9054//EN',
                timezone: 'Hungary/Budapest',
                scale: 'GREGORIAN',
                events: [
                    {
                        start: startDate,
                        end: endDate,
                        status: 'CONFIRMED',
                        summary: emailType.getEmailSummary(reservation),
                        transparency: 'OPAQUE',
                        url: 'https://www.gyenespaintball.hu',
                        description: emailType.getEmailDescription(reservation, adminPhoneNumbers),
                        geo: {lat: 46.76888838542698, lon: 17.27390882592543},
                        location: 'Gyenesdiás, Balaton u., 8315 Hungary',
                        busyStatus: 'BUSY',
                        organizer: {
                            name: 'Gyenespaintball',
                            email: 'kapcsolat@gyenespaintball.hu',
                            mailto: 'kapcsolat@gyenespaintball.hu'
                        }
                    }
                ]
            }).toString();
        }
        return null;
    }
}
