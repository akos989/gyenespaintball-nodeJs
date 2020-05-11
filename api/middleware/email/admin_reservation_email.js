module.exports = (req, res, next) => {
    const date = new Date(res.locals.reservationInfo.date.valueOf());
    date.setHours(date.getHours()-2);
    const hour = date.getHours();
    res.locals.emailBody = `
        <div style="text-align: center;">
            <h1 style="padding-bottom: 30px;">Új foglalás érkezett!</h1>
            <hr>
            <h2>Foglalás adatai:</h2>
            <div style="padding-bottom: 30px;">
                <div style="font-weight: bold;">Név:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.name}</div>
                <div style="font-weight: bold;">Email:</div>
                <div style="padding-bottom: 10px;"><a href="mailto:${res.locals.reservationInfo.email}">${res.locals.reservationInfo.email}</a></div>
                <div style="font-weight: bold;">Telefonszám:</div>
                <div style="padding-bottom: 10px;"><a href="tel:${res.locals.reservationInfo.phoneNumber}">${res.locals.reservationInfo.phoneNumber}</a></div>
                <div style="font-weight: bold;">Játékosszám:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.playerNumber}</div>
                <div style="font-weight: bold;">Dátum:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.date.toISOString().slice(0,10)}
                ${(hour < 10) ? ('0' + hour) : hour}:${res.locals.reservationInfo.date.getMinutes() < 10 ? '0'+res.locals.reservationInfo.date.getMinutes() : res.locals.reservationInfo.date.getMinutes()}</div>
                <div style="font-weight: bold;">Időtartam:</div>
                <div style="padding-bottom: 10px;">${res.locals.package.duration} óra</div>
                <div style="font-weight: bold;">Alapár:</div>
                <div style="padding-bottom: 10px;">${res.locals.package.basePrice} Ft</div>
                <div style="font-weight: bold;">Ft / lövedék:</div>
                <div style="padding-bottom: 10px;">${res.locals.package.bulletPrice} Ft</div>
                <div style="font-weight: bold;">Lövedék az árban:</div>
                <div style="padding-bottom: 10px;">${res.locals.package.includedBullets} db</div>
                <div style="font-weight: bold;">Megjegyzések:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.notes ? res.locals.reservationInfo.notes : '-'}</div>
            </div>
        </div>
    `;
    return next();
}