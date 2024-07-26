export const environment: any = {
  production: true,
  // mqtt: {
  //   hostname:'broker.emqx.io',
  //   port: 8083, // Use 8883 for TLS
  //   path: '/mqtt', // Typically empty for non-TLS
  //   // mqttUser: 'rdctgbmb:rdctgbmb',
  //   // mqttPass: 'Q38RMeaEo3vuHEY5-swfp8O_qwSJ5n5N',
  //   protocol: 'ws',
  // },
  mqtt: {
    hostname: 'whale.rmq.cloudamqp.com',
    port: 443, // Use 8883 for TLS
    path: '/mqtt', // Typically empty for non-TLS
    username: 'rdctgbmb:rdctgbmb',
    password: 'Q38RMeaEo3vuHEY5-swfp8O_qwSJ5n5N',
    protocol: 'wss',
  }
  // mqtt: {
  //   hostname: 'broker.hivemq.com',
  //   port: 8000, // Use 8883 for TLS
  //   path: '/mqtt', // Typically empty for non-TLS
  //   // mqttUser: 'rdctgbmb:rdctgbmb',
  //   // mqttPass: 'Q38RMeaEo3vuHEY5-swfp8O_qwSJ5n5N',
  //   protocol: 'ws',
  // }
};
