import React, { useCallback, useMemo, useState } from "react";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: () => {},
  closeBuyWindow: () => {},
});

export const GeneralContextProvider = ({ children }) => {
  const [orderWindow, setOrderWindow] = useState(null);

  const openBuyWindow = useCallback(
    (ticker, price, mode = "BUY") => {
      if (!ticker) return;

      setOrderWindow({
        ticker,
        price: Number(price) || 0,
        mode: mode === "SELL" ? "SELL" : "BUY",
      });
    },
    []
  );

  const closeBuyWindow = useCallback(() => {
    setOrderWindow(null);
  }, []);

  const value = useMemo(
    () => ({
      openBuyWindow,
      closeBuyWindow,
    }),
    [openBuyWindow, closeBuyWindow]
  );

  return (
    <GeneralContext.Provider value={value}>
      {children}

      {orderWindow && (
        <BuyActionWindow
          uid={orderWindow.ticker}
          price={orderWindow.price}
          initialMode={orderWindow.mode}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;