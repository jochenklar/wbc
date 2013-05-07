var layers = {};

function initMap() {
	var map = new L.Map("map");

	var min = 11;
	var max = 17;
    var errorTile = "http://tiles.jochenklar.de/bbs/11/1102/671.png";
	var myTiles = "http://tiles.jochenklar.de/bbs/{z}/{x}/{y}.png";
    var osmCopyright = "Map data &copy; 2012 OpenStreetMap contributors";

	var myLayer = new L.TileLayer(myTiles, {
        minZoom:min,
        maxZoom: max,
        attribution: osmCopyright,
        zIndex:0,
        errorTileUrl: errorTile,
        reuseTiles:true
    });

	map.addLayer( myLayer );
	var center = new L.LatLng(52.51, 13.37628);
	map.setView(center, 11);
    
    $.each(verfahrensschritte, function(key, vs) {
        var layer = {}

        layer.iconUrl = staticUrl + vs.icon;
        layer.hoverIconUrl = staticUrl + vs.hoverIcon;

        layer.icon = L.icon({
            iconUrl: staticUrl + vs.icon,
            iconSize:     [26, 45], // size of the icon width,height    
            iconAnchor:   [13, 45], // point of the icon which will correspond to marker's location    
            popupAnchor:  [0, -46]  // point from which the popup should open relative to the iconAnchor
        });

        layer.layerGroup = L.layerGroup().addTo(map);

        layers[vs.pk] = layer;
        
        $('input[name=vs-'+vs.pk+']').click(function(){
            if(this.checked) {
                map.addLayer(layers[vs.pk].layerGroup);            
            } else { 
                map.removeLayer(layers[vs.pk].layerGroup);         
            }
        });
    });

    // bbps zu karte hinzufügen
    $.each(points, function(key, point){
        var marker = L.marker(
            [point.lat,point.lon],
            {icon: layers[point.vspk].icon}
        ); 

        marker.icon = layers[point.vspk].iconUrl;
        marker.hoverIcon = layers[point.vspk].hoverIconUrl;

        marker.on("mouseover", function(e) {
            e.target._icon.src = this.hoverIcon;
        }).on("mouseout", function(e) {
            e.target._icon.src = this.icon;
        });

        var popuptext = '<a href="/info/#'+ point.vspk + '" >' + verfahrensschritte[point.vspk].name + '</a>';
        popuptext += '<br>';
        popuptext += "Betrifft Gegend um: " + point.adresse;
        popuptext += '<br>';
        popuptext += "Verantwortlich: " + point.behoerde;
        popuptext += '<br>';
        popuptext += "Beteiligung möglich bis: " + point.ende;
        popuptext += '<br>';
        popuptext += '<a href="' + siteUrl + "projekte/" + point.projekt + '" >Details</a>';        
        marker.bindPopup(popuptext);
        marker.addTo(map);

        layers[point.vspk].layerGroup.addLayer(marker);
    }); 
    
    var greyIcon = L.icon({
        iconUrl: staticUrl + '/img/Baustellenschilder/klein/schild_grau_blass.png',    
        iconSize:     [26, 45], // size of the icon width,height    
        iconAnchor:   [13, 45], // point of the icon which will correspond to marker's location    
        popupAnchor:  [0, -46] // point from which the popup should open relative to the iconAnchor
	});   
    
    var oldMarker = new Array();
	var oldLayer = L.layerGroup(oldLayer);
    
    $.each(pointsOld, function(key,point){
        
        // marker für leaflet karte
        var marker = L.marker(
            [point.lat,point.lon],
            {icon: greyIcon}
        );        
        
        oldLayer.addLayer(marker)

        marker.pk = point.pk;
        
        var popuptext = '<a href="/info/#'+ point.vspk + '" >' + verfahrensschritte[point.vspk].name + '</a>';
        popuptext += '<br>';
        popuptext += "Betrifft Gegend um: " + point.adresse;
        popuptext += '<br>';
        popuptext += "Verantwortlich: " + point.behoerde;
        popuptext += '<br>';
        popuptext += "Beteiligung möglich bis: " + point.ende;
        popuptext += '<br>';
        popuptext += '<a href="' + siteUrl + "projekte/" + point.projekt + '" >Details</a>'; 
        marker.bindPopup(popuptext);        
        
        marker.on("mouseover", function(e) {
            e.target._icon.src = staticUrl + '/img/Baustellenschilder/klein/schild_grau.png';
        }).on("mouseout", function(e) {
            e.target._icon.src = staticUrl + '/img/Baustellenschilder/klein/schild_grau_blass.png';
        }); 
    
     });   
    
    $('input[name=old]').click(function(){
            if(this.checked) {
                map.addLayer(oldLayer);            
            } else { 
                map.removeLayer(oldLayer);         
            }
        });
    

    // button für sidebar zur leafletkarte hinzufügen
    html = '<div class="leaflet-control-zoom leaflet-control"><a class="leaflet-control-sidebar" href="#" id="sidebar-button"><i class="icon-chevron-left"></i></a></div>';
    $('.leaflet-top.leaflet-left').prepend(html);
    $('#sidebar-button').click(moveOutSidebar);
    $('#sidebar-button').attr('title','Sidebar ausblenden');
    $('.leaflet-control-zoom-in').attr('title','Hinein zoomen');
    $('.leaflet-control-zoom-out').attr('title','Heraus zoomen');

    // adjust height of sidebar
    $('#sidebar').height($('#liste').height() + 20);
    var bottom = $(window).height() - $('#sidebar').height() - 120;
    if (bottom < 0) {
        $('#sidebar').height($('#sidebar').height() + bottom);
    }
}

function moveOutSidebar(){
    $('#sidebar-button').unbind('click');
    $('#sidebar').animate(
        {left: '-=280'},
        'fast',
        function(){});
    $('.leaflet-top.leaflet-left').animate(
        {left: '-=280'},
        'fast',
        function(){
            $('#sidebar-button').click(moveInSidebar);
            $('i', '#sidebar-button').remove();
            $('#sidebar-button').append('<i class="icon-chevron-right"></i>');
	    $('#sidebar-button').attr('title','Sidebar einblenden');
       }
    );
    return false;
}

function moveInSidebar(){
    $('#sidebar-button').unbind('click');
    $('#sidebar').animate(
        {left: '+=280'},
        'fast',
        function(){});
    $('.leaflet-top.leaflet-left').animate(
        {left: '+=280'},
        'fast',
        function(){
            $('#sidebar-button').click(moveOutSidebar);
            $('i', '#sidebar-button').remove();
            $('#sidebar-button').append('<i class="icon-chevron-left"></i>');
	    $('#sidebar-button').attr('title','Sidebar einblenden');
        }
    );
    return false;
}

$(document).ready(function() {
    setTimeout('initMap()',100);
});
