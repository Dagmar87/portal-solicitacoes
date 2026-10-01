import { useEffect, useState } from 'react';

const CATEGORIES = [
  {
    value: 'TI',
    label: 'TI',
  },
  {
    value: 'RH',
    label: 'RH',
  },
  {
    value: 'COMPRAS',
    label: 'Compras',
  },
  {
    value: 'FINANCEIRO',
    label: 'Financeiro',
  },
  {
    value: 'INFRAESTRUTURA',
    label: 'Infraestrutura',
  },
];

const INITIAL_FORM = {
  title: '',
  description: '',
  category: '',
};

export default function RequestForm({
  initialData = null,
  onSubmit,
  loading = false,
  submitLabel = 'Salvar solicitação',
}) {
  const [form, setForm] = useState(INITIAL_FORM);

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || '',
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [initialData]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');

    if (!form.title.trim()) {
      setError('Informe o título da solicitação.');

      return;
    }

    if (!form.description.trim()) {
      setError('Informe a descrição da solicitação.');

      return;
    }

    if (!form.category) {
      setError('Selecione uma categoria.');

      return;
    }

    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
      });
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || 'Não foi possível salvar a solicitação.',
      );
    }
  }

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Título</label>

        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          maxLength={150}
          placeholder="Ex.: Computador não liga"
          disabled={loading}
          required
        />

        <small>{form.title.length}/150 caracteres</small>
      </div>

      <div className="form-group">
        <label htmlFor="category">Categoria</label>

        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          disabled={loading}
          required
        >
          <option value="">Selecione uma categoria</option>

          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição</label>

        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={8}
          placeholder="Descreva detalhadamente a solicitação..."
          disabled={loading}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
