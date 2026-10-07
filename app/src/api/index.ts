// The only place the app reads data from.
// Phase 1 reads the bundled JSON in data/phase1. In phase 2, replace these
// function bodies with calls to the Spring API; screens keep the same signatures.

import contentMediaRows from '../../../data/phase1/content_media.json';
import contentRows from '../../../data/phase1/contents.json';
import spotContentRows from '../../../data/phase1/spot_contents.json';
import spotRows from '../../../data/phase1/spots.json';

import type {
  Content,
  ContentMedia,
  ContentType,
  Spot,
  SpotContent,
  SpotDetail,
  SpotSummary,
} from './types';

export * from './types';

const contents = contentRows as Content[];
const spots = spotRows as Spot[];
const spotContents = spotContentRows as SpotContent[];
const contentMedia = contentMediaRows as ContentMedia[];

const contentById = new Map(contents.map((c) => [c.id, c]));
const mediaById = new Map(contentMedia.map((m) => [m.id, m]));

function matches(query: string | undefined, ...fields: string[]) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  return fields.some((f) => f.toLowerCase().includes(q));
}

function toSummary(spot: Spot): SpotSummary {
  const ids = new Set(spotContents.filter((sc) => sc.spot_id === spot.id).map((sc) => sc.content_id));
  return { ...spot, contents: [...ids].map((id) => contentById.get(id)!).filter(Boolean) };
}

/** GET /api/contents?type=&q= */
export async function getContents(params: { type?: ContentType; q?: string } = {}): Promise<Content[]> {
  return contents.filter(
    (c) => (!params.type || c.type === params.type) && matches(params.q, c.name_en, c.name_ko),
  );
}

/** GET /api/contents/{id} */
export async function getContent(id: number): Promise<Content | undefined> {
  return contentById.get(id);
}

/** GET /api/contents/{id}/spots */
export async function getContentSpots(contentId: number): Promise<SpotSummary[]> {
  const ids = new Set(spotContents.filter((sc) => sc.content_id === contentId).map((sc) => sc.spot_id));
  return spots.filter((s) => ids.has(s.id)).map(toSummary);
}

/** GET /api/contents/{id}/media */
export async function getContentMedia(contentId: number): Promise<ContentMedia[]> {
  return contentMedia.filter((m) => m.content_id === contentId);
}

/** GET /api/spots?q= */
export async function getSpots(params: { q?: string } = {}): Promise<SpotSummary[]> {
  return spots.filter((s) => matches(params.q, s.name_en, s.name_ko, s.district)).map(toSummary);
}

/** GET /api/spots/{id} */
export async function getSpot(id: number): Promise<SpotDetail | undefined> {
  const spot = spots.find((s) => s.id === id);
  if (!spot) return undefined;
  const relations = spotContents
    .filter((sc) => sc.spot_id === id)
    .map((sc) => ({
      ...sc,
      content: contentById.get(sc.content_id)!,
      media: sc.media_id != null ? (mediaById.get(sc.media_id) ?? null) : null,
    }));
  return { ...spot, relations };
}
