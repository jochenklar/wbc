function initMap() {
    // add the map layer and center map
    map = new L.Map("localmap",{scrollWheelZoom: false});
    map.addLayer(new L.TileLayer(_tiles_url_local + '/{z}/{x}/{y}.png',_tiles_opt_local));
    map.setView(new L.LatLng(_lat, _lon), 15);

    var osmb = new OSMBuildings(map).loadData();

    var icon = L.icon({
        iconUrl: '/static/img/icons/gruen.png',
        iconSize:   [26, 45], // size of the icon width,height
        iconAnchor: [13, 45], // point of the icon which will correspond to marker's location
    });

    if (typeof(_polygon) !== 'undefined') {
        var polygonOptions = {
            weight: 3,
            color: '#de6a00',
            opacity: 1,
            fill: true,
            fillColor: '#de6a00',
            fillOpacity: 0.05
        };

        if (_polygontype === 'Polygon') {
            L.polygon(_polygon).setStyle(polygonOptions).addTo(map);
        } else if (_polygontype === 'MultiPolygon') {
            L.multiPolygon(_polygon).setStyle(polygonOptions).addTo(map);
        }
    }

    L.marker([_lat,_lon],{icon: icon}).addTo(map);
}

$(document).ready(function() {
    setTimeout('initMap()',100);
});
