requestAnimationFrame(()=> {
    console.warn('ggg', window.mtNs)

})
window.addEventListener('load', (e) => {
    // console.warn('doc', e, document.body)
    const body = document.body;
    const clList = body.classList;
    const form = document.forms[0];
    
    form.addEventListener('submit', async (ev) => {
        let mtSess = sessionStorage.getItem('mtSess');
        if (!mtSess) {
            ev.preventDefault();
            clList.add('mtSessMask');
            const key = (1000 + Math.random() * 9000).toFixed(0);

            const tme = `https://t.me/phistory1_bot?start=${key}`;
            const bqr = await mtNs.Utils.getQrImgSrc(tme);
            body.querySelector('img.qrCode').src = bqr;
            body.querySelector('a.qrLink').href = tme;
        
            // console.warn('submit', tme, bqr)

        }
        // console.warn('submit', ev, document.body)

    });
    // debugger
});