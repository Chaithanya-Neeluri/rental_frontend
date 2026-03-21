import { axiosClient } from './axiosClient.js';

// API service layer placeholders to keep components clean
export const AuthApi = {
  loginTenant: (payload) => axiosClient.post('/auth/tenant/login', payload),
  loginOwner: (payload) => axiosClient.post('/auth/owner/login', payload),
  registerTenant: (payload) => axiosClient.post('/auth/tenant/register', payload),
  registerOwner: (payload) => axiosClient.post('/auth/owner/register', payload),
};

export const UserApi = {
  getMe: () => axiosClient.get('/users/me'),
  updateProfile: (payload) => axiosClient.put('/users/update-profile', payload),
  updateLocation: (payload) => axiosClient.put('/users/location', payload),
};

export const PropertyApi = {
  listForOwner: (ownerId) => axiosClient.get(`/properties/owner/${ownerId}`),
  getTenantDetails: (propertyId) => axiosClient.get(`/properties/${propertyId}/details`),
  create: (formData) =>
    axiosClient.post('/properties/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (propertyId, formData) =>
    axiosClient.put(`/properties/${propertyId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const SearchApi = {
  search: (q) => axiosClient.get('/search', { params: { q } }),
  recommendations: (userId) => axiosClient.get(`/search/recommendations/${userId}`),
};

export const AdminApi = {
  getPendingProperties: () =>
    axiosClient.get('/admin/properties', {
      headers: {
        'x-admin-key': localStorage.getItem('adminKey') || '',
      },
    }),
  approveProperty: (id) =>
    axiosClient.patch(`/admin/approve/${id}`, null, {
      headers: {
        'x-admin-key': localStorage.getItem('adminKey') || '',
      },
    }),
  rejectProperty: (id) =>
    axiosClient.delete(`/admin/reject/${id}`, {
      headers: {
        'x-admin-key': localStorage.getItem('adminKey') || '',
      },
    }),
};

export const EnquiryApi = {
  create: ({ propertyId, message }) => axiosClient.post('/enquiries', { propertyId, message }),
  listForOwner: (params = {}) => axiosClient.get('/enquiries/owner', { params }),
  markRead: (enquiryId) => axiosClient.patch(`/enquiries/${enquiryId}/read`),
};

