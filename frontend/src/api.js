import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const alunosApi = {
  list: (turmaId) => api.get('/alunos', { params: turmaId ? { turmaId } : {} }).then((r) => r.data),
  create: (data) => api.post('/alunos', data).then((r) => r.data),
  update: (id, data) => api.put(`/alunos/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/alunos/${id}`),
};

export const turmasApi = {
  list: () => api.get('/turmas').then((r) => r.data),
  create: (data) => api.post('/turmas', data).then((r) => r.data),
  update: (id, data) => api.put(`/turmas/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/turmas/${id}`),
};

export const disciplinasApi = {
  list: () => api.get('/disciplinas').then((r) => r.data),
  create: (data) => api.post('/disciplinas', data).then((r) => r.data),
  update: (id, data) => api.put(`/disciplinas/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/disciplinas/${id}`),
};

export const avaliacoesApi = {
  list: (params) => api.get('/avaliacoes', { params }).then((r) => r.data),
  create: (data) => api.post('/avaliacoes', data).then((r) => r.data),
  update: (id, data) => api.put(`/avaliacoes/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/avaliacoes/${id}`),
};

export const notasApi = {
  list: (params) => api.get('/notas', { params }).then((r) => r.data),
  saveLote: (data) => api.post('/notas/lote', data).then((r) => r.data),
};

export const configuracaoApi = {
  get: () => api.get('/configuracao').then((r) => r.data),
  update: (data) => api.put('/configuracao', data).then((r) => r.data),
};

export const mediasApi = {
  list: (params) => api.get('/medias', { params }).then((r) => r.data),
};

export default api;
