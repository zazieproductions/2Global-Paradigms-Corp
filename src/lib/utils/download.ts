/**
 * Trigger a client-side file download from in-memory content.
 * Nothing is uploaded; the Blob URL is revoked after the click.
 */
export function downloadFile(filename: string, content: string, mime = 'text/plain;charset=utf-8'): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke on the next tick so Safari has time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export const downloadJson = (filename: string, data: unknown): void =>
  downloadFile(filename, JSON.stringify(data, null, 2), 'application/json');

/**
 * Archive records advertise in-world filenames such as `…_Declassified.pdf`,
 * but exports are plain text. Swap the extension so saved files open cleanly.
 */
export function toTextFilename(name: string): string {
  const base = name.replace(/\.[a-z0-9]{2,4}$/i, '');
  return `${base}.txt`;
}
