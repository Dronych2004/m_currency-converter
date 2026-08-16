import { memo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const AmountInput = memo(function AmountInput({ value, onChange }: AmountInputProps) {
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  return (
    <div>
      <label
        htmlFor="amount-input"
        className="block text-sm font-semibold mb-3 tracking-wide uppercase"
        style={{ color: 'var(--text-secondary)' }}
      >
        {t('amount')}
      </label>

      <div className="relative group">
        <input
          id="amount-input"
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          placeholder="0.00"
          className="input-glass"
        />

        <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
          }}
        />
      </div>
    </div>
  );
});
