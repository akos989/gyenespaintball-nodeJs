module.exports = (req, res, next) => {
    const date = new Date(res.locals.reservationInfo.date.valueOf());
    date.setHours(date.getHours()-2);
    const hour = date.getHours();
    res.locals.emailBody = `
        <div style="text-align: center;">
            <img src="cid:logo-png-email" alt="logo" style="height: 40px; width: 40px;">
        </div>
        <div style="text-align: center;">
            <h1 style="padding-bottom: 30px;">Kedves ${res.locals.reservationInfo.name}!</h1>
            <h2 style="padding-bottom: 30px;"> Köszönjük a foglalást! </h2>
            <div style="padding-bottom: 30px;">
                A foglalásról a játék kezdete előtt 48 órával fog kapni egy email értesítőt. Lemondani a kezdés előtt 24 óráig díjmentesen lehet, utána ki kell fizetni a teljes alapárat. 
            </div>
            <hr>
            <h2>Foglalás adatai:</h2>
            <div style="padding-bottom: 30px;">
                <div style="font-weight: bold;">Név:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.name}</div>
                <div style="font-weight: bold;">Email:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.email}</div>
                <div style="font-weight: bold;">Telefonszám:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.phoneNumber}</div>
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
        <hr>  
        <div style="text-align:center;">
            <div>Gyenes</div><div style="padding-bottom: 5vh;">Paintball</div>
            <div>Balaton utca, Gyenesdiás</div><div>8315</div>
            <hr>
            <div> Tel: <a href="tel:+36208028647">+36208028647</a></div>
            <div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="tel:+36306083283">+36306083283</a></div>
            <div>Email:</div>
            <div><a href="mailto:gyenespaintball@gmail.com">gyenespaintball@gmail.com</a></div>
            <hr>
            <div style="padding-top: 5vh; padding-bottom: 5vh;">
                <a href="https://www.facebook.com/gyenespaintball" target="_blank"><span style="margin-right: 30px;"><img src="cid:facebook" alt="fb" style="height: 25px; width: 25px;"></span></a>
                <a href="https://www.instagram.com/gyenespaintball/" target="_blank"><span style="margin-left: 30px;"><img src="cid:insta" alt="insta" style="height: 25px; width: 25px;"></span></a>
            </div> 
        </div>
    `;
    return next();
}