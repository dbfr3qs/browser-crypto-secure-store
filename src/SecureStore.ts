import { IndexedDbCryptoKeyPairStore, type CryptoKeyPairStore } from "./IndexedDbCryptoKeyPairStore";

/**
 * @beta
 *
 * CryptoKeyPairOptions is an object containing optional arguments supplied as options in SetKeyOptions.
 *
 * See [SubtleCrypto.generateKey()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey)
 */
export type CryptoKeyPairOptions = {
    algorithm:  RsaHashedKeyGenParams | EcKeyGenParams | HmacKeyGenParams | AesKeyGenParams;
    extractable: false;
    keyUsages: KeyUsage[];
};

/**
 * @beta
 *
 * SetKeyOptions is an object containing arguments for the setKey method.
 *
 * key - The name of the key to store.
 * options - An object containing optional arguments for the CryptoKeyPair. See https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey.
 * ttl - The time to live for the key in seconds.
 *
 */
export type SetKeyOptions = {
    key: string;
    options?: CryptoKeyPairOptions;
    ttl?: number;
}

/**
 * @beta
 *
 * SecureStoreOptions is an object containing optional arguments for the SecureStore constructor.
 *
 */
export type SecureStoreOptions = {
    cryptoKeyPairStore?: CryptoKeyPairStore;
    dbName?: string;
    storeName?: string;
}

/**
 * @beta
 *
 * SecureStore is a class that provides a secure way to store and retrieve CryptoKeyPairs.
 *
 * By default it uses IndexedDb to store CryptoKeyPairs with non extractable private keys.
 */
export class SecureStore {
    private cryptoKeyPairStore: CryptoKeyPairStore;

    /**
     * Creates a new instance of SecureStore using indexedDb as the storage mechanism.
     *
     * @param args - An object containing optional arguments.
     */
    public constructor({
            cryptoKeyPairStore,
            dbName,
            storeName,
        }: SecureStoreOptions = {}) {
            this.cryptoKeyPairStore = cryptoKeyPairStore || new IndexedDbCryptoKeyPairStore(dbName, storeName);
        }

    /**
     * Generates a new CryptoKeyPair and stores it in the SecureStore.
     *
     * @param args - A SeyKeyOptions object containing the key name and optional arguments.
     * @returns - A CryptoKeyPair or CryptoKey.
     */
    public async setKey({
                            key,
                            options = {
                                algorithm: {
                                    name: "ECDSA",
                                    namedCurve: "P-256",
                                } as EcKeyGenParams,
                                extractable: false,
                                keyUsages: ["sign", "verify"],
                            } ,
                            ttl,
                        }: SetKeyOptions): Promise<CryptoKeyPair | CryptoKey> {
        const { algorithm, extractable, keyUsages } = options;

        const keyPair = await window.crypto.subtle.generateKey(
            algorithm,
            extractable,
            keyUsages,
        );

        try {
            await this.cryptoKeyPairStore.set(key, keyPair);
            if (ttl) {
                await this.setTtl(key, ttl);
            }
            return keyPair;
        } catch (err) {
            throw new Error(`Error storing key pair: ${err.message}`);
        }
    }

    /**
     * Retrieves a CryptoKeyPair from the SecureStore.
     * @param key - the name of the key to retrieve.
     */
    public async getKey(key: string): Promise<CryptoKeyPair> {
        const keyPair = await this.cryptoKeyPairStore.get(key);
        if (!keyPair) {
            throw new Error(`Key not found: ${key}`);
        }
        return keyPair as CryptoKeyPair;
    }

    /**
     * Removes a CryptoKeyPair from the SecureStore.
     * @param key - the name of the key to remove.
     */
    public async removeKey(key: string): Promise<void> {
        await this.cryptoKeyPairStore.remove(key);
    }

    /**
     * Retrieves all the names of all keys stored in the SecureStore.
     * @returns An array of key names.
     */
    public async getAllKeys(): Promise<string[]> {
        return await this.cryptoKeyPairStore.getAllKeys();
    }

    async setTtl(key: string, ttl: number): Promise<void> {
        window.setTimeout(async () => {
            await this.removeKey(key);
            console.log("Removed key: ", key);
        }, ttl);
    }
}
