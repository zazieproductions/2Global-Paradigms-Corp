import {
  FileAudio,
  FileLock2,
  FileText,
  FileWarning,
  Globe,
  Mail,
  Users,
  MapPin,
  Folder
} from 'lucide-react';
import type { RecordFormat, RecordKind } from '@/types';
import { cn } from '@/lib/utils/cn';

const BY_KIND: Partial<Record<RecordKind, typeof FileText>> = {
  audio: FileAudio,
  email: Mail,
  personnel: Users,
  office: MapPin,
  'dead-link': Globe,
  project: FileLock2,
  department: Folder,
  product: FileWarning
};

/** Icon for an archive record, chosen by kind (falls back to a document). */
export function FileIcon({
  kind,
  format,
  className
}: {
  kind: RecordKind;
  format?: RecordFormat;
  className?: string;
}) {
  const Icon = BY_KIND[kind] ?? (format === 'web-capture' ? Globe : FileText);
  return <Icon className={cn('w-4 h-4 shrink-0', className)} aria-hidden />;
}
