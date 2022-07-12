module.exports = class EmailContext {
    constructor(
        {
            emailHeaderImageUrl,
            emailTitle,
            emailDetails,
            reservation
        }
    ) {
        this.emailHeaderImageUrl = emailHeaderImageUrl;
        this.emailTitle = emailTitle;
        this.emailDetails = emailDetails;
        this.reservation = reservation;
        const dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
        this.reservation.date = reservation.date.toLocaleString('hu-HU', dateOptions);
    }
}
