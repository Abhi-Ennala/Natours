/* eslint-disable */


export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoic2hpbi1kZXYiLCJhIjoiY21oYTFjZXZtMDBwNDJscTBlNmxwN2FnayJ9.1uuosgQL1sLhgdLpHn3zoQ';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/shin-dev/cmha2x9qe001e01qt95a56rjv',
    scrollZoom: false
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create Marker

    const el = document.createElement('div');
    el.className = 'marker';

    // Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add Popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extends map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
