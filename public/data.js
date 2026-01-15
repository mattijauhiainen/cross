export async function fetchEarthquakeData() {
  const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson');
  return await response.json();
}
