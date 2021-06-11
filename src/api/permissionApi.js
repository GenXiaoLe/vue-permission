import axiosService from '@/plugins/axios';

export function pageAuth (data) {
  return axiosService({
    url: '/pmn/user-auth',
    method: 'get',
    data
  });
}