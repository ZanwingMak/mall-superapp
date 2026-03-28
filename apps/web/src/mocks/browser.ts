import { setupWorker } from 'msw/browser';
import { handlers } from '@mall/mock';

export const worker = setupWorker(...handlers);
