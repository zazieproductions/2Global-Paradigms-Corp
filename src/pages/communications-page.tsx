import { useState } from 'react';
import { Mail, Paperclip, AlertTriangle } from 'lucide-react';
import type { EmailThread, MeetingRecord, PressRelease } from '@/types';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { EMAIL_THREADS, MEETING_RECORDS, PRESS_RELEASES } from '@/content';
import { pickRecord, useRecordParam } from '@/hooks/use-record-param';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';

type SubTab = 'emails' | 'meetings' | 'press';

const emails = EMAIL_THREADS;
const meetings = MEETING_RECORDS;
const pressReleases = PRESS_RELEASES;

/** Pick the initial sub-tab from a `?record=` deep link. */
const subTabFor = (recordId: string | null): SubTab => {
  if (recordId && meetings.some((m) => m.id === recordId)) return 'meetings';
  if (recordId && pressReleases.some((r) => r.id === recordId)) return 'press';
  return 'emails';
};

export default function CommunicationsPage() {
  const recordId = useRecordParam();
  const [activeSubTab, setActiveSubTab] = useState<SubTab>(() => subTabFor(recordId));
  const [selectedEmail, setSelectedEmail] = useState<EmailThread | null>(() =>
    pickRecord(emails, recordId, emails[0])
  );
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(() =>
    pickRecord(meetings, recordId, meetings[0])
  );
  const [selectedPress, setSelectedPress] = useState<PressRelease | null>(() =>
    pickRecord(pressReleases, recordId, pressReleases[0])
  );

  return (
    <ArchivePage>
      <ViewHeader
        icon={Mail}
        iconClassName="text-blue-400"
        title="COMMUNICATIONS ARCHIVE // EMAILS & BOARD MINUTES"
        subtitle={`${emails.length} Leaked Email Chains + ${meetings.length} Emergency Executive Containment Sessions`}
        aside={
          <div className="flex items-center gap-1 bg-raised border border-line-strong rounded p-0.5 text-xs">
            <button
              type="button"
              aria-pressed={activeSubTab === 'emails'}
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
              type="button"
              aria-pressed={activeSubTab === 'meetings'}
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
              type="button"
              aria-pressed={activeSubTab === 'press'}
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
        }
      />

      {/* Main Split Interface */}
      {activeSubTab === 'emails' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: Email Thread List */}
          <div className="space-y-2">
            <div className="p-2.5 bg-panel border border-line-strong rounded-lg font-bold text-xs text-white">
              EMAIL THREADS ({emails.length})
            </div>
            <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
              {emails.map((thread) => {
                const isSelected = selectedEmail?.id === thread.id;
                return (
                  <button
                    type="button"
                    key={thread.id}
                    aria-pressed={isSelected}
                    onClick={() => {
                      gpcAudio.playUiSound('click');
                      setSelectedEmail(thread);
                    }}
                    className={`w-full text-left p-3 rounded-lg border cursor-pointer transition-all space-y-1 ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-400 text-white shadow-glow shadow-blue-500/20'
                        : 'bg-panel hover:bg-hover border-line-strong text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300 text-caption">{thread.threadCode}</span>
                      <span className="text-micro text-slate-500">{thread.date.split(' ')[0]}</span>
                    </span>
                    <span className="block font-bold text-xs text-slate-200 truncate">{thread.subject}</span>
                    <span className="block text-caption text-slate-500 truncate">
                      {thread.participants.map((p) => p.name.split(' ')[0]).join(', ')} (
                      {thread.messages.length} msgs)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 2 Cols: Selected Email Thread Viewer */}
          <div className="lg:col-span-2 space-y-4">
            {selectedEmail && (
              <div className="bg-panel border border-blue-500/40 rounded-lg shadow-xl overflow-hidden flex flex-col">
                {/* Thread Top Bar */}
                <div className="p-4 bg-hover border-b border-line-strong space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold text-xs">{selectedEmail.threadCode}</span>
                    <span className="text-micro px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-bold">
                      {selectedEmail.classification.split(' - ')[0]}
                    </span>
                  </div>
                  <h2 className="text-sm md:text-base font-bold text-white">{selectedEmail.subject}</h2>
                  <div className="text-caption text-slate-400 flex flex-wrap gap-2 pt-1 border-t border-slate-800">
                    <span className="font-bold text-slate-500">PARTICIPANTS:</span>
                    {selectedEmail.participants.map((p, idx) => (
                      <span key={idx} className="text-slate-300">
                        {p.name} ({p.role}){idx < selectedEmail.participants.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="p-4 md:p-6 space-y-4 overflow-y-auto max-h-[550px] scrollbar-thin">
                  {selectedEmail.messages.map((msg, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-4 rounded-lg bg-inset border border-line space-y-2 shadow-md"
                    >
                      <div className="flex items-center justify-between border-b border-line-subtle pb-2 text-caption">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-cyan-300">{msg.senderName}</span>
                          <span className="text-slate-500">&lt;{msg.senderEmail}&gt;</span>
                        </div>
                        <span className="text-slate-500 font-mono">{msg.timestamp}</span>
                      </div>

                      <p className="text-label text-slate-300 whitespace-pre-line leading-relaxed font-mono">
                        {msg.body}
                      </p>

                      {msg.hasAttachment && (
                        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2 text-caption text-amber-300 bg-amber-950/20 p-2 rounded border border-amber-500/30">
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
            <div className="p-2.5 bg-panel border border-line-strong rounded-lg font-bold text-xs text-white">
              EXECUTIVE MINUTES ({meetings.length})
            </div>
            <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
              {meetings.map((meet) => {
                const isSelected = selectedMeeting?.id === meet.id;
                return (
                  <button
                    type="button"
                    key={meet.id}
                    aria-pressed={isSelected}
                    onClick={() => {
                      gpcAudio.playUiSound('click');
                      setSelectedMeeting(meet);
                    }}
                    className={`w-full text-left p-3 rounded-lg border cursor-pointer transition-all space-y-1 ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-400 text-white shadow-glow shadow-blue-500/20'
                        : 'bg-panel hover:bg-hover border-line-strong text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300 text-caption">{meet.meetingCode}</span>
                      <span className="text-micro text-slate-500">{meet.date.split(' ')[0]}</span>
                    </span>
                    <span className="block font-bold text-xs text-slate-200 truncate">{meet.title}</span>
                    <span className="block text-caption text-slate-500 truncate">{meet.location}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 2 Cols: Meeting Record Details */}
          <div className="lg:col-span-2 space-y-4">
            {selectedMeeting && (
              <div className="p-5 bg-panel border border-line-strong rounded-lg shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line-strong pb-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-cyan-400 text-sm font-mono">
                      {selectedMeeting.meetingCode}
                    </span>
                    <h2 className="text-base font-bold text-white">{selectedMeeting.title}</h2>
                  </div>
                  <span className="text-micro px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-bold self-start sm:self-auto">
                    {selectedMeeting.clearance.split(' - ')[0]}
                  </span>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-2.5 bg-inset border border-line p-3 rounded text-caption">
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
                    <span className="text-slate-300 truncate block">
                      {selectedMeeting.attendees.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Agenda */}
                <div className="space-y-1">
                  <span className="text-caption text-slate-400 font-bold block uppercase">AGENDA ITEMS:</span>
                  <div className="space-y-1 bg-inset p-3 rounded border border-line text-label text-slate-300">
                    {selectedMeeting.agenda.map((a, idx) => (
                      <div key={idx}>{a}</div>
                    ))}
                  </div>
                </div>

                {/* Minutes Content */}
                <div className="space-y-1">
                  <span className="text-caption text-slate-400 font-bold block uppercase">
                    SUMMARY OF MINUTES:
                  </span>
                  <p className="text-label text-slate-200 bg-inset p-3 rounded border border-line leading-relaxed">
                    {selectedMeeting.minutes}
                  </p>
                </div>

                {/* Motions Passed */}
                <div className="space-y-1.5">
                  <span className="text-caption text-emerald-400 font-bold block uppercase">
                    MOTIONS ADOPTED:
                  </span>
                  <div className="space-y-1.5">
                    {selectedMeeting.motionsPassed.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-shell border border-line rounded text-caption text-slate-300"
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Redacted Discussion */}
                <div className="p-3.5 bg-rose-950/20 border-l-2 border-rose-600 rounded text-caption text-rose-200 space-y-1">
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
            <div className="p-2.5 bg-panel border border-line-strong rounded-lg font-bold text-xs text-white">
              PRESS RELEASES ({pressReleases.length})
            </div>
            <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
              {pressReleases.map((pr) => {
                const isSelected = selectedPress?.id === pr.id;
                return (
                  <button
                    type="button"
                    key={pr.id}
                    aria-pressed={isSelected}
                    onClick={() => {
                      gpcAudio.playUiSound('click');
                      setSelectedPress(pr);
                    }}
                    className={`w-full text-left p-3 rounded-lg border cursor-pointer transition-all space-y-1 ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-400 text-white shadow-glow shadow-blue-500/20'
                        : 'bg-panel hover:bg-hover border-line-strong text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300 text-caption">{pr.releaseNumber}</span>
                      <span className="text-micro text-slate-500">{pr.date}</span>
                    </span>
                    <span className="block font-bold text-xs text-slate-200 truncate">{pr.headline}</span>
                    <span className="block text-caption text-slate-500 truncate">{pr.city}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 2 Cols: Selected Press Release Detail */}
          <div className="lg:col-span-2 space-y-4">
            {selectedPress && (
              <div className="p-5 bg-panel border border-line-strong rounded-lg shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line-strong pb-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-cyan-400 text-sm font-mono">
                      {selectedPress.releaseNumber}
                    </span>
                    <h2 className="text-base font-bold text-white">{selectedPress.headline}</h2>
                  </div>
                  <span className="text-micro px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-bold self-start sm:self-auto">
                    {selectedPress.disclaimer.toUpperCase()}
                  </span>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-2.5 bg-inset border border-line p-3 rounded text-caption">
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
                  <span className="text-caption text-slate-400 font-bold block uppercase">
                    LEAD PARAGRAPH:
                  </span>
                  <p className="text-label text-slate-300 bg-inset p-3 rounded border border-line leading-relaxed font-serif">
                    {selectedPress.leadParagraph}
                  </p>
                </div>

                {/* Body Paragraphs */}
                <div className="space-y-1.5">
                  <span className="text-caption text-cyan-400 font-bold block uppercase">
                    FULL PRESS RELEASE:
                  </span>
                  <div className="space-y-2">
                    {selectedPress.bodyParagraphs.map((p, idx) => (
                      <p
                        key={idx}
                        className="text-label text-slate-300 bg-inset p-3 rounded border border-line leading-relaxed font-serif"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Internal Subtext */}
                <div className="p-3.5 bg-rose-950/20 border-l-2 border-rose-600 rounded text-caption text-rose-200 space-y-1">
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
    </ArchivePage>
  );
}
