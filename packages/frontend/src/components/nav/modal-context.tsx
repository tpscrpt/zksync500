import React, { ReactNode, useState } from "react";

type TModalContext = {
  showModal: boolean;
  setShowModal?: (val: boolean) => void;
};
export const ModalContext = React.createContext<TModalContext>({ showModal: false });

export const ModalProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [showModal, setShowModal] = useState(false);

  return (
    <ModalContext.Provider value={{ showModal, setShowModal }}>{children}</ModalContext.Provider>
  );
};
