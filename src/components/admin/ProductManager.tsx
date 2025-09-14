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
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Pencil, Trash2, Plus, Upload } from 'lucide-react';

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
        unoptimized={src.startsWith('blob:')} // Ne pas optimiser les blobs
      />
    </div>
  );
};

interface ProductManagerProps {
  items: any[];
  onCreateItem: (item: any) => Promise<void>;
  onUpdateItem: (id: string, item: any) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  type: string;
}

export default function ProductManager({ 
  items, 
  onCreateItem, 
  onUpdateItem, 
  onDeleteItem, 
  type 
}: ProductManagerProps) {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    description: '',
    image: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean, itemId: string | null, itemName: string}>({
    isOpen: false,
    itemId: null,
    itemName: ''
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsCreating(false);
    setSelectedImage(null);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingItem(null);
    setSelectedImage(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Créer une URL temporaire pour l'aperçu
      const imageUrl = URL.createObjectURL(file);
      
      if (editingItem) {
        setEditingItem({ ...editingItem, image: imageUrl });
      } else {
        setNewItem({ ...newItem, image: imageUrl });
      }
    }
  };

  const handleSave = async () => {
    if (editingItem) {
      await onUpdateItem(editingItem._id, editingItem);
      setEditingItem(null);
    } else if (isCreating && newItem.name && newItem.price) {
      await onCreateItem(newItem);
      setIsCreating(false);
      setNewItem({ name: '', price: 0, description: '', image: '' });
    }
    setSelectedImage(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsCreating(false);
    setNewItem({ name: '', price: 0, description: '', image: '' });
    setSelectedImage(null);
  };

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

  return (
    <div className="space-y-4">
      <Button onClick={handleCreate} className="mb-4">
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un {type.slice(0, -1)}
      </Button>

      {(isCreating || editingItem) && (
        <Card className="p-4 mb-4">
          <h3 className="text-lg font-semibold mb-4">
            {isCreating ? `Nouveau ${type.slice(0, -1)}` : `Modifier ${type.slice(0, -1)}`}
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={editingItem?.name || newItem.name}
                onChange={(e) => {
                  if (editingItem) {
                    setEditingItem({ ...editingItem, name: e.target.value });
                  } else {
                    setNewItem({ ...newItem, name: e.target.value });
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                type="number"
                value={editingItem?.price || newItem.price}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (editingItem) {
                    setEditingItem({ ...editingItem, price: value });
                  } else {
                    setNewItem({ ...newItem, price: value });
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editingItem?.description || newItem.description}
                onChange={(e) => {
                  if (editingItem) {
                    setEditingItem({ ...editingItem, description: e.target.value });
                  } else {
                    setNewItem({ ...newItem, description: e.target.value });
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <div className="flex items-center space-x-4">
                <ProductImage
                  src={editingItem?.image || newItem.image}
                  alt="Product preview"
                  className="w-24 h-24 border rounded"
                />
                <div>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choisir une image
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSave}>Enregistrer</Button>
              <Button variant="outline" onClick={handleCancel}>Annuler</Button>
            </div>
          </div>
        </Card>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Description</TableHead>
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
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.price}€</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(item)}
                  className="mr-2"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item._id, item.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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
