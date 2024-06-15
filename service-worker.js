// service-worker.js
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  self.clients.claim();
  checkReminder();
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
      clients.openWindow('list-of-restaurants.html')
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'setReminder') {
      const reminderTime = event.data.time;
      const now = Date.now();
      if (reminderTime > now) {
          setTimeout(() => {
              self.registration.showNotification('Restaurant Reminder', {
                  body: 'Time to check out nearby restaurants!',
                  icon: 'https://maps.gstatic.com/tactile/mylocation/mylocation-icon-2x.png'
              });
          }, reminderTime - now);
      }
  }
});

function checkReminder() {
  self.clients.matchAll().then(clients => {
      clients.forEach(client => {
          client.postMessage({ action: 'getReminder' });
      });
  });
}
