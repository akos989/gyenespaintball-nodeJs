const Email = require('./Email')
const EmailContext = require('./EmailContext');
const EmailOptions = require('./EmailOptions');
const ReservationEmailTypes = require('./ReservationEmailTypes');
const ical = require('ical-generator');

const emailTemplate = 'ReservationCreatedClientEmail';

module.exports = class ReservationClientEmail extends Email {
    constructor({reservation, reservationEmailType, receiver}) {
        super();
        const unmodifiedReservationDate = new Date(reservation.date.getFullYear(), reservation.date.getMonth(), reservation.date.getDate(), reservation.date.getHours());

        const emailContext = new EmailContext({
            emailHeaderImageUrl: reservationEmailType.EmailHeaderImageUrl,
            emailTitle: reservationEmailType.EmailTitle,
            emailDetails: reservationEmailType.EmailDetails,
            reservation: reservation
        });

        this.emailOptions = new EmailOptions({
            receiver: receiver,
            subject: reservationEmailType.Subject,
            text: reservationEmailType.Text,
            template: emailTemplate,
            context: emailContext,
            iCalEvent: this.createICalEvent(reservationEmailType.Type, unmodifiedReservationDate)
        });
    }

    send() {
        super.send(this.emailOptions);
    }

    createICalEvent(emailType, startDate) {
        if (emailType === ReservationEmailTypes.Created.Type ||
            emailType === ReservationEmailTypes.Modified.Type) {
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
                        summary: 'Gyenenpaintball foglalás',
                        transparency: 'OPAQUE',
                        url: 'https://www.gyenespaintball.hu',
                        description: 'Itt még lesz valami szép leírás, hogy mennyi emberre foglalt meg ilyenek :D', // Todo: write this description
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
