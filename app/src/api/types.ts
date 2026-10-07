// Row types mirror the ERD in docs/PRD.md (Part 2) and the JSON in data/phase1.

export type ContentType = 'KPOP' | 'DRAMA' | 'MOVIE' | 'VARIETY';
export type RegionType = 'SEOUL' | 'NEAR_SEOUL';
export type SpotType = 'URBAN' | 'EXCURSION';
export type AccessLevel = 'EASY' | 'MEDIUM' | 'HARD';

export type Content = {
  id: number;
  name_en: string;
  name_ko: string;
  type: ContentType;
  description: string;
};

export type Spot = {
  id: number;
  name_en: string;
  name_ko: string;
  district: string;
  address: string;
  subway: string | null;
  opening_hours: string | null;
  admission: string | null;
  photo_tip: string | null;
  manners: string | null;
  region_type: RegionType;
  spot_type: SpotType;
  access_level: AccessLevel;
  access_note: string | null;
  round_trip_minutes: number | null;
  timetable_url: string | null;
  safety_note: string | null;
  latitude: number;
  longitude: number;
  last_verified_at: string | null;
  /** Not in the ERD: false until the coordinates are checked on a map. */
  coord_verified: boolean;
};

export type SpotContent = {
  id: number;
  spot_id: number;
  content_id: number;
  media_id: number | null;
  scene_start_sec: number | null;
  relation_note: string;
  source_url: string;
  source_type: string;
};

export type ContentMedia = {
  id: number;
  content_id: number;
  title: string;
  media_type: 'MV' | 'TRAILER' | 'CLIP' | 'AUDIO';
  platform: string;
  url: string;
  channel_name: string;
};

// Response shapes, following the API table in docs/PRD.md.

export type SpotSummary = Spot & { contents: Content[] };

export type SpotRelation = SpotContent & { content: Content; media: ContentMedia | null };

export type SpotDetail = Spot & { relations: SpotRelation[] };
