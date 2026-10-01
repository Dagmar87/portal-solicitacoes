import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import RequestTable from '../components/RequestTable';

import requestService from '../services/request.service';

const INITIAL_FILTERS = {
  title: '',
  category: '',
  status: '',
  startDate: '',
  endDate: '',
};

export default function Requests() {
  const [requests, setRequests] = useState([]);

  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  async function loadRequests() {
    try {
      setLoading(true);
      setError('');

      const params = {};

      if (filters.title.trim()) {
        params.title = filters.title.trim();
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

      const data = await requestService.getAll(params);

      setRequests(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          'Não foi possível carregar as solicitações.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    loadRequests();
  }

  function clearFilters() {
    setFilters(INITIAL_FILTERS);

    setTimeout(() => {
      loadRequests();
    }, 0);
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <h1>Solicitações</h1>

          <p className="page-subtitle">
            Consulte e acompanhe as solicitações internas.
          </p>
        </div>

        <Link to="/requests/new" className="btn btn-primary">
          Nova solicitação
        </Link>
      </div>

      <section className="filters-card">
        <form className="filters" onSubmit={handleSubmit}>
          <div className="filter-group">
            <label htmlFor="title">Título</label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="Pesquisar título"
              value={filters.title}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="category">Categoria</label>

            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">Todas</option>

              <option value="TI">TI</option>

              <option value="RH">RH</option>

              <option value="COMPRAS">Compras</option>

              <option value="FINANCEIRO">Financeiro</option>

              <option value="INFRAESTRUTURA">Infraestrutura</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status">Status</label>

            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>

              <option value="ABERTO">Aberto</option>

              <option value="EM_ATENDIMENTO">Em atendimento</option>

              <option value="CONCLUIDO">Concluído</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="startDate">Data inicial</label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="endDate">Data final</label>

            <input
              id="endDate"
              name="endDate"
              type="date"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Consultando...' : 'Filtrar'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearFilters}
            >
              Limpar
            </button>
          </div>
        </form>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Carregando solicitações...</div>
      ) : (
        <RequestTable requests={requests} />
      )}
    </main>
  );
}
