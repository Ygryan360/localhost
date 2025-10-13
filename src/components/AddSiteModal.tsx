import React, { useEffect, useRef, useState } from 'react';

import { CirclePlus } from 'lucide-react';
import type { LocalSite } from '../types';
import { useAlert } from '../hooks/useAlertContext';

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (site: Omit<LocalSite, 'color'>) => void;
}

const AddSiteModal: React.FC<AddSiteModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [description, setDescription] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { showWarning } = useAlert();

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
    if (!name.trim()) {
      showWarning('Please enter a site name.');
      return;
    }
    if (!path.trim()) {
      showWarning('Please enter a path.');
      return;
    }
    onAdd({
      name: name.trim(),
      path: path.trim(),
      description: description.trim() || name.trim(),
    });
    setName('');
    setPath('');
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
        <h3 className="font-bold text-lg">Add New Local Site</h3>
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div>
            <label className="label mb-2">Site Name</label>
            <input
              type="text"
              placeholder="e.g., My Project"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label mb-2">Path</label>
            <input
              type="text"
              placeholder="e.g., Projects/my-project"
              className="input input-bordered w-full"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label mb-2">Description</label>
            <input
              type="text"
              placeholder="e.g., WordPress site"
              className="input input-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="modal-action mt-6">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CirclePlus className="w-4 h-4 mr-1" />
              Add Site
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default AddSiteModal;