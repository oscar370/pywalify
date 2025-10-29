export async function loadAndCleanSVG(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load SVG: ${url}`);
  const svg = await res.text();
  return svg.replace(/fill="[^"]*"/g, 'fill="currentColor"');
}
