import { IndexedDbCryptoKeyPairStore } from "./IndexedDbCryptoKeyPairStore";

export type CryptoKeyPairOptions = {
    algorithm:  RsaHashedKeyGenParams | EcKeyGenParams | HmacKeyGenParams | AesKeyGenParams;
    extractable: false;
    keyUsages: KeyUsage[];
};

export class SecureStore {
    indexedEbCryptoKeyPairStore: IndexedDbCryptoKeyPairStore;

    public constructor(dbName?: string, storeName?: string) {
        this.indexedEbCryptoKeyPairStore = new IndexedDbCryptoKeyPairStore(dbName, storeName);
    }

    public async setKey(key: string, options: CryptoKeyPairOptions = {
        algorithm: {
            name: "ECDSA",
            namedCurve: "P-256",
        },
        extractable: false,
        keyUsages: ["sign", "verify"],
    }): Promise<CryptoKeyPair | CryptoKey> {
        const { algorithm, extractable, keyUsages } = options;

        let keyPair = await window.crypto.subtle.generateKey(
            algorithm,
            extractable,
            keyUsages,
        );

        try {
            await this.indexedEbCryptoKeyPairStore.set(key, keyPair);
            return keyPair;
        } catch (err) {
            throw new Error(`Error storing key pair: ${err}`);
        }
    }

    public async get(key: string): Promise<string> {
        console.log(`Getting ${key}`);
        return "value";
    }

    public async remove(key: string): Promise<void> {
        console.log(`Removing ${key}`);
    }

    public async getAllKeys(): Promise<string[]> {
        console.log(`Getting all keys`);
        return ["key1", "key2"];
    }
}
