export type Home = {
  id: number;
  slug: string;
  address: string;
  created_at: string;
};

export type EntryImage = {
  id: number;
  entry_id: number;
  path: string;
  original_name: string;
};

export type Entry = {
  id: number;
  home_id: number;
  year_start: number | null;
  year_end: number | null;
  story: string;
  created_at: string;
  images: EntryImage[];
};

export type HomeWithEntries = Home & {
  entries: Entry[];
};
