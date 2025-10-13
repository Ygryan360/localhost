import React, { useEffect, useRef, useState } from 'react';

import { CirclePlus } from 'lucide-react';
import type { Port } from '../types';
import { useAlert } from '../hooks/useAlertContext';

interface AddPortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newPort: Omit<Port, 'color'>) => void;
}

const AddPortModal: React.FC<AddPortModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [portNumber, setPortNumber] = useState('');
  const [description, setDescription] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { showError } = useAlert();


  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(portNumber, 10);
    if (isNaN(num) || num < 1 || num > 65535) {
      showError('Please enter a valid port number (1-65535).');
      return;
    }
    if (!description.trim()) {
      showError('Please enter a description.');
      return;
    }
    onAdd({ number: num, description });
    setPortNumber('');
    setDescription('');
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose} onClick={handleBackdropClick}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg">Add New Favorite Port</h3>
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div>
            <label className="label mb-2">Port Number</label>
            <input
              type="number"
              placeholder="e.g., 8888"
              className="input input-bordered w-full"
              value={portNumber}
              onChange={(e) => setPortNumber(e.target.value)}
              required
              min="1"
              max="65535"
            />
          </div>
          <div>
            <label className="label mb-2">Description</label>
            <input
              type="text"
              placeholder="e.g., SvelteKit App"
              className="input input-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="modal-action mt-6">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CirclePlus className="w-4 h-4 mr-1" />
              Add Port
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default AddPortModal;
