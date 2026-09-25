import React, { useState } from 'react';
import { Key, X, Lock, Unlock, ShieldAlert, CheckCircle2, Download } from 'lucide-react';
import { ClearanceLevel } from '../types';
import { gpcAudio } from '../lib/audioEngine';

interface SecretBypassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetClearance: (level: ClearanceLevel) => void;
  onEnableUnredacted: () => void;
}

export const SecretBypassModal: React.FC<SecretBypassModalProps> = ({
  isOpen,
  onClose,
  onSetClearance,
  onEnableUnredacted
}) => {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      gpcAudio.playUiSound('keystroke');
      const newPin = pin + digit;
      setPin(newPin);
      setErrorMsg('');

      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleClear = () => {
    gpcAudio.playUiSound('click');
    setPin('');
    setErrorMsg('');
  };

  const verifyPin = (code: string) => {
    // Accepted lore passcodes:
    // 1480 (14.8Hz planetary carrier)
    // 1989 (Station 07 breach / Arthur Vance-Vane disavowal)
    // 0432 (432Hz Solfeggio carrier)
    // 3120 (312Hz Spitsbergen overtone)
    if (code === '1480' || code === '1989' || code === '0432' || code === '3120') {
      gpcAudio.playUiSound('grant');
      setIsUnlocked(true);
      onSetClearance('Level 5 - Black Dossier');
      onEnableUnredacted();
    } else {
      gpcAudio.playUiSound('deny');
      setErrorMsg('CRYPTOGRAPHIC AUTHENTICATION FAILED. ACCESS LOGGED.');
      setPin('');
    }
  };

  const handleDownloadDump = () => {
    gpcAudio.playUiSound('print');
    const dump = {
      archive: 'PROJECT PALIMPSEST UNREDACTED LEAK PACKAGE',
      exfiltrator: 'Dr. Aris Thorne (Senior Fellow, PEFD)',
      dateExfiltrated: '2019-11-04 03:14:22 UTC',
      hashRoot: 'SHA256: 0x98AE44F12C0982BA349881FE',
      summary: 'The 14.8Hz planetary baseline is an active non-biological broadcast. GPC has constructed 22 regional arrays to phase-lock surface electrical grids to this harmonic carrier.',
      keyCoordinates: [
        { station: 'Station 07 (Svalbard)', coords: '78.2232° N, 15.6267° E', depth: '-820m' },
        { station: 'Site 19 (Utah)', coords: '41.1158° N, 112.8711° W', depth: '-600m' },
        { station: 'Diego Garcia Hydrophone 12', coords: '7.3195° S, 72.4229° E', depth: '-5400m' }
      ],
      disavowedPersonnel: ['Dr. Arthur Vance-Vane (1989)', 'Julian Thorne (2019)', 'David Vance-Wren (2024)']
    };

    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Palimpsest_Whistleblower_Master_Dump.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 select-none font-mono text-xs">
      <div className="bg-[#0b0f19] border border-amber-500/50 rounded-lg max-w-md w-full p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col text-slate-200">
        <div className="flex items-center justify-between border-b border-[#222e44] pb-3 mb-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Key className="w-4 h-4" />
            <span>PALIMPSEST CRYPTOGRAPHIC SAFE</span>
          </div>
          <button
            onClick={() => {
              gpcAudio.playUiSound('click');
              onClose();
            }}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isUnlocked ? (
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-amber-950/20 border border-amber-500/40 rounded text-[11px] text-amber-200 text-center leading-relaxed">
              <span className="font-bold block mb-1">RESTRICTED BACKDOOR ENCLAVE</span>
              Enter Dr. Aris Thorne's 4-digit authorization sequence to decrypt all Level 5 Black Dossiers and disable corporate redaction masks.
            </div>

            {/* PIN Display */}
            <div className="flex items-center justify-center gap-3 py-3">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-10 h-12 rounded border flex items-center justify-center text-lg font-bold font-mono transition-all ${
                    pin[idx]
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                      : 'bg-[#080c14] border-slate-700 text-slate-600'
                  }`}
                >
                  {pin[idx] || '•'}
                </div>
              ))}
            </div>

            {errorMsg && (
              <div className="text-[10px] text-rose-400 font-bold flex items-center gap-1.5 animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 w-full max-w-[240px]">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'ENTER'].map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'CLR') handleClear();
                    else if (key === 'ENTER') verifyPin(pin);
                    else handleDigit(key);
                  }}
                  className="py-2.5 rounded bg-[#111724] hover:bg-[#192336] border border-[#202b3d] hover:border-amber-500/50 text-slate-200 font-bold text-sm cursor-pointer transition-colors"
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="mt-2 text-[10px] text-slate-500 text-center leading-tight">
              <span className="font-bold text-slate-400">ARG LORE HINT:</span> The planetary carrier frequency (14.8Hz = <span className="text-amber-400 font-bold">1480</span>), founding breach year (<span className="text-amber-400 font-bold">1989</span>), or Solfeggio carrier (<span className="text-amber-400 font-bold">0432</span>).
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-center">
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/50 rounded flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
              <h3 className="text-sm font-bold text-emerald-300">CRYPTOGRAPHIC BYPASS SUCCESSFUL</h3>
              <p className="text-[11px] text-slate-300">
                You have authenticated as <span className="text-white font-bold">PALIMPSEST_OBSERVER</span>. Clearance elevated to <span className="text-rose-400 font-bold">LEVEL 5 - BLACK DOSSIER</span>. All 165 documents are now permanently de-scrambled.
              </p>
            </div>

            <button
              onClick={handleDownloadDump}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded cursor-pointer transition-colors shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD WHISTLEBLOWER DATA DUMP (.JSON)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
