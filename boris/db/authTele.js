requestAnimationFrame(()=> {
    console.warn('ggg', window.mtNs)

})
window.mtNsCallBack = (data) => {
    console.warn('mtNsCallBack', data);

};

window.addEventListener('load', (e) => {
    // console.warn('doc', e, document.body)
    const body = document.body;
    const clList = body.classList;
    const form = document.forms[0];
    // const origin = location.hostname;   // host с которого авторизуемся
    const hostId = 21;   // host с которого авторизуемся
    const pType = 15;                   // номер страницы с которой авторизуемся
    
    form.addEventListener('submit', async (ev) => {
        let mtSess = sessionStorage.getItem('mtSess');
        if (!mtSess) {
            ev.preventDefault();
            clList.add('mtSessMask');
            let key = [
                hostId,
                pType,
                (1000 + Math.random() * 9000).toFixed(0)
            ].join(':');
            // window.mtNsCallBack = (data) => {
            //     console.warn('mtNsCallBack', key, data);

            // };
            const ow = mtNs.Utils.getWindowOpen(
                `https://auth.moretele.ru/?botName=phistory1_bot&start=${key}`,
                {
                    width: 300
                }
            );

            // const url = `https://t.me/phistory1_bot?start=${key}`;
            // const bqr = await mtNs.Utils.getQrImgSrc({url});
            // body.querySelector('img.qrCode').src = bqr;
            // body.querySelector('a.qrLink').href = url;
            mtNs.bcc.addEventListener('message', e => {
                console.warn('ow', key, e.data)

            });
        

        }
        // console.warn('submit', ev, document.body)

    });
    // debugger
});