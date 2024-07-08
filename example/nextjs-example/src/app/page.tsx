'use client';
import {MouseEventHandler, useEffect, useState} from "react";

function CryptoStoreSetKeyButtonComponent() {
  const [onClickHandler, setOnClickHandler] = useState<MouseEventHandler<HTMLButtonElement> | undefined>(undefined);

  useEffect(() => {
    const handleClick = async () => {
      const { SecureStore } = await import('browser-crypto-secure-store');
      const secureStore = new SecureStore();
      await secureStore.setKey({ key: "key" });

      console.log('Button clicked');
    };

    setOnClickHandler(() => handleClick);
  }, []);

  return <button onClick={onClickHandler}>Create a Key</button>
}

function CryptoStoreRemoveKeyButtonComponent() {
  const [onClickHandler, setOnClickHandler] = useState<MouseEventHandler<HTMLButtonElement> | undefined>(undefined);

  useEffect(() => {
    const handleClick = async () => {
      const { SecureStore } = await import('browser-crypto-secure-store');
      const secureStore = new SecureStore();
      await secureStore.removeKey("key");

      console.log('Remove Key Button clicked');
    };

    setOnClickHandler(() => handleClick);
  }, []);

  return <button onClick={onClickHandler}>Remove Key</button>;
}


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <div>
          <CryptoStoreSetKeyButtonComponent/>
        </div>
        <div>
          <CryptoStoreRemoveKeyButtonComponent/>
        </div>
      </div>
    </main>
  );
}
