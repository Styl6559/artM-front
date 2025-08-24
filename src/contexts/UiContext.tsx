import React, { createContext, useContext, useState } from 'react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
}

interface UiContextType {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  confirmDialog: ConfirmDialogProps | null;
  toggleConfirmDialog: (dialog: ConfirmDialogProps | null) => void;
}

const UiContext = createContext<UiContextType | undefined>(undefined);

export const UiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps | null>(null);

  const toggleConfirmDialog = (dialog: ConfirmDialogProps | null) => {
    setConfirmDialog(dialog);
  };

  return (
    <UiContext.Provider value={{
      mobileMenuOpen,
      setMobileMenuOpen,
      confirmDialog,
      toggleConfirmDialog
    }}>
      {children}
    </UiContext.Provider>
  );
};

export const useUi = () => {
  const context = useContext(UiContext);
  if (context === undefined) {
    throw new Error('useUi must be used within a UiProvider');
  }
  return context;
};