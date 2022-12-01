const environment = process.env.NODE_ENV || 'development';
const MICRO_SERVICES = {
  AUTH: {
    NAME: 'AUTH_SERVICE',
    HOST: environment === 'development' ? 'localhost' : 'localhost', // todo: 배포시에는 서버의 IP로 변경
    PORT: 3001,
  },
  CORE: {
    NAME: 'CORE_SERVICE',
    HOST: environment === 'development' ? 'localhost' : 'localhost',
    PORT: 3002,
  },
  TICKET: {
    NAME: 'TICKET_SERVICE',
    HOST: environment === 'development' ? 'localhost' : 'localhost',
    PORT: 3003,
  },
};

export { MICRO_SERVICES };
