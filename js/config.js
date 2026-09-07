// Nexus LMS Central API Configuration
(function() {
  const DEFAULT_LIVE_URL = 'https://we-two-lilac.vercel.app';

  window.getApiBaseUrl = function() {
    return localStorage.getItem('NEXUS_API_URL') || DEFAULT_LIVE_URL;
  };

  window.setApiBaseUrl = function(url) {
    if (!url || url.trim() === '') {
      localStorage.removeItem('NEXUS_API_URL');
    } else {
      let cleanUrl = url.trim().replace(/\/$/, '');
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }
      localStorage.setItem('NEXUS_API_URL', cleanUrl);
    }
  };

  window.getApiUrl = function(endpoint) {
    const baseUrl = window.getApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    return `${baseUrl}${cleanEndpoint}`;
  };
})();
