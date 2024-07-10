# Store Crypto KeyPairs securely in the browser

![GitHub Release](https://img.shields.io/github/v/release/dbfr3qs/browser-crypto-secure-store?label=latest%20release)
![Build and Test](https://github.com/dbfr3qs/browser-crypto-secure-store/actions/workflows/build.yml/badge.svg)

A tiny library with no third party dependencies other than browser APIs that allows generating
and storing [CryptoKeyPairs](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKeyPair) without the private key material ever
being exposed directly to the browser.

Key pairs are generated and then stored as objects within IndexedDb with optional TTLs. 

All this library does is wrap the integration between the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) and IndexedDb to make it easier to
store and retrieve non-extractable keys for signing/encryption in the browser. 

It also provides a `ttl` option to automatically remove keys after a certain amount of time.

Supports ESM, UMD and the browser directly.

** PRs and contributions are welcome! **

## Usage

```npm install browser-crypto-secure-store```

```javascript

import { SecureStore } from 'browser-crypto-secure-store';

// Create a new instance of the SecureStore
const secureStore = new SecureStore();

// this creates and stores a non extractable keypair in indexedDB. RS256 is used by default 
const keyPair = await secureStore.setKey({ key: "key" } );

// create a new keypair with a TTL of 1 hour
const keyPair = await secureStore.setKey({ ley: "key", ttl: 3600 * 1000});

// create a new keypair with custom crypto configuration options
const options = {
    algorithm: {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
    },
    extractable: false,
    keyUsages: ["encrypt", "decrypt"],
}

const keyPair = await secureStore.setKey({ key: "key", options: options });

// Retreive the keyPair object
const keyPair = await secureStore.getKey("key");
const message = "Hello, World!";

// sign the message with our new private key
const signature = await window.crypto.subtle.sign(
    {
        name: "ECDSA",
        hash: { name: "SHA-256" },
    },
    keyPair.privateKey,
    new TextEncoder().encode(message),
);

// Remove the key from persistent storage

await removeKey("key");

```
