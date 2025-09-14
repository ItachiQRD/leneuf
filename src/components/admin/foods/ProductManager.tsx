import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Pencil, Trash2, Plus, Upload, Eye } from 'lucide-react';
import { Food } from '@/types/food';

// Composant pour afficher une image avec gestion des erreurs
const ProductImage = ({ src, alt, className = "" }: { src: string, alt: string, className?: string }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${className}`}>
        <Upload className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain rounded"
        onError={() => setError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        unoptimized={src.startsWith('blob:')}
      />
    </div>
  );
};

interface FoodManagerProps {
  items: Food[];
  onCreateItem: () => void;
  onUpdateItem: (id: string, data: any) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

export default function FoodManager({ 
  items, 
  onCreateItem, 
  onUpdateItem, 
  onDeleteItem
}: FoodManagerProps) {
  
  const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean, itemId: string | null, itemName: string}>({
    isOpen: false,
    itemId: null,
    itemName: ''
  });

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirm({
      isOpen: true,
      itemId: id,
      itemName: name
    });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.itemId) {
      await onDeleteItem(deleteConfirm.itemId);
      setDeleteConfirm({
        isOpen: false,
        itemId: null,
        itemName: ''
      });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({
      isOpen: false,
      itemId: null,
      itemName: ''
    });
  };

  const getTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      'burger': 'Burger',
      'pizza': 'Pizza',
      'salad': 'Salade',
      'sandwich_durum': 'Sandwich/Durum'
    };
    return typeLabels[type] || type;
  };

  const getCategoryLabel = (category: string) => {
    const categoryLabels: { [key: string]: string } = {
      'bestseller': 'Best-seller',
      'new': 'Nouveau',
      'regular': 'Regular'
    };
    return categoryLabels[category] || category;
  };

  return (
    <div className="space-y-4">
      <Button onClick={onCreateItem} className="mb-4">
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un plat
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Disponible</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <ProductImage
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12"
                />
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {item.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getTypeLabel(item.type)}
                </span>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.category === 'bestseller' ? 'bg-yellow-100 text-yellow-800' :
                  item.category === 'new' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getCategoryLabel(item.category)}
                </span>
              </TableCell>
              <TableCell className="font-medium">{item.price}€</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.available ? 'Disponible' : 'Indisponible'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onUpdateItem(item._id, item)}
                    className="h-8 w-8"
                    title="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item._id, item.name)}
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de confirmation de suppression */}
      <Dialog open={deleteConfirm.isOpen} onOpenChange={cancelDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{deleteConfirm.itemName}" ? 
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

