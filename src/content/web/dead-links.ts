import type { DeadLink } from '@/types';

/**
 * Dead external references retained by the mirror.
 *
 * House style: these are snapshots of pages that no longer exist, kept
 * because the archive will not delete anything. The snippets keep the
 * punctuation and capitalisation of the original page, including the bad
 * ones. The investigator notes are our own and are written by an operator,
 * not a copywriter.
 */
export const DEAD_LINKS: DeadLink[] = [
  {
    id: 'dead-01',
    url: 'http://www.oakhaven-tribune.org/archives/2011/september/mass-ringing-event.html',
    originalHost: 'Oakhaven Daily Tribune (Independent Newspaper, Indiana)',
    errorType: '404 Not Found',
    originalTitle: 'Over 400 Residents Report Synchronized Ear Ringing and Dizziness on Main Street',
    cachedSnippet:
      '...SEPTEMBER 19, 2011. Dispatchers were overwhelmed on Sunday afternoon when several hundred shoppers and commuters along Main Street reported a high-pitched vibration followed by disorientation. Witnesses described the sound as "a church organ playing through the ground". GPC consultants working on local power grid upgrades said a utility transformer had experienced an isolated power surge...',
    investigatorNotes:
      'Domain lapsed in 2012. The newspaper morgue at Howard County Library was bought and incinerated by GPC legal representatives in 2013, which is a thing that happens to a local library about once a decade, and this is the only one we hold a receipt for.',
    archiveDate: 'Archived snapshot: 2011-09-20 04:12:18 GMT'
  },
  {
    id: 'dead-02',
    url: 'https://www.ffc.gov.us/inquiry/docket-2015-8819/infrasonic-emissions-chicago',
    originalHost: 'Federal Frequency Commission (FFC Docket Portal)',
    errorType: '410 Gone / Subpoenaed',
    originalTitle:
      'Docket 2015-8819: Notice of Inquiry into Non-Ionizing Acoustic Transmissions in Municipal Corridors',
    cachedSnippet:
      '...NOTICE OF INQUIRY: regarding public complaints concerning 19.8Hz acoustic emissions originating from municipal traffic monitoring poles in Cook County, Illinois. The Commission has received 320 petitions alleging physiological nausea and visual blurring among pedestrians...',
    investigatorNotes:
      'Docket sealed and pulled from the public register under National Security Protective Order 15-A, then reclassified under the defence acoustic exemption. The 320 petitions are referenced in the docket index and the petitions themselves are not held anywhere we have found.',
    archiveDate: 'Archived snapshot: 2015-10-14 11:22:05 EST'
  },
  {
    id: 'dead-03',
    url: 'https://palimpsest-archive.ch/leaks/naylor-svalbard-telemetry-master.tar.gz',
    originalHost: 'Palimpsest Whistleblower Relay Mirror (Zurich, Switzerland)',
    errorType: 'Domain Seized',
    originalTitle: 'Dr. Ewan Naylor: Complete Unredacted Station 07 Borehole 4 Infrasound Master Files',
    cachedSnippet:
      '...THIS DOMAIN HAS BEEN SEIZED BY ORDER OF THE HIGH COURT OF ENGLAND AND WALES AND THE SWISS FEDERAL PROSECUTOR UPON APPLICATION BY GLOBAL PARADIGMS CORPORATION UNDER THE SPECIAL ASSETS AND OFFICIAL SECRETS ACT. ALL INCOMING IP ADDRESSES ARE LOGGED AND FORWARDED TO CORPORATE SECURITY...',
    investigatorNotes:
      'Mirror seized by Agent Kiernan on 12 March 2020. By the time of the seizure the archive had been pulled 211 times, thirty-four of those from inside our own network, which was the part of the report that got people moved.',
    archiveDate: 'Archived snapshot: 2020-03-11 23:58:12 CET'
  },
  {
    id: 'dead-04',
    url: 'http://web.archive.org/web/19981104031244/http://www.globalparadigms.corp/consumer/reson8-safety',
    originalHost: 'Wayback Machine Mirror (Nov 4, 1998)',
    errorType: 'Wayback Mirror 1998',
    originalTitle: 'Global Paradigms Corp. — Reson-8 Customer Safety & Recall Advisory (1998 Cache)',
    cachedSnippet:
      '...GLOBAL PARADIGMS CORP. / CONSUMER NOTICE: The Reson-8 Sleep Machine recall is now officially concluded. All units returned prior to October 1998 have been processed and recycled. We thank our customers for their cooperation. GPC remains dedicated to bringing cutting-edge acoustic science into the modern home...',
    investigatorNotes:
      'Snapshot taken before the URL was excluded by robots.txt in 2004, so this is the only copy. The sentence about cutting-edge acoustic science was drafted by the communications desk eight years after the machine had been withdrawn as a hazard, and nobody in the drafting chain appears to have noticed.',
    archiveDate: 'Wayback Capture: 1998-11-04 03:12:44 GMT'
  },
  {
    id: 'dead-05',
    url: 'https://www.bristol-hum-investigation.org.uk/forum/thread-8492-underground-hum',
    originalHost: 'Bristol Acoustic Anomaly Forum (Community Forum, UK)',
    errorType: 'Redirection Blocked',
    originalTitle: 'Thread #8492: The Hum is Getting Louder in Clifton — It Matches the Subway Schedule',
    cachedSnippet:
      "...USER [AcousticWatcher_88]: Has anyone else noticed that the low hum in Clifton always starts exactly at 18:00 and peaks at 18:45? It isn't diesel engines. I put an oscilloscope on my water pipes and it's a pure 14.8Hz sine wave with a 432Hz harmonic. My neighbor says her sleep machine makes the same sound even when unplugged...",
    investigatorNotes:
      'Forum database wiped by the host in 2016 after the host was acquired by a GPC subsidiary. AcousticWatcher_88 traces to a former technician at this company, who is on the list of people we are not to contact.',
    archiveDate: 'Archived snapshot: 2014-04-18 20:15:33 GMT'
  },
  {
    id: 'dead-06',
    url: 'https://arctic-weather-network.no/stations/station-07-spitsbergen-public-feed',
    originalHost: 'Norwegian Polar Institute Public Meteorological Portal',
    errorType: '404 Not Found',
    originalTitle: 'Station 07 (Spitsbergen) Live Barometric Pressure & Temperature Feed',
    cachedSnippet:
      '...HTTP 404: The requested sensor station has been removed from the public meteorological feed. Station 07 operates under private corporate scientific charter. For public weather data in Svalbard, please consult the Longyearbyen Airport station feed...',
    investigatorNotes:
      "Public telemetry off since 1989, within a week of the borehole event. Everything from the colony now runs on our own encrypted link and the institute's last letter on the subject is polite, which it has been for thirty-seven years.",
    archiveDate: 'Archived snapshot: 2019-08-01 00:00:00 UTC'
  },
  {
    id: 'dead-07',
    url: 'http://members.geocities.com/Area51/Vault/7148/choir/index.htm',
    originalHost: 'GeoCities Personal Homepage ("The Listening Post" — anonymous)',
    errorType: 'Wayback Mirror 1998',
    originalTitle: 'the listening post :: for those who hear it at six',
    cachedSnippet:
      '...if you found this page you already know about the hum. i am not going to say who i am. i am leaving one line here for whoever comes after me. you will need the wheel and the name of the place where they keep everything. IVW LOOR OESFL OC GHT VGNF ERSESJ LWWTS. do not look back...',
    investigatorNotes:
      'Page mirrored in 1998, and its text was edited in October 2019, which is impossible for a static archive and is how we found it. The edit is attributed to Dr. Ewan Naylor. A faint seven-pointed star is tiled into the page background and is visible only on a low-brightness display.',
    archiveDate: 'Archived snapshot: 1998-11-04 04:32:00 GMT (modified 2019-10-14)'
  }
];
