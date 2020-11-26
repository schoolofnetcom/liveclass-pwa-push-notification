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

window.ready(function() {
    let swRegistration = null;
    const showPush = async (options) => swRegistration.showNotification("PWA Notification!", options);
    const messaging = firebase.messaging();
    
    messaging.requestPermission().then(() => {
      console.log(messaging.getToken());
      return messaging.getToken();
    })
    .then(token => {
        console.log(token);
    }).catch(err => {
        console.log("No permission to send push", err);
    });    
    
    const checkPermission = async () => {
        try {
            if (window.Notification && Notification.permission === "granted") {
                return true;
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
