"use client";
import { useState } from 'react';
import { inventoryService } from '@/app/services/inventoryService';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  productId: string | null;
  productName: string | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

export default function DeleteModal({ isOpen, productId, productName, onClose, onDeleted }: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !productId) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await inventoryService.deleteProduct(productId);
      onDeleted(productId);
      onClose();
    } catch (err) {
      alert('Failed to delete product. Please try again.');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <span className="font-semibold">"{productName}"</span>? 
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              {isDeleting ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}