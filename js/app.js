function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        document.attachEvent('onreadystatechange', function() {
        if (document.readyState != 'loading')
            fn();
        });
    }
}

/**
 * POST https://fcm.googleapis.com/fcm/send
 * Headers
 *  - Content-Type: application/json
 *  - Authorization: key=CHAVE_SERVIDOR
 * Body
 * {
        "to": "c5x54sTRuiMmOLp98L7oTm:APA91bGYlxrbc7c9G6E7gXZ-G39alPFrLISZQkmRNSsgFUFzYX5Dvkp1P5Y6gTQYpX4pbxAZN_yjD0erAlC6VzspG6X7kY2SaVy--kL8HhITDOlldyKCz_iwYFx8CQK-gxTZyVnK9mEE",
        "data": {
            "notification": {
                "title": "Oi!",
                "body": "Eu sou uma notificação!"
            } 
        }
    }
 */
window.ready(async function() {
    let swRegistration = null;
    const messaging = firebase.messaging();

    const showPush = async (options) => swRegistration.showNotification("PWA Notification!", options);
    
    const getFirebaseToken = async () => {
        try {        
            const token = await messaging.getToken();
            console.log('Firebase Token =>', token);
            return token;
        } catch (err) {
            console.error('Failed to get Firebase token', err);
        }
    };

    const requestFirebasePermission = async () => {
        await messaging.requestPermission();
        return getFirebaseToken();
    };

    messaging.onMessage(payload => {
        const options = JSON.parse(payload.data.notification);
        showPush(options);
    }); 
    
    const checkPermission = async () => {
        try {
            if (window.Notification && Notification.permission === "granted") {
                return requestFirebasePermission();
            }        
            else if (window.Notification && Notification.permission !== "denied") {
                const status = await Notification.requestPermission();
                console.log('Notification API status in Client => ', status);
                if (status === "granted") {
                    showPush({ title: 'Permission granted', body: 'Now you will receive news'});
                } else {
                    alert("You denied or dismissed permissions to notifications.");
                }
                 
            }
        } catch (err) {
            console.error('Service Worker Error', error)
        }           
    };

    const initApp = async () => {
        try {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                console.log('Service Worker and Push is supported');    
                const swReg = await navigator.serviceWorker.register('./sw.js');
                console.log('Service Worker is registered', swReg);
                swRegistration = swReg;
                checkPermission();
            } else {
                console.warn('Push messaging is not supported');
            }
        } catch (err) {
            console.error('Service Worker Error', error)
        }        
    };

    initApp();
});
