import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { User as UserIcon, Mail, Phone, MapPin, Lock, ArrowLeft } from 'lucide-react';
import type { User } from '@/types/auth';

interface FormState {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    complement: string;
  };
}

const emptyAddress = { street: '', city: '', postalCode: '', complement: '' };

function formFromUser(user: User | null): FormState {
  if (!user) {
    return {
      name: '',
      email: '',
      phone: '',
      address: emptyAddress
    };
  }
  const addr = user.address;
  return {
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: {
      street: (addr && 'street' in addr ? addr.street : '') || '',
      city: (addr && 'city' in addr ? addr.city : '') || '',
      postalCode: (addr && 'postalCode' in addr ? addr.postalCode : '') || '',
      complement: (addr && 'complement' in addr ? addr.complement : '') || ''
    }
  };
}

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(formFromUser(user));
  const [saving, setSaving] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);

  useEffect(() => {
    setForm(formFromUser(user));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.replace('address.', '') as keyof FormState['address'];
      setForm(prev => ({
        ...prev,
        address: { ...prev.address, [key]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address
        })
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: 'Erreur', description: data.message || 'Modification impossible', variant: 'destructive' });
        return;
      }
      await refreshUser();
      toast({ title: 'Profil mis à jour', description: 'Vos informations ont été enregistrées.' });
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de contacter le serveur', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSendResetLink = async () => {
    if (!user?.email) return;
    setSendingLink(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: 'Erreur', description: data.message || 'Envoi impossible', variant: 'destructive' });
        return;
      }
      toast({
        title: 'Lien envoyé',
        description: 'Si un compte existe pour votre adresse, un lien de réinitialisation a été envoyé par email.'
      });
    } catch {
      toast({ title: 'Erreur', description: 'Impossible d\'envoyer le lien', variant: 'destructive' });
    } finally {
      setSendingLink(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <UserIcon className="w-7 h-7 text-red-600" />
          Mon profil
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <UserIcon className="w-4 h-4" /> Nom
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                readOnly
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">L&apos;email ne peut pas être modifié ici.</p>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Téléphone
              </span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0X XX XX XX XX"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </label>
            <div className="pt-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" /> Adresse
              </span>
              <div className="space-y-3">
                <input
                  type="text"
                  name="address.street"
                  value={form.address.street}
                  onChange={handleChange}
                  placeholder="Rue et numéro"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="address.postalCode"
                    value={form.address.postalCode}
                    onChange={handleChange}
                    placeholder="Code postal"
                    maxLength={5}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    name="address.city"
                    value={form.address.city}
                    onChange={handleChange}
                    placeholder="Ville"
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <input
                  type="text"
                  name="address.complement"
                  value={form.address.complement}
                  onChange={handleChange}
                  placeholder="Complément d'adresse (optionnel)"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>

        <div className="mt-10 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-red-600" />
            Changer le mot de passe
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Un lien vous sera envoyé par email pour définir un nouveau mot de passe en toute sécurité.
          </p>
          <button
            type="button"
            onClick={handleSendResetLink}
            disabled={sendingLink}
            className="rounded-lg border-2 border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {sendingLink ? 'Envoi...' : 'Envoyer un lien par email'}
          </button>
        </div>
      </div>
    </div>
  );
}
