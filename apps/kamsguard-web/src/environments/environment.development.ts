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
  // mqtt: {
  //   hostname: 'whale.rmq.cloudamqp.com',
  //   port: 15675, // Use 8883 for TLS
  //   path: '/ws/amqp', // Typically empty for non-TLS
  //   username: 'rdctgbmb:rdctgbmb',
  //   password: 'Q38RMeaEo3vuHEY5-swfp8O_qwSJ5n5N',
  //   protocol: 'wss',
  // }
  mqtt: {
    hostname: 'brisk-charcoal-dog.rmq2.cloudamqp.com',
    port: 443, // Use 5671 for TLS
    path: '/ws/mqtt', // Typically empty for non-TLS
    mqttUser: 'mwoesrer',
    mqttPass: 'v4I0WDWadZTvB6RVbVWWS7WGNKH63nJK',
    protocol: 'wss',
  }
  // mqtt: {
  //   hostname: '192.168.1.91',
  //   port: 15675, // Use 8883 for TLS
  //   path: '/ws', // Typically empty for non-TLS
  //   mqttUser: 'guest',
  //   mqttPass: 'guest',
  //   protocol: 'ws',
  // },
  
};
