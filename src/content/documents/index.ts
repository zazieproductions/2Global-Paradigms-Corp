import type { DocumentRecord } from '@/types';
import { AUTHORED_DOCUMENTS } from './authored-documents';
import { GENERATED_DOCUMENTS } from './generated-records';

/** Every document in the Master Document Vault, authored records first. */
export const DOCUMENTS: DocumentRecord[] = [...AUTHORED_DOCUMENTS, ...GENERATED_DOCUMENTS];
