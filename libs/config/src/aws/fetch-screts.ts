import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { Logger } from '@nestjs/common';

export const fetchSecrets = async (secretName: string) => {
  const logger = new Logger(fetchSecrets.name);
  const secret = secretName === 'dev' ? 'develop' : secretName;

  const client = new SecretsManagerClient({
    region: 'us-east-1',
  });

  try {
    logger.debug(`Getting secret: ${secret}`);
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret,
      }),
    );
    return JSON.parse(response.SecretString);
  } catch (error) {
    logger.error('Error fetching aws secrets', error.message);
    return {};
  }
};
