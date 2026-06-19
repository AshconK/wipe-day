// app/Hero.tsx
type HeroProps = {
  title: string;
  subtitle?: string;
  image?: string; // optional path like "/scenes/hero.jpg"
};

export default function Hero({ title, subtitle, image }: HeroProps) {
  // When an image is set, layer a dark overlay over it so text stays readable.
  const style = image
    ? {
        backgroundImage: `linear-gradient(rgba(22,20,15,0.55), rgba(22,20,15,0.82)), url(${image})`,
      }
    : undefined;

  return (
    <header className="hero" style={style}>
      <div className="hero-inner">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        <div className="hero-accent" />
      </div>
    </header>
  );
}