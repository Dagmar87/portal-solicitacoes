import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import requestService from '../services/request.service';

const STATUS_LABELS = {
  ABERTO: 'Aberto',
  EM_ATENDIMENTO: 'Em atendimento',
  CONCLUIDO: 'Concluído',
};

const CATEGORY_LABELS = {
  TI: 'TI',
  RH: 'RH',
  COMPRAS: 'Compras',
  FINANCEIRO: 'Financeiro',
  INFRAESTRUTURA: 'Infraestrutura',
};

function formatDate(date) {
  if (!date) {
    return '-';
  }

  return new Date(date).toLocaleString('pt-BR');
}

function getStatusClass(status) {
  switch (status) {
    case 'ABERTO':
      return 'status-badge status-aberto';

    case 'EM_ATENDIMENTO':
      return 'status-badge status-em-atendimento';

    case 'CONCLUIDO':
      return 'status-badge status-concluido';

    default:
      return 'status-badge';
  }
}

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changingStatus, setChangingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function loadRequest() {
    try {
      setLoading(true);
      setError('');

      const response = await requestService.getById(id);

      setRequest(response);
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        'Não foi possível carregar a solicitação.';

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequest();
  }, [id]);

  async function handleStatusChange(event) {
    const newStatus = event.target.value;

    if (!newStatus || newStatus === request.status) {
      return;
    }

    const confirmed = window.confirm(
      `Deseja alterar o status para "${STATUS_LABELS[newStatus]}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setChangingStatus(true);
      setError('');

      const response = await requestService.updateStatus(id, newStatus);

      /*
       * O backend pode retornar a solicitação atualizada
       * ou apenas uma mensagem.
       *
       * Por isso recarregamos os dados após a alteração.
       */
      if (response) {
        await loadRequest();
      }
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        'Não foi possível alterar o status da solicitação.';

      setError(message);
    } finally {
      setChangingStatus(false);
    }
  }

  async function handleDelete() {
    if (!request) {
      return;
    }

    if (request.status !== 'ABERTO') {
      setError('Apenas solicitações com status ABERTO podem ser excluídas.');

      return;
    }

    const confirmed = window.confirm(
      'Tem certeza que deseja excluir esta solicitação? Esta ação não pode ser desfeita.',
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError('');

      await requestService.remove(id);

      alert('Solicitação excluída com sucesso.');

      navigate('/requests');
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        'Não foi possível excluir a solicitação.';

      setError(message);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Carregando solicitação...</div>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>Detalhes da solicitação</h1>
          </div>

          <Link to="/requests" className="btn btn-secondary">
            Voltar
          </Link>
        </div>

        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="page-container">
        <div className="alert alert-error">Solicitação não encontrada.</div>

        <Link to="/requests" className="btn btn-secondary">
          Voltar para solicitações
        </Link>
      </div>
    );
  }

  const canEdit = request.status === 'ABERTO';
  const canDelete = request.status === 'ABERTO';

  return (
    <div className="page-container">
      {/* Cabeçalho */}
      <div className="page-header">
        <div>
          <h1>Detalhes da solicitação</h1>

          <p className="page-subtitle">Solicitação #{request.id}</p>
        </div>

        <div className="page-header-actions">
          <Link to="/requests" className="btn btn-secondary">
            Voltar
          </Link>

          {canEdit && (
            <Link
              to={`/requests/${request.id}/edit`}
              className="btn btn-primary"
            >
              Editar
            </Link>
          )}
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Informações principais */}
      <div className="details-card">
        <div className="details-card-header">
          <div>
            <h2>{request.title}</h2>

            <span className={getStatusClass(request.status)}>
              {STATUS_LABELS[request.status] || request.status}
            </span>
          </div>
        </div>

        <div className="details-grid">
          {/* ID */}
          <div className="detail-item">
            <span className="detail-label">ID</span>

            <span className="detail-value">#{request.id}</span>
          </div>

          {/* Categoria */}
          <div className="detail-item">
            <span className="detail-label">Categoria</span>

            <span className="detail-value">
              {CATEGORY_LABELS[request.category] || request.category}
            </span>
          </div>

          {/* Usuário */}
          <div className="detail-item">
            <span className="detail-label">Solicitante</span>

            <span className="detail-value">
              {request.username || request.user_id || '-'}
            </span>
          </div>

          {/* Criado em */}
          <div className="detail-item">
            <span className="detail-label">Criado em</span>

            <span className="detail-value">
              {formatDate(request.created_at)}
            </span>
          </div>

          {/* Atualizado em */}
          <div className="detail-item">
            <span className="detail-label">Última atualização</span>

            <span className="detail-value">
              {formatDate(request.updated_at)}
            </span>
          </div>
        </div>

        {/* Descrição */}
        <div className="description-section">
          <h3>Descrição</h3>

          <div className="description-content">{request.description}</div>
        </div>
      </div>

      {/* Status */}
      <div className="details-card">
        <div className="section-header">
          <div>
            <h2>Status</h2>

            <p>Atualize o andamento da solicitação.</p>
          </div>
        </div>

        <div className="status-control">
          <label htmlFor="status">Status atual</label>

          <select
            id="status"
            value={request.status}
            onChange={handleStatusChange}
            disabled={changingStatus}
          >
            <option value="ABERTO">Aberto</option>

            <option value="EM_ATENDIMENTO">Em atendimento</option>

            <option value="CONCLUIDO">Concluído</option>
          </select>

          {changingStatus && (
            <span className="loading-small">Atualizando...</span>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="details-card actions-card">
        <h2>Ações</h2>

        <div className="actions">
          {canEdit && (
            <Link
              to={`/requests/${request.id}/edit`}
              className="btn btn-primary"
            >
              Editar solicitação
            </Link>
          )}

          {canDelete && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Excluindo...' : 'Excluir solicitação'}
            </button>
          )}

          {!canEdit && (
            <div className="info-message">
              Esta solicitação não pode mais ser editada ou excluída porque seu
              status não é<strong> ABERTO</strong>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
