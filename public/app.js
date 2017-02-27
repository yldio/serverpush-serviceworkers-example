if ('serviceWorker' in navigator) {
  // Note: you dont need { insecure: true } if you're using this example and own a legitimate certificate
  // navigator.serviceWorker.register('/sw.js', { insecure: true })
  navigator.serviceWorker.register('/sw.js')
    .then(function(reg) {

    if(reg.installing) {
      console.log('SW installing');
    } else if(reg.waiting) {
      console.log('SW installed');
    } else if(reg.active) {
      console.log('SW active');
    }

  }).catch(function(error) {
    // registration failed - we need to handle that somehow
    console.log(error);
  });
};
