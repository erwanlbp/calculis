importScripts('/__/firebase/9.2.0/firebase-app-compat.js');
importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js');
importScripts('/__/firebase/init.js');
const messaging = firebase.messaging();

console.log('sw registration')

// messaging.onBackgroundMessage(function (payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);

//   let notificationTitle = 'Default notif title';
//   let notificationOptions = { body: 'Default notif body' };

//   if (payload.data.type == 'game_created' || payload.data.type == 'next_level_ready_to_play') {
//     notificationTitle = 'Calculis';
//     notificationOptions = {
//       body: `La game ${payload.data.gameId} est prete à jouer !`,
//     };
//   } else {
//     console.log('unknown data.type, skipping')
//     return
//   }

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });