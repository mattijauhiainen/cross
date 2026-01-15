export async function fetchEarthquakeData() {
  const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson');
  const data = await response.json();

  // Filter out small earthquakes. Data is from USGS and will be very biased for North
  // America if we consider all magnitudes.
  data.features = data.features.filter(earthquake => earthquake.properties.mag >= 4.0);

  return data;
}
