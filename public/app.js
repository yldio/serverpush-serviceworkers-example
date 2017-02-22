if ('serviceWorker' in navigator) {
  // REMOVE { insecure: true } in the following line if you're using this example and own a legitimate certificate
  navigator.serviceWorker.register('/sw.js', { insecure: true })
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
