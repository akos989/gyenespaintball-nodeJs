module.exports = class MessageEmailContext {
    constructor(
        {
            emailHeaderImageUrl,
            message,
            adminPhoneNumbers
        }
    ) {
        this.emailHeaderImageUrl = emailHeaderImageUrl;
        this.message = message;
        this.adminPhoneNumbers = adminPhoneNumbers;
    }
}
