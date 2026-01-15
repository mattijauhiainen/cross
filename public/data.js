export async function fetchEarthquakeData() {
  try {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson');
    if (!response.ok) {
      throw new Error(`USGS API returned ${response.status}`);
    }
    const data = await response.json();

    // Filter out small earthquakes. Data is from USGS and will be very biased for North
    // America if we consider all magnitudes.
    data.features = data.features.filter(earthquake => earthquake.properties.mag >= 4.0);

    return data;
  } catch (error) {
    console.warn('USGS API unavailable, using sample data:', error.message);
    const response = await fetch('./sample.geojson');
    return await response.json();
  }
}
