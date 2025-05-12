'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Props {
  courseId: string;
  initialValue: boolean;
}

export const CertificateToggleForm = ({ courseId, initialValue }: Props) => {
  const [certificateEnabled, setCertificateEnabled] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setCertificateEnabled(newValue);
    setLoading(true);

    try {
      await axios.patch(`/api/courses/${courseId}/certificate`, {
        certificateEnabled: newValue,
      });
      toast.success('Курс жаңартылды');
    } catch {
      toast.error('Жаңарту кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      <input
        id="certificateEnabled"
        type="checkbox"
        checked={certificateEnabled}
        onChange={handleChange}
        disabled={loading}
      />
      <label htmlFor="certificateEnabled" className="text-sm">
        Курсты аяқтағаннан кейін сертификат беру
      </label>
    </div>
  );
};
