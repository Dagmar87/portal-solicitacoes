import api from './api';

const requestService = {
  async getAll(params = {}) {
    const response = await api.get('/requests', {
      params,
    });

    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/requests/${id}`);

    return response.data;
  },

  async create(data) {
    const response = await api.post('/requests', data);

    return response.data;
  },

  async update(id, data) {
    const response = await api.put(
      `/requests/${id}`,
      data
    );

    return response.data;
  },

  async remove(id) {
    const response = await api.delete(
      `/requests/${id}`
    );

    return response.data;
  },

  async updateStatus(id, status) {
    const response = await api.patch(
      `/requests/${id}/status`,
      {
        status,
      }
    );

    return response.data;
  },
};

export default requestService;