import { IndexedDbCryptoKeyPairStore } from "./IndexedDbCryptoKeyPairStore";

export type CryptoKeyPairOptions = {
    algorithm:  RsaHashedKeyGenParams | EcKeyGenParams | HmacKeyGenParams | AesKeyGenParams;
    extractable: false;
    keyUsages: KeyUsage[];
};

export type SetKeyOptions = {
    key: string;
    options?: CryptoKeyPairOptions;
    ttl?: number;
}

export class SecureStore {
    indexedEbCryptoKeyPairStore: IndexedDbCryptoKeyPairStore;

    public constructor(dbName?: string, storeName?: string) {
        this.indexedEbCryptoKeyPairStore = new IndexedDbCryptoKeyPairStore(dbName, storeName);
    }

    public async setKey(args: SetKeyOptions): Promise<CryptoKeyPair | CryptoKey> {
        const {
            key,
            options = {
                algorithm: {
                    name: "ECDSA",
                    namedCurve: "P-256",
                },
                extractable: false,
                keyUsages: ["sign", "verify"],
            },
            ttl} = args;

        const {
            algorithm,
            extractable,
            keyUsages } = options;

        const keyPair = await window.crypto.subtle.generateKey(
            algorithm,
            extractable,
            keyUsages,
        );

        try {
            await this.indexedEbCryptoKeyPairStore.set(key, keyPair, ttl);
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
