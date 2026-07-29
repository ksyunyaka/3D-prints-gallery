import { PRINT_IMAGES_BUCKET, requireSupabase } from "@/lib/supabase";
import type { Print, PrintInput, PrintRow } from "@/types/print";

const TABLE = "prints";
const SELECT = "*";

/** Postgres unique-constraint violation. */
const UNIQUE_VIOLATION = "23505";

function fromRow(row: PrintRow): Print {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    year: row.year ?? "",
    tags: row.tags ?? [],
    material: row.material ?? "",
    sourceName: row.source_name ?? "",
    sourceUrl: row.source_url,
    stlUrl: row.stl_url,
    images: row.images ?? [],
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(input: PrintInput) {
  return {
    slug: input.slug,
    title: input.title.trim(),
    description: input.description.trim(),
    year: input.year.trim(),
    tags: input.tags,
    material: input.material.trim(),
    source_name: input.sourceName.trim(),
    source_url: input.sourceUrl?.trim() || null,
    stl_url: input.stlUrl?.trim() || null,
    images: input.images,
    published: input.published,
  };
}

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Published prints, newest first — what visitors see.
 * Signed-in callers get drafts too, courtesy of the RLS policies.
 */
export async function listPrints(): Promise<Print[]> {
  const { data, error } = await requireSupabase()
    .from(TABLE)
    .select(SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as PrintRow[]).map(fromRow);
}

export async function getPrintBySlug(slug: string): Promise<Print | null> {
  const { data, error } = await requireSupabase()
    .from(TABLE)
    .select(SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as PrintRow) : null;
}

export async function getPrintById(id: string): Promise<Print | null> {
  const { data, error } = await requireSupabase()
    .from(TABLE)
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as PrintRow) : null;
}

/**
 * Insert a print, retrying with a numeric suffix when the slug is taken so a
 * second "Benchy" doesn't dead-end on a constraint error.
 */
export async function createPrint(input: PrintInput): Promise<Print> {
  const base = slugify(input.slug || input.title) || "print";

  for (let attempt = 0; attempt < 10; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const { data, error } = await requireSupabase()
      .from(TABLE)
      .insert({ ...toRow(input), slug })
      .select(SELECT)
      .single();

    if (!error) return fromRow(data as PrintRow);
    if (error.code !== UNIQUE_VIOLATION) throw error;
  }

  throw new Error(`Could not find a free URL slug based on "${base}".`);
}

export async function updatePrint(id: string, input: PrintInput): Promise<Print> {
  const slug = slugify(input.slug || input.title) || "print";
  const { data, error } = await requireSupabase()
    .from(TABLE)
    .update({ ...toRow(input), slug })
    .eq("id", id)
    .select(SELECT)
    .single();

  if (error) throw error;
  return fromRow(data as PrintRow);
}

export async function deletePrint(print: Print): Promise<void> {
  const { error } = await requireSupabase().from(TABLE).delete().eq("id", print.id);
  if (error) throw error;

  // Best effort: the row is already gone, so a storage hiccup here is not fatal.
  await deletePrintImages(print.images).catch(() => undefined);
}

// ---------------------------------------------------------------------------
// Photo storage
// ---------------------------------------------------------------------------

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function extensionOf(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{1,5}$/.test(fromName)) return fromName;
  return file.type.split("/").pop() ?? "jpg";
}

/** Uploads one photo to the public bucket and returns its public URL. */
export async function uploadPrintImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`"${file.name}" is not an image.`);
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(`"${file.name}" is larger than 10 MB.`);
  }

  const client = requireSupabase();
  const path = `${crypto.randomUUID()}.${extensionOf(file)}`;

  const { error } = await client.storage
    .from(PRINT_IMAGES_BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });

  if (error) throw error;

  const { data } = client.storage.from(PRINT_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Maps a public URL back to its object path, or null if we don't own it. */
function storagePathOf(url: string): string | null {
  const marker = `/storage/v1/object/public/${PRINT_IMAGES_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

/** Removes uploaded photos from storage. Externally hosted URLs are ignored. */
export async function deletePrintImages(urls: string[]): Promise<void> {
  const paths = urls.map(storagePathOf).filter((path): path is string => path !== null);
  if (paths.length === 0) return;

  const { error } = await requireSupabase().storage.from(PRINT_IMAGES_BUCKET).remove(paths);
  if (error) throw error;
}

/** Every tag in use, for the gallery's category filter. */
export function collectTags(prints: Print[]): string[] {
  return [...new Set(prints.flatMap((print) => print.tags))].sort();
}
