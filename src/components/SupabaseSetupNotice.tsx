const SupabaseSetupNotice = () => (
  <div className="min-h-screen flex items-center justify-center bg-background px-6">
    <div className="max-w-md text-center space-y-3">
      <h1 className="text-xl font-medium">Supabase isn't configured yet</h1>
      <p className="text-sm text-muted-foreground">
        Copy <code className="px-1 rounded bg-muted">.env.example</code> to{" "}
        <code className="px-1 rounded bg-muted">.env</code>, fill in your Supabase project URL and
        publishable key, then restart the dev server.
      </p>
    </div>
  </div>
);

export default SupabaseSetupNotice;
