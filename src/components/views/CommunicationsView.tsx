import React, { useState } from 'react';
import {
  Mail,
  Users,
  Paperclip,
  Calendar,
  FileText,
  Shield,
  Clock,
  Send,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { EmailThread, MeetingRecord, PressRelease } from '../../types';
import { gpcAudio } from '../../lib/audioEngine';

interface CommunicationsViewProps {
  emails: EmailThread[];
  meetings: MeetingRecord[];
  pressReleases: PressRelease[];
  isUnredacted: boolean;
}

export const CommunicationsView: React.FC<CommunicationsViewProps> = ({
  emails,
  meetings,
  pressReleases,
  isUnredacted
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'emails' | 'meetings' | 'press'>('emails');
  const [selectedEmail, setSelectedEmail] = useState<EmailThread | null>(emails[0]);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(meetings[0]);
  const [selectedPress, setSelectedPress] = useState<PressRelease | null>(pressReleases[0]);

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              COMMUNICATIONS ARCHIVE // EMAILS & BOARD MINUTES
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            14 Leaked Email Chains + 10 Emergency Executive Containment Sessions
          </p>
        </div>

        {/* Sub-Tab Selector */}
        <div className="flex items-center gap-1 bg-[#0d131f] border border-[#1f2c42] rounded p-0.5 text-xs">
          <button
            onClick={() => {
              gpcAudio.playUiSound('click');
              setActiveSubTab('emails');
            }}
            className={`px-3 py-1.5 rounded transition-all font-bold cursor-pointer ${
              activeSubTab === 'emails'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            INTERCEPTED EMAILS ({emails.length})
          </button>
          <button
            onClick={() => {
              gpcAudio.playUiSound('click');
              setActiveSubTab('meetings');
            }}
            className={`px-3 py-1.5 rounded transition-all font-bold cursor-pointer ${
              activeSubTab === 'meetings'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            BOARD MINUTES ({meetings.length})
          </button>
          <button
            onClick={() => {
              gpcAudio.playUiSound('click');
              setActiveSubTab('press');
            }}
            className={`px-3 py-1.5 rounded transition-all font-bold cursor-pointer ${
              activeSubTab === 'press'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            PRESS RELEASES ({pressReleases.length})
          </button>
        </div>
      </div>

      {/* Main Split Interface */}
      {activeSubTab === 'emails' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: Email Thread List */}
          <div className="space-y-2">
            <div className="p-2.5 bg-[#0a0e18] border border-[#1b263b] rounded-lg font-bold text-xs text-white">
              EMAIL THREADS ({emails.length})
            </div>
            <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
              {emails.map((thread) => {
                const isSelected = selectedEmail?.id === thread.id;
                return (
                  <div
                    key={thread.id}
                    onClick={() => {
                      gpcAudio.playUiSound('click');
                      setSelectedEmail(thread);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all space-y-1 ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                        : 'bg-[#0a0e18] hover:bg-[#0e1524] border-[#1b263b] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300 text-[10px]">{thread.threadCode}</span>
                      <span className="text-[9px] text-slate-500">{thread.date.split(' ')[0]}</span>
                    </div>
                    <h3 className="font-bold text-xs text-slate-200 truncate">{thread.subject}</h3>
                    <p className="text-[10px] text-slate-500 truncate">
                      {thread.participants.map((p) => p.name.split(' ')[0]).join(', ')} ({thread.messages.length} msgs)
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 2 Cols: Selected Email Thread Viewer */}
          <div className="lg:col-span-2 space-y-4">
            {selectedEmail && (
              <div className="bg-[#0a0e18] border border-blue-500/40 rounded-lg shadow-xl overflow-hidden flex flex-col">
                {/* Thread Top Bar */}
                <div className="p-4 bg-[#0e1422] border-b border-[#1c273c] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold text-xs">{selectedEmail.threadCode}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-bold">
                      {selectedEmail.classification.split(' - ')[0]}
                    </span>
                  </div>
                  <h2 className="text-sm md:text-base font-bold text-white">{selectedEmail.subject}</h2>
                  <div className="text-[10px] text-slate-400 flex flex-wrap gap-2 pt-1 border-t border-slate-800">
                    <span className="font-bold text-slate-500">PARTICIPANTS:</span>
                    {selectedEmail.participants.map((p, idx) => (
                      <span key={idx} className="text-slate-300">
                        {p.name} ({p.role})
                        {idx < selectedEmail.participants.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="p-4 md:p-6 space-y-4 overflow-y-auto max-h-[550px] scrollbar-thin">
                  {selectedEmail.messages.map((msg, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-4 rounded-lg bg-[#070b13] border border-[#182335] space-y-2 shadow-md"
                    >
                      <div className="flex items-center justify-between border-b border-[#141b2a] pb-2 text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-cyan-300">{msg.senderName}</span>
                          <span className="text-slate-500">&lt;{msg.senderEmail}&gt;</span>
                        </div>
                        <span className="text-slate-500 font-mono">{msg.timestamp}</span>
                      </div>

                      <p className="text-[11px] text-slate-300 whitespace-pre-line leading-relaxed font-mono">
                        {msg.body}
                      </p>

                      {msg.hasAttachment && (
                        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2 text-[10px] text-amber-300 bg-amber-950/20 p-2 rounded border border-amber-500/30">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>ATTACHMENT: {msg.attachmentName}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeSubTab === 'meetings' ? (
        /* Meetings Minutes View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: Meeting List */}
          <div className="space-y-2">
            <div className="p-2.5 bg-[#0a0e18] border border-[#1b263b] rounded-lg font-bold text-xs text-white">
              EXECUTIVE MINUTES ({meetings.length})
            </div>
            <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
              {meetings.map((meet) => {
                const isSelected = selectedMeeting?.id === meet.id;
                return (
                  <div
                    key={meet.id}
                    onClick={() => {
                      gpcAudio.playUiSound('click');
                      setSelectedMeeting(meet);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all space-y-1 ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                        : 'bg-[#0a0e18] hover:bg-[#0e1524] border-[#1b263b] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300 text-[10px]">{meet.meetingCode}</span>
                      <span className="text-[9px] text-slate-500">{meet.date.split(' ')[0]}</span>
                    </div>
                    <h3 className="font-bold text-xs text-slate-200 truncate">{meet.title}</h3>
                    <p className="text-[10px] text-slate-500 truncate">{meet.location}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 2 Cols: Meeting Record Details */}
          <div className="lg:col-span-2 space-y-4">
            {selectedMeeting && (
              <div className="p-5 bg-[#0a0e18] border border-[#1b263b] rounded-lg shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c273c] pb-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-cyan-400 text-sm font-mono">{selectedMeeting.meetingCode}</span>
                    <h2 className="text-base font-bold text-white">{selectedMeeting.title}</h2>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-bold self-start sm:self-auto">
                    {selectedMeeting.clearance.split(' - ')[0]}
                  </span>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-2.5 bg-[#070b13] border border-[#182335] p-3 rounded text-[10px]">
                  <div>
                    <span className="text-slate-500 block">DATE & TIME:</span>
                    <span className="text-slate-200">{selectedMeeting.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">LOCATION:</span>
                    <span className="text-purple-300">{selectedMeeting.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">CHAIRPERSON:</span>
                    <span className="text-slate-200">{selectedMeeting.chairperson}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ATTENDEES:</span>
                    <span className="text-slate-300 truncate block">{selectedMeeting.attendees.join(', ')}</span>
                  </div>
                </div>

                {/* Agenda */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">AGENDA ITEMS:</span>
                  <div className="space-y-1 bg-[#070b13] p-3 rounded border border-[#182335] text-[11px] text-slate-300">
                    {selectedMeeting.agenda.map((a, idx) => (
                      <div key={idx}>{a}</div>
                    ))}
                  </div>
                </div>

                {/* Minutes Content */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">SUMMARY OF MINUTES:</span>
                  <p className="text-[11px] text-slate-200 bg-[#070b13] p-3 rounded border border-[#182335] leading-relaxed">
                    {selectedMeeting.minutes}
                  </p>
                </div>

                {/* Motions Passed */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-emerald-400 font-bold block uppercase">MOTIONS ADOPTED:</span>
                  <div className="space-y-1.5">
                    {selectedMeeting.motionsPassed.map((m, idx) => (
                      <div key={idx} className="p-2 bg-[#080c14] border border-[#1a2336] rounded text-[10px] text-slate-300">
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Redacted Discussion */}
                <div className="p-3.5 bg-rose-950/20 border-l-2 border-rose-600 rounded text-[10px] text-rose-200 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-rose-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    CLASSIFIED BOARDROOM DELIBERATION:
                  </span>
                  <p className="font-mono">{selectedMeeting.redactedDiscussion}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Press Releases View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: Press Release List */}
          <div className="space-y-2">
            <div className="p-2.5 bg-[#0a0e18] border border-[#1b263b] rounded-lg font-bold text-xs text-white">
              PRESS RELEASES ({pressReleases.length})
            </div>
            <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
              {pressReleases.map((pr) => {
                const isSelected = selectedPress?.id === pr.id;
                return (
                  <div
                    key={pr.id}
                    onClick={() => {
                      gpcAudio.playUiSound('click');
                      setSelectedPress(pr);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all space-y-1 ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                        : 'bg-[#0a0e18] hover:bg-[#0e1524] border-[#1b263b] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300 text-[10px]">{pr.releaseNumber}</span>
                      <span className="text-[9px] text-slate-500">{pr.date}</span>
                    </div>
                    <h3 className="font-bold text-xs text-slate-200 truncate">{pr.headline}</h3>
                    <p className="text-[10px] text-slate-500 truncate">{pr.city}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 2 Cols: Selected Press Release Detail */}
          <div className="lg:col-span-2 space-y-4">
            {selectedPress && (
              <div className="p-5 bg-[#0a0e18] border border-[#1b263b] rounded-lg shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c273c] pb-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-cyan-400 text-sm font-mono">{selectedPress.releaseNumber}</span>
                    <h2 className="text-base font-bold text-white">{selectedPress.headline}</h2>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-bold self-start sm:self-auto">
                    {selectedPress.disclaimer.toUpperCase()}
                  </span>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-2.5 bg-[#070b13] border border-[#182335] p-3 rounded text-[10px]">
                  <div>
                    <span className="text-slate-500 block">RELEASE DATE:</span>
                    <span className="text-slate-200">{selectedPress.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">CITY OF ORIGIN:</span>
                    <span className="text-purple-300">{selectedPress.city}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">MEDIA CONTACT:</span>
                    <span className="text-slate-200">{selectedPress.mediaContact}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">LEAD PARAGRAPH:</span>
                    <span className="text-slate-300 truncate block">{selectedPress.leadParagraph}</span>
                  </div>
                </div>

                {/* Lead Paragraph */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">LEAD PARAGRAPH:</span>
                  <p className="text-[11px] text-slate-300 bg-[#070b13] p-3 rounded border border-[#182335] leading-relaxed font-serif">
                    {selectedPress.leadParagraph}
                  </p>
                </div>

                {/* Body Paragraphs */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-cyan-400 font-bold block uppercase">FULL PRESS RELEASE:</span>
                  <div className="space-y-2">
                    {selectedPress.bodyParagraphs.map((p, idx) => (
                      <p key={idx} className="text-[11px] text-slate-300 bg-[#070b13] p-3 rounded border border-[#182335] leading-relaxed font-serif">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Internal Subtext */}
                <div className="p-3.5 bg-rose-950/20 border-l-2 border-rose-600 rounded text-[10px] text-rose-200 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-rose-400 uppercase">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    INTERNAL GPC SUBTEXT:
                  </span>
                  <p className="font-mono">{selectedPress.internalSubtext}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
