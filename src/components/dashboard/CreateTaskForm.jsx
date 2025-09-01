import React, { useState } from 'react';
import { createTask } from '../../services/api';
import Input from '../ui/Input';
import Label from '../ui/Label';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';

// Öncelik seçenekleri
const priorities = [
  { id: 'LOW', label: 'Düşük' },
  { id: 'MEDIUM', label: 'Orta' },
  { id: 'HIGH', label: 'Yüksek' },
];

const CreateTaskForm = ({ folderId, onTaskCreated, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'MEDIUM',
    due_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  // Hızlı tarih seçimi için yardımcı fonksiyon
  const setQuickDate = (daysToAdd) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    // Formatı "YYYY-MM-DDTHH:mm" haline getiriyoruz
    const formattedDate = date.toISOString().slice(0, 16);
    setFormData({...formData, due_date: formattedDate});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Gönderilecek veriyi hazırlıyoruz
    const payload = {
      ...formData,
      folder_id: folderId,
    };

    // --- İŞTE DÜZELTME BURADA ---
    // Eğer bir bitiş tarihi girildiyse, onu ISO formatına çeviriyoruz.
    if (payload.due_date) {
      // '2025-08-31T19:45' gibi bir değeri alıp tam ISO string'ine dönüştürür
      // Sonuç: '2025-08-31T16:45:00.000Z' (UTC olarak)
      payload.due_date = new Date(payload.due_date).toISOString();
    };


    // Boş olan opsiyonel alanları payload'dan temizliyoruz
    if (!payload.description) delete payload.description;
    if (!payload.due_date) delete payload.due_date;
    
    try {
      await createTask(payload);
      onTaskCreated(); // Dashboard'a haber ver: "Görev oluştu, listeyi yenile!"
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Görev oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Görev Adı */}
      <div>
        <Label htmlFor="name">Görev Adı</Label>
        <Input id="name" value={formData.name} onChange={handleChange} required />
      </div>

      {/* Açıklama */}
      <div>
        <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
        <Textarea id="description" value={formData.description} onChange={handleChange} />
      </div>
      
      {/* Öncelik */}
      <div>
        <Label>Öncelik</Label>
        <div className="flex gap-2 mt-2">
          {priorities.map(({id, label}) => (
            <Button
              type="button"
              key={id}
              variant={formData.priority === id ? 'default' : 'outline'}
              onClick={() => setFormData({ ...formData, priority: id })}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Bitiş Tarihi */}
      <div>
        <Label htmlFor="due_date">Bitiş Tarihi (Opsiyonel)</Label>
        <Input id="due_date" type="datetime-local" value={formData.due_date} onChange={handleChange} />
        <div className="flex gap-2 mt-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => setQuickDate(0)}>Bugün</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setQuickDate(1)}>Yarın</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setQuickDate(7)}>Haftaya</Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onClose}>İptal</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Oluşturuluyor...' : 'Görevi Oluştur'}
        </Button>
      </div>
    </form>
  );
};

export default CreateTaskForm;