import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./NoteModal.module.css";
import NoteForm from "../NoteForm/NoteForm";

interface NoteModalProps {
  onClose: () => void;
  children: ReactNode;
}

const modalRoot = document.getElementById("modal-root")!;

const NoteModal = ({ onClose, children }: NoteModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        {children}
        <NoteForm onClose={onClose} />
      </div>
    </div>,
    modalRoot
  );
};

export default NoteModal;
