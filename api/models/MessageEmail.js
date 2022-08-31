const Email = require('./Email')
const EmailOptions = require('./EmailOptions');
const MessageEmailContext = require('./MessageEmailContext');

module.exports = class MessageEmail extends Email {
    constructor({message, messageEmailType, receiver, adminPhoneNumbers}) {
        super();

        const messageEmailContext = new MessageEmailContext({
            emailHeaderImageUrl: messageEmailType.EmailHeaderImageUrl,
            message: message,
            adminPhoneNumbers: adminPhoneNumbers
        });

        this.emailOptions = new EmailOptions({
            receiver: receiver,
            subject: messageEmailType.Subject,
            text: messageEmailType.Text,
            template: messageEmailType.EmailTemplate,
            context: messageEmailContext,
            iCalEvent: null
        });
    }

    send() {
        super.send(this.emailOptions);
    }
}
