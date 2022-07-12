module.exports = class EmailOptions {
    constructor({receiver, subject, text, template, context, iCalEvent}) {
        this.receiver = receiver;
        this.subject = subject;
        this.text = text;
        this.template = template;
        this.context = context;
        this.iCalEvent = iCalEvent;
    }

    getMailOptions() {
        return {
            from: '"Gyenespaintball" <kapcsolat@gyenespaintball.hu>', // sender address
            to: this.receiver, // list of receivers
            subject: this.subject, // Subject line
            text: this.text, // plain text body
            template: this.template,
            context: this.context,
            icalEvent: this.iCalEvent
        };
    }
}
