# bitcoin-address-generator
A simple javascript library to generate bitcoin private key and address

##Usage
```js
const Bitcoin = require('bitcoin-address-generator');

Bitcoin.createWalletAddress(response => {
    console.log(response);
});

```
##Output
```json
{ 
  key: '0319d819ccdf2604e421b57b3e2e12029989ddf60f3e6830e5f9335927702df9d3',
  address: '1BWD21e5hLX5RMn1DfkMRP3Q5s4LCqQMkg' 
}
```
