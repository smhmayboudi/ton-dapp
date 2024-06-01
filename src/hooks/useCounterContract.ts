import { useEffect, useState } from "react";
import { TonSmartFunc } from "../contracts/TonSmartFunc";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "@ton/core";
import { useTonConnect } from "./useTonConnect";

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | string>();
  const { sender } = useTonConnect();

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = TonSmartFunc.createFromAddress(
      Address.parse("kQDWGcc-KJW7OmdUbaVskkkuF64k6rrhUTG152UkSFXZpIKL"),
    );
    return client.open(contract) as OpenedContract<TonSmartFunc>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(val.toString());
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
    sendIncrement: () => {
      return counterContract?.sendIncrease(sender, {
        increaseBy: 1,
        value: toNano("0.05"),
      });
    },
  };
}
