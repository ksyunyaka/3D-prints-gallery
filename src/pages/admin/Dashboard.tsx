import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { errorMessage } from "@/lib/errors";
import { useAuth } from "@/context/AuthContext";
import { useDeletePrint, usePrints } from "@/hooks/usePrints";
import type { Print } from "@/types/print";

const AdminDashboard = () => {
  const { data: prints, isLoading, error } = usePrints();
  const deletePrint = useDeletePrint();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [pendingDelete, setPendingDelete] = useState<Print | null>(null);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deletePrint.mutateAsync(pendingDelete);
      toast({ title: "Print deleted" });
    } catch (err) {
      toast({
        title: "Couldn't delete print",
        description: errorMessage(err),
        variant: "destructive",
      });
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display">Prints</h1>
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link to="/admin/prints/new">
              <Plus className="w-4 h-4" />
              Add print
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{errorMessage(error)}</p>}

      {prints && prints.length === 0 && (
        <p className="text-sm text-muted-foreground py-12 text-center">
          No prints yet — add your first one.
        </p>
      )}

      {prints && prints.length > 0 && (
        <ul className="divide-y divide-border">
          {prints.map((print) => (
            <li key={print.id} className="flex items-center gap-4 py-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                {print.images[0] && (
                  <img src={print.images[0]} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{print.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {print.published ? "Published" : "Draft"}
                  {print.tags.length > 0 && ` · ${print.tags.join(", ")}`}
                </p>
              </div>
              <Button asChild variant="ghost" size="icon">
                <Link to={`/admin/prints/${print.id}`} aria-label={`Edit ${print.title}`}>
                  <Pencil className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPendingDelete(print)}
                aria-label={`Delete ${print.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 space-y-4">
            <p className="text-sm">
              Delete <span className="font-medium">{pendingDelete.title}</span>? This also removes its
              photos and can't be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setPendingDelete(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deletePrint.isPending}>
                {deletePrint.isPending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
