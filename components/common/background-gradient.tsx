export function BackgroundGradient() {
  return (
    <>
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,#fdf6ea,transparent_60%)] dark:bg-[radial-gradient(circle_at_top,#26221a,transparent_60%)]" />

      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
      <div className="absolute -bottom-32 -start-32 -z-10 h-[380px] w-[380px] rounded-full bg-secondary/10 blur-[120px]" />
      <div className="absolute -bottom-24 -end-24 -z-10 h-[320px] w-[320px] rounded-full bg-accent/10 blur-[120px]" />
    </>
  );
}
