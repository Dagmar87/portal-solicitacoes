import api from './api';

const requestService = {
  async getAll(params = {}) {
    const response = await api.get('/requests', {
      params,
    });

    return response.data.data;
  },

  async getById(id) {
    const response = await api.get(`/requests/${id}`);

    return response.data.data;
  },

  async create(data) {
    const response = await api.post('/requests', data);

    return response.data.data;
  },

  async update(id, data) {
    const response = await api.put(`/requests/${id}`, data);

    return response.data.data;
  },

  async remove(id) {
    await api.delete(`/requests/${id}`);
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/requests/${id}/status`, {
      status,
    });

    return response.data.data;
  },
};

export default requestService;
