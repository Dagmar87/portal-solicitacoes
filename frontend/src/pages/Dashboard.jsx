import { useEffect, useState } from 'react';

import api from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const response = await api.get('/dashboard');

    setData(response.data.data);
  }

  if (!data) {
    return <p>Carregando...</p>;
  }

  return (
    <main className="container">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <div className="card">
          <h2>Total</h2>
          <strong>{data.total}</strong>
        </div>

        <div className="card">
          <h2>Abertas</h2>
          <strong>{data.abertas}</strong>
        </div>

        <div className="card">
          <h2>Em atendimento</h2>
          <strong>{data.em_atendimento}</strong>
        </div>

        <div className="card">
          <h2>Concluídas</h2>
          <strong>{data.concluidas}</strong>
        </div>
      </div>
    </main>
  );
}
