import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import api from '../services/api';

export default function Requests() {
  const [requests, setRequests] = useState([]);

  const [filters, setFilters] = useState({
    title: '',
    category: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  async function loadRequests() {
    const params = {};

    if (filters.title) {
      params.title = filters.title;
    }

    if (filters.category) {
      params.category = filters.category;
    }

    if (filters.status) {
      params.status = filters.status;
    }

    if (filters.startDate) {
      params.startDate = filters.startDate;
    }

    if (filters.endDate) {
      params.endDate = filters.endDate;
    }

    const response = await api.get('/requests', { params });

    setRequests(response.data.data);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <main className="container">
      <div className="page-header">
        <h1>Solicitações</h1>

        <Link to="/requests/new" className="button">
          Nova solicitação
        </Link>
      </div>

      <section className="filters">
        <input
          placeholder="Pesquisar título"
          value={filters.title}
          onChange={(e) =>
            setFilters({
              ...filters,
              title: e.target.value,
            })
          }
        />

        <select
          value={filters.category}
          onChange={(e) =>
            setFilters({
              ...filters,
              category: e.target.value,
            })
          }
        >
          <option value="">Todas as categorias</option>

          <option value="TI">TI</option>

          <option value="RH">RH</option>

          <option value="COMPRAS">Compras</option>

          <option value="FINANCEIRO">Financeiro</option>

          <option value="INFRAESTRUTURA">Infraestrutura</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value,
            })
          }
        >
          <option value="">Todos os status</option>

          <option value="ABERTO">Aberto</option>

          <option value="EM_ATENDIMENTO">Em atendimento</option>

          <option value="CONCLUIDO">Concluído</option>
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({
              ...filters,
              startDate: e.target.value,
            })
          }
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({
              ...filters,
              endDate: e.target.value,
            })
          }
        />

        <button onClick={loadRequests}>Filtrar</button>
      </section>

      <section className="table-wrapper">
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

                <td>{request.title}</td>

                <td>{request.category}</td>

                <td>{request.requester}</td>

                <td>
                  {new Date(request.created_at).toLocaleDateString('pt-BR')}
                </td>

                <td>{request.status}</td>

                <td>
                  <Link to={`/requests/${request.id}`}>Detalhes</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
