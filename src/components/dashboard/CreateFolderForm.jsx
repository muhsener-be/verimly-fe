import React, { useState } from 'react';
import { createFolder } from '../../services/api';
import Input from '../ui/Input';
import Label from '../ui/Label';
import Button from '../ui/Button';

// Kullanıcının seçebileceği renk paleti
const colorPalette = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
];

const CreateFolderForm = ({ onFolderCreated, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    label_color_hex: colorPalette[4], // Varsayılan olarak mavi
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createFolder(formData);
      onFolderCreated(); // Dashboard'a haber ver: "Klasör oluştu, listeyi yenile!"
      onClose(); // Formu kapat
    } catch (err) {
      setError(err.response?.data?.message || 'Klasör oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Klasör Adı</Label>
        <Input id="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
        <Input id="description" value={formData.description} onChange={handleChange} />
      </div>
      <div>
        <Label>Etiket Rengi</Label>
        <div className="flex gap-2 mt-2">
          {colorPalette.map(color => (
            <button
              type="button"
              key={color}
              onClick={() => setFormData({ ...formData, label_color_hex: color })}
              className={`w-8 h-8 rounded-full transition-transform ${formData.label_color_hex === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onClose}>İptal</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Oluşturuluyor...' : 'Oluştur'}
        </Button>
      </div>
    </form>
  );
};

export default CreateFolderForm;