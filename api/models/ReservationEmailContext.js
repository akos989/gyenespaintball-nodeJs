module.exports = class ReservationEmailContext {
    constructor(
        {
            emailHeaderImageUrl,
            emailTitle,
            emailDetails,
            reservation,
            adminPhoneNumbers
        }
    ) {
        this.emailHeaderImageUrl = emailHeaderImageUrl;
        this.emailTitle = emailTitle;
        this.emailDetails = emailDetails;
        this.reservation = reservation;
        this.adminPhoneNumbers = adminPhoneNumbers;
        if (reservation.date) {
            const dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
            this.reservation.date = reservation.date.toLocaleString('hu-HU', dateOptions);
        }
    }
}
