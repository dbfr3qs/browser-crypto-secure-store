import { IndexedDbCryptoKeyPairStore } from "./IndexedDbCryptoKeyPairStore";

/**
 * @beta
 */
export type CryptoKeyPairOptions = {
    algorithm:  RsaHashedKeyGenParams | EcKeyGenParams | HmacKeyGenParams | AesKeyGenParams;
    extractable: false;
    keyUsages: KeyUsage[];
};

/**
 * @beta
 */
export type SetKeyOptions = {
    key: string;
    options?: CryptoKeyPairOptions;
    ttl?: number;
}

/**
 * @beta
 */
export class SecureStore {
    cryptoKeyPairStore: IndexedDbCryptoKeyPairStore;

    public constructor(dbName?: string, storeName?: string) {
        this.cryptoKeyPairStore = new IndexedDbCryptoKeyPairStore(dbName, storeName);
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
            await this.cryptoKeyPairStore.set(key, keyPair);
            await this.setTtl(key, ttl);
            return keyPair;
        } catch (err) {
            throw new Error(`Error storing key pair: ${err}`);
        }
    }

    public async getKey(key: string): Promise<CryptoKeyPair> {
        return await this.cryptoKeyPairStore.get(key) as CryptoKeyPair;
    }

    public async removeKey(key: string): Promise<void> {
        await this.cryptoKeyPairStore.remove(key);
    }

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
