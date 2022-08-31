module.exports = class ReservationEmailTypes {
    static get Created() {
        return {
            EmailHeaderImageUrl: '"https://gyenespaintball.hu/assets/pictures/email-pictures/behind-tires.jpg"',
            EmailTitle: 'Köszönjük a foglalást!',
            EmailDetails: 'A játék időpontja előtt 48 órával fog kapni egy emlékeztető emailt. Amennyiben lemondaná a foglalást kérjük legalább egy nappal az időpont előtt jelezze.',
            Subject: 'Paintball foglalás',
            Text: 'Foglalás',
            Type: 'NewReservation',
            EmailTemplate: 'ReservationCreatedClientEmail',
            getEmailSummary: (_) => {
                return 'Gyenenpaintball foglalás'
            },
            getEmailDescription: (reservation, adminPhoneNumbers) => {
                return `
Foglálásod részletei:
    Név: ${reservation.name}
    Email: ${reservation.email}
    Telefonszám: ${reservation.phoneNumber}
    Létszám: ${reservation.playerNumber} fő
    Megjegyzések: ${reservation.notes}
    Golyóár: ${reservation.package.bulletPrice}
    Alapár: ${reservation.package.basePrice}
    Tartalmazott golyók száma: ${reservation.package.includedBullets}

Amennyiben kérdésed lenne a foglalással kapcsolatban bátran keress minket az alábbi elérhetőségek valamelyikén:
Telefon:
${adminPhoneNumbers.join('\n')}
Email cím: kapcsolat@gyenespaintball.hu`
            }
        };
    }

    static get Modified() {
        return {
            EmailHeaderImageUrl: '"https://gyenespaintball.hu/assets/pictures/email-pictures/smokey-background.jpg"',
            EmailTitle: 'Foglalási adatai módosítva lettek!',
            EmailDetails: 'A lenti foglalás adatai megváltoztak. Amennyiben erre nem számított mihamarabb vegye fel a kapcsolatot valamelyik munkatársunkkal.',
            Subject: 'Módosított foglalás',
            Text: 'Foglalás',
            Type: 'ModifiedReservation',
            EmailTemplate: 'ReservationCreatedClientEmail',
            getEmailSummary: (_) => {
                return 'Gyenenpaintball foglalás'
            },
            getEmailDescription: (reservation, adminPhoneNumbers) => {
                return `
Foglálásod részletei: 
    Név: ${reservation.name}
    Email: ${reservation.email}
    Telefonszám: ${reservation.phoneNumber}
    Létszám: ${reservation.playerNumber} fő
    Megjegyzések: ${reservation.notes}
    Golyóár: ${reservation.package.bulletPrice} Ft
    Alapár: ${reservation.package.basePrice} Ft
    Tartalmazott golyók száma: ${reservation.package.includedBullets} db

Amennyiben kérdésed lenne a foglalással kapcsolatban bátran keress minket az alábbi elérhetőségek valamelyikén:
Telefon:
${adminPhoneNumbers.join('\n')}
Email cím: kapcsolat@gyenespaintball.hu`
            }
        }
    }

    static get Deleted() {
        return {
            EmailHeaderImageUrl: '"https://gyenespaintball.hu/assets/pictures/email-pictures/jumping.jpg"',
            EmailTitle: 'Foglalását törölték!',
            EmailDetails: 'A lenti foglalást törölték. Amennyiben erre nem számított mihamarabb vegye fel a kapcsolatot valamelyik munkatársunkkal.',
            Subject: 'Törölt foglalás',
            Text: 'Foglalás',
            Type: 'DeletedReservation',
            EmailTemplate: 'ReservationCreatedClientEmail'
        }
    }

    static get Scheduled() {
        return {
            EmailHeaderImageUrl: '"https://gyenespaintball.hu/assets/pictures/email-pictures/run-with-flag.jpg"',
            EmailTitle: null,
            EmailDetails: 'Emlékeztetjük, hogy korábban foglalt paintball időpontja 2 napon belül esedékes. A foglalással kapcsolatos adatokat lent megtalálja.',
            Subject: 'Foglalási emlékeztető',
            Text: 'Emlékeztető',
            Type: 'ScheduledReservation',
            EmailTemplate: 'ReservationCreatedClientEmail'
        }
    }

    static get Admin() {
        return {
            EmailHeaderImageUrl: '"https://gyenespaintball.hu/assets/pictures/email-pictures/behind-tires.jpg"',
            EmailTitle: 'Új foglalás érkezett!',
            EmailDetails: null,
            Subject: 'Paintball foglalás',
            Text: 'Új foglalás',
            Type: 'Admin',
            EmailTemplate: 'ReservationCreatedAdminEmail',
            getEmailSummary: (reservation) => {
                return `${reservation.playerNumber} fő - online`
            },
            getEmailDescription: (reservation, _) => {
                return `
Név: ${reservation.name}
Email: ${reservation.email}
Telefonszám: ${reservation.phoneNumber}
Létszám: ${reservation.playerNumber} fő
Megjegyzések: ${reservation.notes}`
            }
        }
    }

    static get ThankYou() {
        return {
            EmailHeaderImageUrl: '"https://gyenespaintball.hu/assets/pictures/email-pictures/smoke.jpg"',
            EmailTitle: 'Köszönjük, hogy velünk játszottatok!',
            EmailDetails: 'Reméljük, hogy csapatoddal jól éreztétek magatokat és tetszett a játék. Számunkra nagyon fontos a visszajelzés, kérlek értékeljetek minket a következő linken:',
            Subject: 'Köszönet',
            Text: 'Köszönet',
            Type: 'ThankYouReservation',
            EmailTemplate: 'ThankYouEmail'
        }
    }
}
