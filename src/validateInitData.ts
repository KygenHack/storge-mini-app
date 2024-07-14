import { validate } from '@telegram-apps/init-data-node';

const secretToken = process.env.REACT_APP_SECRET_TOKEN;

const devInitData =
  'query_id=AAHdF6IQAAAAAN0XohDhrOrc' +
  '&user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D' +
  '&auth_date=1662771648' +
  '&hash=c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2';

export const validateTelegramInitData = (initData: string): boolean => {
  try {
    if (!secretToken) throw new Error('Secret token is not defined');
    validate(initData, secretToken);
    console.log('Validation successful');
    return true;
  } catch (error) {
    console.error('Validation failed:', error);
    return false;
  }
};
