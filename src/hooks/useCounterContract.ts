import { useEffect, useState } from "react";
import {TonSmartTact} from "../contracts/counter";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "@ton/core";

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | number>();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const counterAddress = Address.parse('kQDqNGl4ZfP1pl2Eee0lpQs8KEkxj3_pqq4uRU7N1L1zL9GP');
    const contract = TonSmartTact.fromAddress(counterAddress);
    return client.open(contract) as OpenedContract<TonSmartTact>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(Number(val));
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
  };
}
