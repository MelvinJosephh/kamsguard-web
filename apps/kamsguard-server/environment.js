// environment.js
module.exports = {
    mqtt: {
      hostname: 'brisk-charcoal-dog.rmq2.cloudamqp.com',
      port: 443, // Use 5671 for TLS
      path: '/ws/mqtt', // Typically empty for non-TLS
      mqttUser: 'mwoesrer',
      mqttPass: 'v4I0WDWadZTvB6RVbVWWS7WGNKH63nJK',
      protocol: 'wss',
    },
    firebaseConfig: {
      apiKey: "AIzaSyAWNanmCmSpZ_bmcZ9zfZtTv5NvnZSGwg0",
      authDomain: "kamsguard-e8db2.firebaseapp.com",
      projectId: "kamsguard-e8db2",
      storageBucket: "kamsguard-e8db2.appspot.com",
      messagingSenderId: "770474449468",
      appId: "1:770474449468:web:96d55572a677c351ec4139",
      measurementId: "G-X83HM8X8S1"
    }
  };
  