# Store Crypto KeyPairs securely in the browser

A tiny library with no dependencies that allows you to generate
and store [CryptoKeyPairs](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKeyPair) without the private key material ever
being exposed to the browser.

KeyPairs are generated and then stored as objects within IndexedDB with optional TTLs.



## Usage

```npm install browser-crypto-secure-store```

```javascript

import { create } from 'browser-crypto-secure-store';

// this creates and stores a RS256 keypair in indexedDB
const keyPair = create(name);

// keyPair is an object where the private key has been marked as
// non exportable. You can still use this object to sign data with
// the private key, but the key material itself is not visible 
// anywhere within the browser.

// Retreive the keyPair object
import { get } from 'browser-crypto-secure-store';
const keyPair = await get(name);

// Same deal as above. The private key is not visible but the keyPair
// object can still be used to sign data.

// Remove the key from persistent storage
import { remove } from 'browser-crypto-secure-store';
await remove(name);

// Options
options = new CryptoStoreOptions() {
    ttl: 3600, // time to live in seconds
    algorithm: 'RS256' // algorithm to use;
}

await keyPair = create(name, options);
```
