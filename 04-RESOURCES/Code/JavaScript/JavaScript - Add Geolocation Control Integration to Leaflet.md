---
creation_date: 2026-07-02
modification_date: 2026-07-03T10:43:05-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: JavaScript - Add Geolocation Control Integration to Leaflet
tags:
  - Type/Code
  - Status/Complete
  - Topic/JavaScript
  - Topic/Development
  - Topic/Geospatial
aliases:
  - Add Geolocation Control Integration to Leaflet
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!INFO] JavaScript
> **Language**: JavaScript
> **Dependencies**: *None*

> [!SOURCE] Sources
> - *Source URL or reference*

**Add Geolocation Control Integration to Leaflet** ...

## Code

```javascript
/**
 * GPS Control Integration with Layer Tracking
 *
 * This script handles GPS events from leaflet.extras GPS control and integrates
 * them with the landrise.geo layer tracking system.
 *
 * Events handled:
 * - gps:located: When GPS finds user location
 * - gps:disabled: When GPS is turned off
 *
 * Shiny inputs created (when in Shiny context):
 * - gps_located: Custom event with enhanced location data
 * - gps_disabled: Custom event when GPS is disabled
 *
 * Integration with leaflet.extras GPS control events that follow the pattern:
 * - {mapId}_gps_located: Standard leaflet.extras event
 * - {mapId}_gps_disabled: Standard leaflet.extras event
 *
 * Also works in standalone HTML documents without Shiny.
 */

// Main function to initialize GPS control integration
function initializeGpsControl(map, mapId) {

  // Listen for GPS events from leaflet.extras gps control
  map.on('gps:located', function (e) {
    // Remove any existing user location markers
    map.eachLayer(function (layer) {
      if (layer.options && layer.options.group === 'User Location') {
        map.removeLayer(layer);
      }
    });

    // Add user location marker
    var userIcon = L.AwesomeMarkers.icon({
      icon: 'user',
      markerColor: 'green',
      iconColor: 'white',
      prefix: 'fa'
    });

    var marker = L.marker([e.latlng.lat, e.latlng.lng], {
      icon: userIcon,
      group: 'User Location'
    }).addTo(map);

    marker.bindPopup('Your current location');

    // Trigger events for different contexts
    var locationData = {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      coordinates: e.latlng,
      radius: e.marker ? e.marker._radius : null,
      timestamp: Date.now()
    };

    // Shiny context - trigger input events
    if (typeof window !== 'undefined' && window.Shiny && window.Shiny.setInputValue) {
      window.Shiny.setInputValue('gps_located', locationData);
    }

    // Browser context - dispatch custom event
    if (typeof window !== 'undefined' && window.document) {
      var customEvent = new CustomEvent('landrise:gps:located', {
        detail: locationData,
        bubbles: true
      });
      window.document.dispatchEvent(customEvent);
    }

    // Console log for debugging in any context
    if (typeof console !== 'undefined' && console.log) {
      console.log('GPS Located:', locationData);
    }
  });

  map.on('gps:disabled', function (e) {
    // Remove user location markers when GPS is disabled
    map.eachLayer(function (layer) {
      if (layer.options && layer.options.group === 'User Location') {
        map.removeLayer(layer);
      }
    });

    var disabledData = {
      timestamp: Date.now()
    };

    // Shiny context - trigger input events
    if (typeof window !== 'undefined' && window.Shiny && window.Shiny.setInputValue) {
      window.Shiny.setInputValue('gps_disabled', disabledData);
    }

    // Browser context - dispatch custom event
    if (typeof window !== 'undefined' && window.document) {
      var customEvent = new CustomEvent('landrise:gps:disabled', {
        detail: disabledData,
        bubbles: true
      });
      window.document.dispatchEvent(customEvent);
    }

    // Console log for debugging in any context
    if (typeof console !== 'undefined' && console.log) {
      console.log('GPS Disabled:', disabledData);
    }
  });
}

// Function for htmlwidgets onRender callback
function geolocateControlOnRender(el, x) {
  var map = this;
  var mapId = el.id || 'map';

  initializeGpsControl(map, mapId);
}

// Function for manual initialization (non-Shiny contexts)
function addGpsEventHandlers(map, mapId) {
  mapId = mapId || 'map';
  initializeGpsControl(map, mapId);

  // Return object with event listener management for manual cleanup if needed
  return {
    map: map,
    mapId: mapId,
    cleanup: function() {
      // Remove event listeners if needed
      map.off('gps:located');
      map.off('gps:disabled');
    }
  };
}

```

## Usage

```javascript

```

## Notes

***

## Appendix

*Note created on [[2026-07-02]] and last modified on [[2026-07-02]].*

### See Also

- [[MOC - Development]]

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
