module.exports = class MessageEmailTypes {
    static get Created() {
        return {
            EmailHeaderImageUrl: '"https://gyenespaintball.hu/assets/pictures/email-pictures/jumping.jpg"',
            Subject: 'Új üzenet',
            Text: 'Üzenet',
            EmailTemplate: 'MessageCreatedClient'
        };
    }

    static get Admin() {
        return {
            EmailHeaderImageUrl: '"https://gyenespaintball.hu/assets/pictures/email-pictures/Ending.jpg"',
            Subject: 'Új üzenet',
            Text: 'Üzenet',
            EmailTemplate: 'MessageCreatedAdmin'
        };
    }

    static get Reply() {
        return {
            EmailHeaderImageUrl: '"https://gyenespaintball.hu/assets/pictures/email-pictures/Ending.jpg"',
            Subject: 'Üzenet válasz',
            Text: 'Üzenet válasz',
            EmailTemplate: 'MessageReplyClient'
        };
    }
}
