export class IndexedDbCryptoKeyPairStore {
    readonly _dbName: string = "secure";
    readonly _storeName: string = "store";

    public constructor(dbName?: string, storeName?: string) {
        if (dbName) {
            this._dbName = dbName;
        }
        if (storeName) {
            this._storeName = storeName;
        }
    }

    public async set(key: string, value: CryptoKeyPair | CryptoKey, ttl?: number): Promise<void> {
        const store = await this.createStore(this._dbName, this._storeName);
        await store("readwrite", (str: IDBObjectStore) => {
            str.put(value, key);
            return this.promisifyRequest(str.transaction);
        });

        if (ttl) {
            console.log("Writing key with ttl: ", ttl);
            await this.setTtl(key, ttl);
        }
    }

    public async get(key: string): Promise<CryptoKeyPair | CryptoKey> {
        const store = await this.createStore(this._dbName, this._storeName);
        return await store("readonly", (str) => {
            return this.promisifyRequest(str.get(key));
        }) as CryptoKeyPair | CryptoKey;
    }

    public async remove(key: string): Promise<CryptoKeyPair | CryptoKey> {
        const item = await this.get(key);
        const store = await this.createStore(this._dbName, this._storeName);
        await store("readwrite", (str) => {
            return this.promisifyRequest(str.delete(key));
        });
        return item;
    }

    public async getAllKeys(): Promise<string[]> {
        const store = await this.createStore(this._dbName, this._storeName);
        return await store("readonly", (str) => {
            return this.promisifyRequest(str.getAllKeys());
        }) as string[];
    }

    promisifyRequest<T = undefined>(
        request: IDBRequest<T> | IDBTransaction): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            (request as IDBTransaction).oncomplete = (request as IDBRequest<T>).onsuccess = () => resolve((request as IDBRequest<T>).result);
            (request as IDBTransaction).onabort = (request as IDBRequest<T>).onerror = () => reject((request as IDBRequest<T>).error);
        });
    }

    async createStore<T>(
        dbName: string,
        storeName: string,
    ): Promise<(txMode: IDBTransactionMode, callback: (store: IDBObjectStore) => T | PromiseLike<T>) => Promise<T>> {
        const request = indexedDB.open(dbName);
        request.onupgradeneeded = () => request.result.createObjectStore(storeName);
        const db = await this.promisifyRequest<IDBDatabase>(request);

        return async (
            txMode: IDBTransactionMode,
            callback: (store: IDBObjectStore) => T | PromiseLike<T>,
        ) => {
            const tx = db.transaction(storeName, txMode);
            const store = tx.objectStore(storeName);
            return await callback(store);
        };
    }

    async setTtl(key: string, ttl: number): Promise<void> {
        window.setTimeout(async () => {
            const keys = await this.remove(key);
            console.log("Removed key: ", keys);
        }, ttl);
    }
}