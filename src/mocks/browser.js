// Setup do MSW para ambiente de desenvolvimento
import { setupWorker } from 'msw/browser';
import { handlers as authHandlers } from './authHandlers';

export const worker = setupWorker(
  ...authHandlers
);
