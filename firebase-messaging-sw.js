importScripts("https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.1.1/firebase-messaging.js");
importScripts('init.js')

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(payload => {
    console.log('payload sw', payload)
    const notification = JSON.parse(payload.data.notification);
    const notificationTitle = notification.title;
    const notificationOptions = {
        body: notification.body
    };
    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});    