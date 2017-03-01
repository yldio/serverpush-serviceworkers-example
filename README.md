# HTTP/2 Server Push & Service Workers example

This code example is explained in [https://blog.yld.io/2017/03/01/optimize-with-http-2-server-push-and-service-workers](https://blog.yld.io/2017/03/01/optimize-with-http-2-server-push-and-service-workers).


![image](https://cloud.githubusercontent.com/assets/1150553/23367424/1742049c-fd02-11e6-92ce-df17814bdca5.png)

*(Image: This example with a valid certificate and cached resources - The two pushed resources are cached and later retrieved from disk cache, when Service Worker tries to request them.)*


### Install the dependencies and start the server

```
yarn install
npm start
```

#### Go to [https://localhost:3000/](https://localhost:3000/)
