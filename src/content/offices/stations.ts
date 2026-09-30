import type { RegionalStation } from '@/types';

/**
 * Station register, maintained by SISO operations.
 *
 * House style: descriptions are written by the station chief at commissioning
 * and only edited when something changes physically. Incident lines are
 * pasted in from the station log by an administrator and are not tidied.
 */
export const REGIONAL_STATIONS: RegionalStation[] = [
  {
    id: 'st-01',
    code: 'LON-01-HQ',
    name: 'Global HQ - Tower Obsidian',
    region: 'Western Europe (United Kingdom)',
    coordinates: '51.5155° N, 0.0825° W',
    latitude: 51.5155,
    longitude: -0.0825,
    facilityType: 'Corporate Tower',
    status: 'Operational',
    personnelCount: 1420,
    leadPersonnelId: 'p-003',
    leadPersonnelName: 'CEO Nigel Ashby',
    establishedDate: '1971-04-12',
    frequencyBand: '22.0 Hz (Architectural Anti-Resonance)',
    description:
      'Fifty-four floors of black glass in Bishopsgate, six of them below ground and one of those unlisted. The listed floors hold server halls, the crisis suite and the anti-resonance plant. The unlisted floor is where the dampeners are driven from and it is kept on a separate key card.',
    incidentHistory: [
      '1987: Sub-basement 4 electrical fire. The fire report describes cable trays; the works order for the same week covers antenna installation.',
      '2014: Crossrail excavation recorded vibration through unmapped dampers. The contractor was paid for a survey and given a second one to do elsewhere.',
      '2023: A recording of the HVAC drone went up on a forum and was gone within a day. Two staff members were interviewed and neither of them did it.'
    ],
    activeProjects: ['Project Echo-State', 'Project Palimpsest', 'Project Vitruvian']
  },
  {
    id: 'st-02',
    code: 'VA-02-HUB',
    name: 'North American Operational Hub - Rosslyn Sub-Complex',
    region: 'North America (Virginia, USA)',
    coordinates: '38.8961° N, 77.0719° W',
    latitude: 38.8961,
    longitude: -77.0719,
    facilityType: 'Subterranean Bunker',
    status: 'Operational',
    personnelCount: 840,
    leadPersonnelId: 'p-007',
    leadPersonnelName: 'Dr. Naomi Chen',
    establishedDate: '1982-08-15',
    frequencyBand: '14.8 Hz / 432 Hz Dual Modulated',
    description:
      'Forty-five metres of concrete beneath Rosslyn with a staff canteen on the first level down. The complex has two links to federal continuity networks; both are documented as commercial data lines and both have been audited exactly once.',
    incidentHistory: [
      '1994: Recall coordination centre for the Reson-8 recall. The room is still called the crisis room and nobody uses it for anything else.',
      '2011: Command node for the Oakhaven trial. The trial footage is held here on a shelf and is listed in the register as training material.',
      '2024: Low-frequency leak produced hum complaints across North Arlington for six weeks. The complaints were mapped and the map showed the shape of the duct run.'
    ],
    activeProjects: ['Project Vesper', 'Project Hypnos', 'Project Chime']
  },
  {
    id: 'st-03',
    code: 'TYO-03-PAC',
    name: 'Pacific Basin Analytics - Tokyo Chiyoda Deep Tower',
    region: 'East Asia (Japan)',
    coordinates: '35.6895° N, 139.6917° E',
    latitude: 35.6895,
    longitude: 139.6917,
    facilityType: 'Corporate Tower',
    status: 'Operational',
    personnelCount: 620,
    leadPersonnelId: 'p-014',
    leadPersonnelName: 'Dr. Tobias Voss',
    establishedDate: '1989-03-01',
    frequencyBand: '60.0 Hz Power-Grid Injected Sub-Harmonic',
    description:
      'Quantitative and behavioural analysis floors above ground, entrainment work below. The tower sits close enough to the 50/60Hz grid boundary to work on either side of it, which is why this site was chosen over Osaka and why the decision memo is four lines long.',
    incidentHistory: [
      '2011: Tōhoku telemetry caught a 14.8Hz precursor 18 minutes ahead of the rupture. The finding was written up, reviewed, and filed as instrument noise.',
      '2018: Crowd-pacification trial in a Shinjuku transit corridor. Signage messing from the trial was taken down by staff who had not been told what the trial was.'
    ],
    activeProjects: ['Project Hypnos', 'Project Echo-State', 'Project Cicada']
  },
  {
    id: 'st-04',
    code: 'SVA-04-ARR',
    name: 'Nordic Acoustic Array - Station 07',
    region: 'Arctic (Spitsbergen, Svalbard)',
    coordinates: '78.2232° N, 15.6267° E',
    latitude: 78.2232,
    longitude: 15.6267,
    facilityType: 'Permafrost Vault',
    status: 'Elevated Alert',
    personnelCount: 38,
    leadPersonnelId: 'p-018',
    leadPersonnelName: 'Dr. Henrik Lindqvist',
    establishedDate: '1986-11-10',
    frequencyBand: '14.8 Hz Sub-Permafrost Harmonic Baseline',
    description:
      "Twelve kilometres north of Longyearbyen, built on ground that has been frozen for longer than there have been people to freeze it. Borehole 4 runs to 820 metres and is capped with a plate that carries the station's only inscription in the Choir code.",
    incidentHistory: [
      '1989: Drill broke into a void at 812 m. Sedley went down alone the next morning and the cage came back without him. The bit is described in the log as having lost temper; the metallurgy report says the same thing in more words.',
      '2019: Naylor took 48GB, including the intercom tape from 1989. He was through Longyearbyen airport before the first mirror appeared.',
      '2024: Seismic amplitude 18.4% above baseline. Lindqvist filed the number and asked for the alarm threshold to be reviewed; the review is still open.'
    ],
    activeProjects: ['Project Boreas', 'Project Palimpsest', 'Project Monolith']
  },
  {
    id: 'st-05',
    code: 'CHI-05-ALT',
    name: 'High-Altitude Infrasound Array - Atacama Trench Station',
    region: 'South America (Atacama, Chile)',
    coordinates: '23.8634° S, 69.1328° W',
    latitude: -23.8634,
    longitude: -69.1328,
    facilityType: 'High-Altitude Sensor',
    status: 'Operational',
    personnelCount: 45,
    leadPersonnelId: 'p-019',
    leadPersonnelName: 'Dr. Soraya Morales',
    establishedDate: '1995-04-12',
    frequencyBand: '4.2 Hz Atmospheric Standing Pillar',
    description:
      'Microbarometer array at 4,800 metres in the driest air on the planet, on an eight-week rotation with four weeks off. The cryogenic plant runs louder than the array, so the sensors sit 400 metres from the buildings on their own power.',
    incidentHistory: [
      '2003: Morales found the 4.2Hz column standing thirty-five kilometres high over the plateau. It has not moved since, which was the finding and not the weather.',
      '2021: Optical micro-refraction from the array disturbed the neighbouring observatories during a commissioning window. Compensation was paid and the schedule was quietly moved to the winter.'
    ],
    activeProjects: ['Project Boreas', 'Project Stentor']
  },
  {
    id: 'st-06',
    code: 'UT-06-CNT',
    name: 'Sub-Basin Containment Facility - Site 19',
    region: 'North America (Utah, USA)',
    coordinates: '41.1158° N, 112.8711° W',
    latitude: 41.1158,
    longitude: -112.8711,
    facilityType: 'Subterranean Bunker',
    status: 'Under Containment',
    personnelCount: 310,
    leadPersonnelId: 'p-012',
    leadPersonnelName: 'Chief Engineer Sarah Lin',
    establishedDate: '1979-09-20',
    frequencyBand: '32.4 Hz Heavy Structural Containment Tone',
    description:
      'Six hundred metres of shaft and gallery under the salt west of the Great Salt Lake. The containment jacks in Chamber 04 run at 114dB continuously and can be felt as vibration through the mess floor. The canteen is on Sub-Level 3 and the induction booklet explains the floor as plant movement.',
    incidentHistory: [
      '1998: Chamber 02 breached acoustically and the test bedrock liquefied. The gallery was backfilled and the incident is in the register as a drilling water inflow.',
      '2023: Sub-Level 6 micro-fracture took 40,000 tonnes of polymer and eleven weeks to hold. The road closure notice said culvert replacement.'
    ],
    activeProjects: ['Project Janitor', 'Project Stentor', 'Project Stillwater']
  },
  {
    id: 'st-07',
    code: 'YK-07-BOR',
    name: 'Sub-Boreal Propagation Array - Yellowknife Sub-Permafrost Lab',
    region: 'North America (Northwest Territories, Canada)',
    coordinates: '62.4540° N, 114.3718° W',
    latitude: 62.454,
    longitude: -114.3718,
    facilityType: 'Permafrost Vault',
    status: 'Operational',
    personnelCount: 88,
    leadPersonnelId: 'p-020',
    leadPersonnelName: 'Dr. Marcus Saito',
    establishedDate: '1992-06-18',
    frequencyBand: '18.2 Hz Boreal Waveguide',
    description:
      'A bio-acoustic lab and twelve-bed clinical unit in an abandoned gold shaft, with the mine headframe kept intact because removing it costs money and because a working headframe is the best cover a shaft can have. The clinic intake is written up as occupational medicine for the resource industry.',
    incidentHistory: [
      '2020: Thirty-day quarantine of Station 07 transferees presenting Stage-3. Eleven staff, no refusals, and the intake register for the month is missing two pages.',
      '2022: Compound 88-T moved from trial to standard issue. The original consent forms are held here rather than at Rosslyn and Saito has been asked why more than once.'
    ],
    activeProjects: ['Project Morpheus', 'Project Boreas']
  },
  {
    id: 'st-08',
    code: 'SWI-08-RED',
    name: 'European Civic Continuity Bunker - Swiss Alps Redoubt',
    region: 'Western Europe (Grimsel Pass, Switzerland)',
    coordinates: '46.5721° N, 8.3340° E',
    latitude: 46.5721,
    longitude: 8.334,
    facilityType: 'Subterranean Bunker',
    status: 'Operational',
    personnelCount: 160,
    leadPersonnelId: 'p-010',
    leadPersonnelName: 'Mara Finch',
    establishedDate: '1984-10-05',
    frequencyBand: '528 Hz Harmonic Stabilization Field',
    description:
      'Twelve hundred metres into granite under the Grimsel Pass, self-sustaining for 720 days with hydroponic bays on two levels. The bulkhead doors seal automatically at surge and there is no manual override; the decision to remove it was taken in 2016 and is minuted in the seventh chamber file.',
    incidentHistory: [
      '2021: Ninety-day silent cohort drill completed with no external air exchange. Three participants withdrew from the programme afterwards and their names have been taken off the roll.',
      '2024: Heritage Cohort biometric and seed vault transfers finished ahead of schedule, eleven berths short of the roster, which has been accepted.'
    ],
    activeProjects: ['Project Aethelgard', 'Project Stillwater']
  },
  {
    id: 'st-09',
    code: 'DG-09-HYD',
    name: 'Indian Ocean Submerged Monitor - Diego Garcia Hydrophone 12',
    region: 'Indian Ocean (Diego Garcia Trench)',
    coordinates: '7.3195° S, 72.4229° E',
    latitude: -7.3195,
    longitude: 72.4229,
    facilityType: 'Seabed Hydrophone',
    status: 'Operational',
    personnelCount: 24,
    leadPersonnelId: 'p-025',
    leadPersonnelName: 'Dr. Tariq Al-Mansoor',
    establishedDate: '2001-12-04',
    frequencyBand: '54.0 Hz Abyssal Trench Pulse',
    description:
      "An anchored listening platform at 5,400 metres with a fibre back to the island. The crew is twenty-four and rotates by supply flight, and the station's standing rule is that no one is to answer the hydrophone in writing on the day they hear something new.",
    incidentHistory: [
      '2014: Hydrophone 12 caught an eighteen-minute rhythm from below the crust. Three watches logged it independently and the three logs do not agree on where it stopped.',
      '2023: Source fixed at 8,400 metres sub-seabed. The pulse swept upward and Azores Node 14 heard the same event fourteen minutes later, which is the part of the record that has no explanation.'
    ],
    activeProjects: ['Project Monolith', 'Project Stentor']
  },
  {
    id: 'st-10',
    code: 'SLO-10-ARC',
    name: 'Balkan Harmonic Calibration Center - Postojna Caverns',
    region: 'Eastern Europe (Slovenia)',
    coordinates: '45.7828° N, 14.2045° E',
    latitude: 45.7828,
    longitude: 14.2045,
    facilityType: 'Subterranean Bunker',
    status: 'Operational',
    personnelCount: 95,
    leadPersonnelId: 'p-023',
    leadPersonnelName: 'Vincent Adeyemi',
    establishedDate: '1998-03-22',
    frequencyBand: '7.83 Hz Schumann Resonator Array',
    description:
      'Climate-controlled galleries holding the physical archive, the analogue masters and the calibration rooms, sixty metres under a cave system that takes paying visitors every day of the year. The reading room is genuine, the tours are not permitted inside it, and chambers seven to eleven are not on any plan that a visitor could be shown.',
    incidentHistory: [
      '2019: Julian Naylor went into the master logs from an internal terminal and was terminated within the month. He was remediated before release and now lives in Ljubljana and does not recognise former colleagues when they see him.',
      '2020: Automatic hash re-indexers came online across the estate. The first pass invalidated every leaked copy that had ever been compared against the master, which is what the equipment is for.'
    ],
    activeProjects: ['Project Palimpsest', 'Project Janitor']
  },
  {
    id: 'st-11',
    code: 'KEN-11-EQU',
    name: 'Equatorial Infrasonic Array - Mount Kenya Observatory',
    region: 'Sub-Saharan Africa (Kenya)',
    coordinates: '0.1521° S, 37.3084° E',
    latitude: -0.1521,
    longitude: 37.3084,
    facilityType: 'High-Altitude Sensor',
    status: 'Operational',
    personnelCount: 32,
    leadPersonnelId: 'p-018',
    leadPersonnelName: 'Dr. Henrik Lindqvist',
    establishedDate: '2006-05-18',
    frequencyBand: '11.4 Hz Equatorial Ducting',
    description:
      "A cluster on the mountain's north shoulder watching the Rift Valley for ducted sound. The site took four years to permit and eleven days to build, and the crew keeps a goat, which is not in the specification and has been in every photograph since.",
    incidentHistory: [
      '2017: Recorded coupling between a Rift Valley shift and ionospheric plasma density. The correlation was filed under an atmospheric heading that the station asked to have changed and did not get changed.'
    ],
    activeProjects: ['Project Stentor', 'Project Boreas']
  },
  {
    id: 'st-12',
    code: 'SWE-12-BAL',
    name: 'Baltic Infrasonic Array - Gotland Deep Sensor 4',
    region: 'Northern Europe (Gotland, Sweden)',
    coordinates: '57.4992° N, 18.5074° E',
    latitude: 57.4992,
    longitude: 18.5074,
    facilityType: 'Subterranean Bunker',
    status: 'Operational',
    personnelCount: 42,
    leadPersonnelId: 'p-018',
    leadPersonnelName: 'Dr. Henrik Lindqvist',
    establishedDate: '1999-07-14',
    frequencyBand: '19.8 Hz Baltic Baseline',
    description:
      'A bedrock sensor in a converted coastal bunker, staffed by four with an office that was, until 1999, a submarine listening post. The handover papers are still in the cupboard and nobody has decided whether they should be destroyed.',
    incidentHistory: [
      '2015: Detected probe testing in international waters. The navy asked for the record and was given a copy with the time axis shifted by ninety minutes, which the station has never been able to explain in writing.'
    ],
    activeProjects: ['Project Vesper', 'Project Boreas']
  },
  {
    id: 'st-13',
    code: 'AUS-13-RED',
    name: 'Australasian Continuity Depot - Woomera Redoubt',
    region: 'Oceania (South Australia)',
    coordinates: '31.1999° S, 136.8258° E',
    latitude: -31.1999,
    longitude: 136.8258,
    facilityType: 'Subterranean Bunker',
    status: 'Operational',
    personnelCount: 110,
    leadPersonnelId: 'p-010',
    leadPersonnelName: 'Mara Finch',
    establishedDate: '1991-11-20',
    frequencyBand: '432 Hz Southern Hemisphere Harmonic',
    description:
      'A continuity depot inside the prohibited area with a machine shop on the surface that genuinely makes drilling hardware, and a vault beneath it that provisions for two years of closed operation. The lease is held through an agricultural name that does not correspond to any person.',
    incidentHistory: [
      '2002: Testing of high-power crowd-dispersal arrays was logged as rock-breaking trials on the range schedule. The range schedule has since been reissued twice.'
    ],
    activeProjects: ['Project Aethelgard', 'Project Cicada']
  },
  {
    id: 'st-14',
    code: 'TDC-14-OCN',
    name: 'South Atlantic Hydrophone Array - Tristan da Cunha Post 02',
    region: 'South Atlantic (Tristan da Cunha)',
    coordinates: '37.1052° S, 12.2777° W',
    latitude: -37.1052,
    longitude: -12.2777,
    facilityType: 'Seabed Hydrophone',
    status: 'Operational',
    personnelCount: 18,
    leadPersonnelId: 'p-025',
    leadPersonnelName: 'Dr. Tariq Al-Mansoor',
    establishedDate: '2008-02-11',
    frequencyBand: '8.1 Hz Deep Atlantic Resonator',
    description:
      'The most remote installation the company operates: eighteen people, one mooring, and a supply call four times a year. The station listens to the South Atlantic Magnetic Anomaly, where compasses behave badly and every vessel that comes within range is asked to move on.',
    incidentHistory: [
      '2019: Hydrophones across a 6,000km baseline synchronised spontaneously for nineteen minutes. The record is the only one in the archive where three separate instruments agree to the millisecond and nobody can say what happened.'
    ],
    activeProjects: ['Project Monolith']
  },
  {
    id: 'st-15',
    code: 'NV-15-MOJ',
    name: 'Mojave Acoustic Propagation Corridor - Sector 44',
    region: 'North America (Nevada, USA)',
    coordinates: '36.8282° N, 115.9840° W',
    latitude: 36.8282,
    longitude: -115.984,
    facilityType: 'Subterranean Bunker',
    status: 'Operational',
    personnelCount: 140,
    leadPersonnelId: 'p-012',
    leadPersonnelName: 'Chief Engineer Sarah Lin',
    establishedDate: '1985-09-08',
    frequencyBand: '14.8 Hz High-Power Carrier Array',
    description:
      'Eighty miles of surface transducer with a control bunker at the midpoint and a workshop at the north end. It is the loudest place the company owns and the only station where staff are forbidden to sleep on site during transmit windows.',
    incidentHistory: [
      '1991: Full-power test disoriented wildlife across four hundred square miles. The incident report blames a transformer, and two of the plates are still under the sand because recovery was priced and declined.'
    ],
    activeProjects: ['Project Vesper', 'Project Stentor']
  },
  {
    id: 'st-16',
    code: 'WV-16-APP',
    name: 'Appalachian Seismic-Acoustic Station - Black Ridge',
    region: 'North America (West Virginia, USA)',
    coordinates: '38.1245° N, 81.3481° W',
    latitude: 38.1245,
    longitude: -81.3481,
    facilityType: 'Subterranean Bunker',
    status: 'Operational',
    personnelCount: 65,
    leadPersonnelId: 'p-029',
    leadPersonnelName: 'Dr. Clara Zimmerman',
    establishedDate: '2004-10-18',
    frequencyBand: '42.0 Hz Coal Seam Resonant Node',
    description:
      'A monitoring post in a decommissioned deep mine, four hundred and twenty metres down at Level 4 with a lift that takes four minutes and has been out of service twice this year. The galleries ring in fifths when the pumps are idling, which the crew are used to and visitors are not.',
    incidentHistory: [
      '2020: The Singing Seam recording was made when the hydraulic fluid met a quartz fissure and the wall kept sounding for three minutes after the rig stopped. Zimmerman wrote it up as resonance and has been asked about it twice by people from London.'
    ],
    activeProjects: ['Project Stentor', 'Project Stillwater']
  },
  {
    id: 'st-17',
    code: 'SIB-17-TIK',
    name: 'Siberian Boundary Station - Tiksi Sub-Zero Post',
    region: 'Northern Asia (Siberia)',
    coordinates: '71.6872° N, 128.8694° E',
    latitude: 71.6872,
    longitude: 128.8694,
    facilityType: 'Permafrost Vault',
    status: 'Operational',
    personnelCount: 52,
    leadPersonnelId: 'p-024',
    leadPersonnelName: 'Roman Sleptsov',
    establishedDate: '2012-11-05',
    frequencyBand: '14.8 Hz Polar East Baseline',
    description:
      'A permafrost station on the Laptev shore with seismic strings to 12,000 metres on the east side. Nine staff through the winter, helicopter in on Thursdays when the weather allows, and a thermal log that Sleptsov started for the borehole and that the company now uses as its input to everything else.',
    incidentHistory: [
      '2025: Thermal surge in Borehole 8 during a cold spell, with the temperature rising while the air temperature outside was -41C. The log is in order; the explanation is not.'
    ],
    activeProjects: ['Project Boreas', 'Project Monolith']
  },
  {
    id: 'st-18',
    code: 'CAY-18-TRO',
    name: 'Caribbean Acoustic Depth Laboratory - Cayman Trough Platform 9',
    region: 'Caribbean (Cayman Trench)',
    coordinates: '18.9822° N, 81.4211° W',
    latitude: 18.9822,
    longitude: -81.4211,
    facilityType: 'Seabed Hydrophone',
    status: 'Operational',
    personnelCount: 35,
    leadPersonnelId: 'p-025',
    leadPersonnelName: 'Dr. Tariq Al-Mansoor',
    establishedDate: '2015-01-20',
    frequencyBand: '72.0 Hz Deep Trench Chime',
    description:
      'A moored lab at 6,000 metres over the hydrothermal field, with a surface tender on station and a crew that spends three weeks at a time on a platform that moves more than the brochure suggests. It is the deepest manned installation the company has and it was built to answer one question about vent fields.',
    incidentHistory: [
      '2021: Confirmed the acoustic focusing effect of the vent field, twenty-four decibels across the field. The finding changed the Monolith budget within a quarter.'
    ],
    activeProjects: ['Project Stillwater', 'Project Monolith']
  },
  {
    id: 'st-19',
    code: 'AZO-19-MAR',
    name: 'Mid-Atlantic Ridge Array Node 14 - Azores Seabed Station',
    region: 'Atlantic Ocean (Azores)',
    coordinates: '38.5321° N, 28.6210° W',
    latitude: 38.5321,
    longitude: -28.621,
    facilityType: 'Seabed Hydrophone',
    status: 'Operational',
    personnelCount: 28,
    leadPersonnelId: 'p-038',
    leadPersonnelName: 'Kasper Vang',
    establishedDate: '2017-06-20',
    frequencyBand: '16.4 Hz Spreading Ridge Harmonic',
    description:
      'Sapphire transducers on the ridge at 3,200 metres, cabled back to Horta. Resolution is below a millihertz, which is finer than the installation was specified for and finer than the array has any use for, and which has already repaid the cost of the cable twice.',
    incidentHistory: [
      '2022: Recorded the harmonic loop that runs between the European and North American grids. The loop is audible in the power supply of the station itself, which is how it was noticed before it was measured.'
    ],
    activeProjects: ['Project Monolith', 'Project Stentor']
  },
  {
    id: 'st-20',
    code: 'JEJ-20-VAU',
    name: 'East Asian Continuity Facility - Jeju Island Deep Vault',
    region: 'East Asia (South Korea)',
    coordinates: '33.4996° N, 126.5312° E',
    latitude: 33.4996,
    longitude: 126.5312,
    facilityType: 'Subterranean Bunker',
    status: 'Operational',
    personnelCount: 190,
    leadPersonnelId: 'p-014',
    leadPersonnelName: 'Dr. Tobias Voss',
    establishedDate: '2016-08-14',
    frequencyBand: '432 Hz Regional Stabilizer',
    description:
      'A lava tube converted into a continuity vault behind a stainless bulkhead, provisioned for 720 days, with hydroponics and a clinic. It holds eleven fewer berths than the roster expects, which is recorded in the acceptance note and has not been resolved.',
    incidentHistory: [
      '2023: East Asian demographic data pipelines integrated. The integration used a live subscriber feed and the paperwork describing it as anonymised is in the archive and is wrong.'
    ],
    activeProjects: ['Project Aethelgard', 'Project Hypnos']
  },
  {
    id: 'st-21',
    code: 'KGL-21-DEM',
    name: 'Sub-Saharan Demographic Monitor - Kigali Urban Lab',
    region: 'Sub-Saharan Africa (Rwanda)',
    coordinates: '1.9441° S, 30.0619° E',
    latitude: -1.9441,
    longitude: 30.0619,
    facilityType: 'Corporate Tower',
    status: 'Operational',
    personnelCount: 75,
    leadPersonnelId: 'p-039',
    leadPersonnelName: 'Dr. Rebecca Osei',
    establishedDate: '2016-01-18',
    frequencyBand: '24.8 Hz Urban Baseline',
    description:
      'A mid-rise office block with a demographic research floor and a mobile network analysis rack, watching population movement across East Africa. The work is largely genuine research; the acoustic component rides on the same fibre and appears in the accounts under the same heading.',
    incidentHistory: [
      '2022: Ambient mobile carrier alerts tested during a public health exercise. The alert was sent to 400,000 handsets and the exercise was reported as a success in the local press before our own evaluation was written.'
    ],
    activeProjects: ['Project Echo-State', 'Project Chime']
  },
  {
    id: 'st-22',
    code: 'PAT-22-FJD',
    name: 'South American Continuity Center - Patagonia Fjord Station',
    region: 'South America (Patagonia, Chile)',
    coordinates: '45.8920° S, 73.6540° W',
    latitude: -45.892,
    longitude: -73.654,
    facilityType: 'Subterranean Bunker',
    status: 'Operational',
    personnelCount: 50,
    leadPersonnelId: 'p-010',
    leadPersonnelName: 'Mara Finch',
    establishedDate: '2018-09-12',
    frequencyBand: '528 Hz Fjord Acoustic Trap',
    description:
      'A redoubt cut into coastal granite above the fjord with a below-water service tunnel and a seed store on the second level. It closes the twenty-two-station network the founders sketched in 1974 and has the best kitchen of any site the company operates, which the crew mention to visitors before they mention the vault.',
    incidentHistory: [
      "2024: Hydro-acoustic tidal generator installed and tied into the building's own supply. The generator is the first plant on the station whose telemetry is not shared with the array, on the instruction of the station chief."
    ],
    activeProjects: ['Project Aethelgard', 'Project Stillwater']
  }
];
