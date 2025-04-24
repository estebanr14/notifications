import { fetchSecrets } from './fetch-screts';

export default async () => {
  try {
    const secretName = process.env.NODE_ENV;
    const secrets = await fetchSecrets(secretName);
    return secrets;
  } catch {
    return {};
  }
};
