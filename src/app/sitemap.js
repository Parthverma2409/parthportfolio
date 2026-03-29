export default function sitemap() {
  const baseUrl = "https://parthverma.dev";

  const routes = ["", "/about", "/skills", "/projects", "/contact"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
