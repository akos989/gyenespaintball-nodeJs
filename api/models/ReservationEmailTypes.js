module.exports = class ReservationEmailTypes {
    static get Created() {
        return {
            EmailHeaderImageUrl: '"https://gyenespaintball.hu/assets/pictures/page-headers/futas.jpg"',
            EmailTitle: 'Köszönjük a foglalást!',
            EmailDetails: 'A játék időpontja előtt 48 órával fog kapni egy emlékeztető emailt. Amennyiben lemondaná a foglalást kérjük legalább egy nappal az időpont előtt jelezze.',
            Subject: 'Paintball foglalás',
            Text: 'Foglalás',
            Type: 'NewReservation'
        };
    }

    static get Modified() {
        return {
            EmailHeaderImageUrl: '"https://gyenespaintball.hu/assets/pictures/page-headers/futas.jpg"', // Todo: pick picture
            EmailTitle: 'Foglalási adatai módosítva lettek!',
            EmailDetails: 'A lenti foglalás adatai megváltoztak. Amennyiben erre nem számított mihamarabb vegye fel a kapcsolatot valamelyik munkatársunkkal.',
            Subject: 'Módosított foglalás',
            Text: 'Foglalás',
            Type: 'ModifiedReservation'
        }
    }

    static get Deleted() {
        return {
            EmailHeaderImageUrl: '"https://gyenespaintball.hu/assets/pictures/page-headers/futas.jpg"', // Todo: pick picture
            EmailTitle: 'Foglalását törölték!',
            EmailDetails: 'A lenti foglalást törölték. Amennyiben erre nem számított mihamarabb vegye fel a kapcsolatot valamelyik munkatársunkkal.',
            Subject: 'Törölt foglalás',
            Text: 'Foglalás',
            Type: 'DeletedReservation'
        }
    }

    static get Scheduled() {
        return {
            EmailHeaderImageUrl: '"https://gyenespaintball.hu/assets/pictures/page-headers/futas.jpg"', // Todo: pick picture
            EmailTitle: null,
            EmailDetails: 'Emlékeztetjük, hogy korábban foglalt paintball időpontja 2 napon belül esedékes. A foglalással kapcsolatos adatokat lent megtalálja.',
            Subject: 'Foglalási emlékeztető',
            Text: 'Emlékeztető',
            Type: 'ScheduledReservation'
        }
    }
}
