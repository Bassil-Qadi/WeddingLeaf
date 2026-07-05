export function BackgroundGradient() {
    return (
      <>
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,#fdf6ea,transparent_60%)]" />
  
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
      </>
    );
  }