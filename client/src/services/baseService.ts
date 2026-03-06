export const getAPIBase = (): string => {
  const isTunnel = window.location.hostname.includes("monday.app");
  return isTunnel
    ? window.location.origin
    : process.env.REACT_APP_API_BASE_URL || '';
};

export default getAPIBase;