import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { errorMessage } from "@/lib/errors";
import { getPrintById } from "@/lib/prints";
import { uploadPrintImage } from "@/lib/prints";
import { useCreatePrint, useUpdatePrint } from "@/hooks/usePrints";
import { emptyPrintInput, type PrintInput } from "@/types/print";

const AdminPrintForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [printId, setPrintId] = useState<string | null>(null);
  const [form, setForm] = useState<PrintInput>(emptyPrintInput());
  const [tagsText, setTagsText] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPrint = useCreatePrint();
  const updatePrint = useUpdatePrint();
  const saving = createPrint.isPending || updatePrint.isPending;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    getPrintById(id)
      .then((print) => {
        if (cancelled || !print) return;
        setPrintId(print.id);
        setForm({
          slug: print.slug,
          title: print.title,
          description: print.description,
          year: print.year,
          tags: print.tags,
          material: print.material,
          sourceName: print.sourceName,
          sourceUrl: print.sourceUrl,
          stlUrl: print.stlUrl,
          images: print.images,
          published: print.published,
        });
        setTagsText(print.tags.join(", "));
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [id]);

  const update = <K extends keyof PrintInput>(key: K, value: PrintInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadPrintImage(file));
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((image) => image !== url) }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (form.images.length === 0) {
      setError("Add at least one photo.");
      return;
    }

    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload: PrintInput = { ...form, tags, slug: form.slug || form.title };

    try {
      if (isEditing && printId) {
        await updatePrint.mutateAsync({ id: printId, input: payload });
        toast({ title: "Saved" });
      } else {
        await createPrint.mutateAsync(payload);
        toast({ title: "Print added" });
      }
      navigate("/admin");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8 pb-24">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="Articulated dragon"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          placeholder="What it is, how it printed, anything notable about the build."
          rows={5}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input id="year" value={form.year} onChange={(event) => update("year", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Input
            id="material"
            value={form.material}
            onChange={(event) => update("material", event.target.value)}
            placeholder="PLA — Galaxy Black"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tagsText}
          onChange={(event) => setTagsText(event.target.value)}
          placeholder="figurine, articulated, fantasy"
        />
        <p className="text-xs text-muted-foreground">Comma-separated.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sourceName">Model source</Label>
          <Input
            id="sourceName"
            value={form.sourceName}
            onChange={(event) => update("sourceName", event.target.value)}
            placeholder="Printables, my own design, ..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sourceUrl">Source link</Label>
          <Input
            id="sourceUrl"
            type="url"
            value={form.sourceUrl ?? ""}
            onChange={(event) => update("sourceUrl", event.target.value || null)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stlUrl">STL / model file link</Label>
        <Input
          id="stlUrl"
          type="url"
          value={form.stlUrl ?? ""}
          onChange={(event) => update("stlUrl", event.target.value || null)}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label>Photos</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {form.images.map((url) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-lg bg-muted group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 p-1 rounded-full bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <label className="aspect-square rounded-lg border border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              <Plus className="w-5 h-5 text-muted-foreground" />
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => handleFiles(event.target.files)}
              disabled={uploading}
            />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">The first photo is used as the cover image.</p>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
        <div>
          <p className="text-sm font-medium">Published</p>
          <p className="text-xs text-muted-foreground">Visible in the public gallery.</p>
        </div>
        <Switch checked={form.published} onCheckedChange={(checked) => update("published", checked)} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving || uploading}>
          {saving ? "Saving…" : isEditing ? "Save changes" : "Add print"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => navigate("/admin")}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AdminPrintForm;
