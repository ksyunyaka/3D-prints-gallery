import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPrint,
  deletePrint,
  getPrintBySlug,
  listPrints,
  updatePrint,
} from "@/lib/prints";
import type { Print, PrintInput } from "@/types/print";

const PRINTS_KEY = ["prints"] as const;

export function usePrints() {
  return useQuery({ queryKey: PRINTS_KEY, queryFn: listPrints });
}

export function usePrintBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: [...PRINTS_KEY, "slug", slug],
    queryFn: () => getPrintBySlug(slug as string),
    enabled: Boolean(slug),
  });
}

export function useCreatePrint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PrintInput) => createPrint(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRINTS_KEY }),
  });
}

export function useUpdatePrint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PrintInput }) => updatePrint(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRINTS_KEY }),
  });
}

export function useDeletePrint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (print: Print) => deletePrint(print),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRINTS_KEY }),
  });
}
