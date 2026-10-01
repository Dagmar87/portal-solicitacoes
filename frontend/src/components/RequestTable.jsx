import { Link } from 'react-router-dom';

import StatusBadge from './StatusBadge';

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

  return new Date(date).toLocaleDateString('pt-BR');
}

export default function RequestTable({ requests }) {
  if (!requests.length) {
    return (
      <div className="empty-state">
        <h3>Nenhuma solicitação encontrada</h3>

        <p>
          Não existem solicitações para os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Título</th>
            <th>Categoria</th>
            <th>Solicitante</th>
            <th>Data</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>#{request.id}</td>

              <td>
                <strong>{request.title}</strong>
              </td>

              <td>
                {CATEGORY_LABELS[request.category] ||
                  request.category}
              </td>

              <td>
                {request.username ||
                  request.requester ||
                  request.user_id ||
                  '-'}
              </td>

              <td>{formatDate(request.created_at)}</td>

              <td>
                <StatusBadge status={request.status} />
              </td>

              <td>
                <Link
                  to={`/requests/${request.id}`}
                  className="table-action"
                >
                  Detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}