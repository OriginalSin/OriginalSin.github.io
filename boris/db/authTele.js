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
    const hostId = 21;                  // host с которого авторизуемся
    const pType = 15;                   // номер страницы с которой авторизуемся
    const bName = 'phistory1_bot';      // имя бота
    
    form.addEventListener('submit', async (ev) => {
        let mtSess = sessionStorage.getItem('mtSess');
        if (!mtSess) {
            ev.preventDefault();
            clList.add('mtSessMask');
            let key = [
                hostId,
                pType,
                (1000 + Math.random() * 9000).toFixed(0)
            ].join('_');
            // window.mtNsCallBack = (data) => {
            //     console.warn('mtNsCallBack', key, data);

            // };
            const ow = mtNs.Utils.getWindowOpen(
                `https://moretele.ru/auth/index.html?botName=${bName}&start=${key}`,
                {
                    ww: 300
                }
            );
            const owClose = (flag) => {
                if (!ow.closed) ow.close();
                if (flag) clList.remove('mtSessMask');

            };

            window.addEventListener('unload', () => {
                debugger
                owClose(true);
            });

            mtNs.bcc.addEventListener('message', e => {
                const {cmd, sessions} = e.data;
                if (cmd === 'users') {
                    Object.values(sessions.ontg).some(v => {
                        if (v.bot && v.bot.name === bName) {
                            const {text, from} = v.message;
                            if (key === text.substring(7)) {
                                console.warn('vvvv', key, from)
                                owClose(true);
                                sessionStorage.setItem('mtSess', JSON.stringify(from));

                            }

                        }
                    })
                }
                console.warn('message', key, ow, e.data)
                if (ow.closed) owClose(true);

            });
        

        }
        // console.warn('submit', ev, document.body)

    });
    // debugger
});