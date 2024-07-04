import { SecureStore, type CryptoKeyPairOptions } from "./SecureStore";

describe("SecureStore set", () => {

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    it("should generate and store a CryptoKeyPair", async () => {
        // Arrange
        const subject = new SecureStore();

        // Act
        const key = await subject.setKey({ key: "some key" }) as CryptoKeyPair;

        // Assert
        expect(key).toBeDefined();
        expect(key.publicKey instanceof CryptoKey).toBe(true);
        expect(key.privateKey instanceof CryptoKey).toBe(true);
    });

    it("should take CryptoKeyPair options as an argument", async () => {
        // Arrange
        const subject = new SecureStore();

        // Act
        const cryptoKeyPairOptions: CryptoKeyPairOptions = {
            algorithm: {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            extractable: false,
            keyUsages: ["encrypt", "decrypt"],
        };

        const key = await subject.setKey( { key: "some key", options: cryptoKeyPairOptions }) as CryptoKeyPair;

        // Assert
        expect(key).toBeDefined();
        expect(key.publicKey instanceof CryptoKey).toBe(true);
        expect(key.privateKey instanceof CryptoKey).toBe(true);
        expect(key.publicKey.algorithm.name).toBe("RSA-OAEP");
    });

    it("should take ttl as an argument", async () => {
        // Arrange
        const subject = new SecureStore();
        const storeSpy = jest.spyOn(subject.indexedEbCryptoKeyPairStore, "set");

        // Act
        const key = await subject.setKey({ key: "some key", ttl: 60 }) as CryptoKeyPair;

        // Assert
        expect(key).toBeDefined();
        expect(key.publicKey instanceof CryptoKey).toBe(true);
        expect(key.privateKey instanceof CryptoKey).toBe(true);
        expect(storeSpy).toHaveBeenCalledWith("some key", key, 60);
    });
});
