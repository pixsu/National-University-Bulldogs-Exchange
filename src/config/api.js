const baseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

export const API_BASE_URL = baseUrl;

export const toApiUrl = (path = '') => {
  if (!path) {
    return API_BASE_URL;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const toAssetUrl = (assetPath = '') => {
  if (!assetPath) {
    return '';
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  return `${API_BASE_URL}${assetPath.startsWith('/') ? assetPath : `/${assetPath}`}`;
};