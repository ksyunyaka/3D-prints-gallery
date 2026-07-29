/** A single 3D printed project in the gallery. */
export interface Print {
  id: string;
  /** URL-safe identifier used by /print/:slug */
  slug: string;
  title: string;
  description: string;
  year: string;
  tags: string[];
  /** Filament or resin used, e.g. "PLA — Prusament Galaxy Black" */
  material: string;
  /** Where the model came from, e.g. "Printables" or "My own design" */
  sourceName: string;
  sourceUrl: string | null;
  /** Direct link to the STL / 3MF file, if there is one */
  stlUrl: string | null;
  /** Photo URLs. The first one is the cover image. */
  images: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

/** The editable subset of a print — what the admin form produces. */
export type PrintInput = Omit<Print, "id" | "createdAt" | "updatedAt">;

/** Shape of a row in the `prints` table. */
export interface PrintRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  year: string;
  tags: string[] | null;
  material: string;
  source_name: string;
  source_url: string | null;
  stl_url: string | null;
  images: string[] | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const emptyPrintInput = (): PrintInput => ({
  slug: "",
  title: "",
  description: "",
  year: String(new Date().getFullYear()),
  tags: [],
  material: "",
  sourceName: "",
  sourceUrl: null,
  stlUrl: null,
  images: [],
  published: true,
});
