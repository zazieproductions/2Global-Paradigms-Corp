import type { DocumentRecord } from '@/types';
import { AUTHORED_DOCUMENTS } from './authored-documents';
import { GENERATED_DOCUMENTS } from './generated-records';
import { ORDER_DOCUMENTS } from './order-documents';

/**
 * Every document in the Master Document Vault: authored records first, then
 * the generated catalogue, then the Ordo Vocis Profundae evidence trail used
 * by THE SEVEN SEALS.
 */
export const DOCUMENTS: DocumentRecord[] = [
  ...AUTHORED_DOCUMENTS,
  ...GENERATED_DOCUMENTS,
  ...ORDER_DOCUMENTS
];
