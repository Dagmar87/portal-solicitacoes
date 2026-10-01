import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import RequestForm from '../components/RequestForm';

import requestService from '../services/request.service';

export default function RequestFormPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const [request, setRequest] = useState(null);

  const [loading, setLoading] = useState(isEditing);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    async function loadRequest() {
      try {
        setLoading(true);
        setError('');

        const data = await requestService.getById(id);

        if (data.status !== 'ABERTO') {
          setError('Apenas solicitações com status ABERTO podem ser editadas.');

          return;
        }

        setRequest(data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            'Não foi possível carregar a solicitação.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadRequest();
  }, [id, isEditing]);

  async function handleSubmit(data) {
    setSaving(true);
    setError('');

    try {
      if (isEditing) {
        await requestService.update(id, data);

        navigate(`/requests/${id}`);
      } else {
        const created = await requestService.create(data);

        navigate(`/requests/${created.id}`);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || 'Não foi possível salvar a solicitação.',
      );

      throw err;
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="page-container">
        <div className="loading">Carregando solicitação...</div>
      </main>
    );
  }

  if (isEditing && error && !request) {
    return (
      <main className="page-container">
        <div className="page-header">
          <div>
            <h1>Editar solicitação</h1>
          </div>

          <Link to="/requests" className="btn btn-secondary">
            Voltar
          </Link>
        </div>

        <div className="alert alert-error">{error}</div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <h1>{isEditing ? 'Editar solicitação' : 'Nova solicitação'}</h1>

          <p className="page-subtitle">
            {isEditing
              ? `Editando a solicitação #${id}`
              : 'Preencha os dados da nova solicitação.'}
          </p>
        </div>

        <Link
          to={isEditing ? `/requests/${id}` : '/requests'}
          className="btn btn-secondary"
        >
          Cancelar
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="details-card">
        <RequestForm
          initialData={request}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel={isEditing ? 'Salvar alterações' : 'Criar solicitação'}
        />
      </section>
    </main>
  );
}
