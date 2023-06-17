<style>
.map {
  margin-top: 10px;
  margin-left: 10px;
  height: 90%;
}

#checkContainer {
  margin-top: 10px;
  margin-left: 20px;
  width: 150px;
}

#checkText {
  color: #000;
}

#mapchangeblock {
  border: #000;
  border-radius: 5px;
  border-style: groove;
  height: auto;
  width: 100px;
}

.zoomBtn {
  width: 30px;
  height: 30px;
}
</style>
<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap";
</script>

<template>
  <div id="mymap" ref="mapContainer" class="col-4 map"></div>
  <div id="mymap2" ref="mapContainer2" class="col-4 map"></div>
  <div id="checkContainer" class="col-2">
    <input type="checkbox" v-model="check1"><span id="checkText">202306</span><br>
    <input type="checkbox" v-model="check2"><span id="checkText">202307</span><br>
    <input type="checkbox" v-model="check3"><span id="checkText">202308</span><br>
    <input type="checkbox" v-model="mapCity"><span id="checkText">縣市界</span><br>
    <input type="checkbox" v-model="mapStore"><span id="checkText">超商</span><br>
    <button class="zoomBtn" @click="zoomIn()">+</button><br>
    <button class="zoomBtn" @click="zoomOut()">-</button><br>
    <button @click="position()">定位</button><br>
    <button @click="fullmap()">全圖</button><br>
    <button @click="rmMarker()">刪除標記</button>
    <div id="mapchangeblock">
      底圖切換1<br>
      <input type="radio" name="maplayer" @click="removemap" v-model="mapchange" value="EMAP">電子地圖
      <input type="radio" name="maplayer" @click="removemap" v-model="mapchange" value="PHOTO2">正攝影像
      <input type="radio" name="maplayer" @click="removemap" v-model="mapchange" value="EMAP96">高DPI地圖
    </div>
    <div id="mapchangeblock">
      底圖切換2<br>
      <input type="radio" name="maplayer2" @click="removemap2" v-model="mapchange2" value="EMAP">電子地圖
      <input type="radio" name="maplayer2" @click="removemap2" v-model="mapchange2" value="PHOTO2">正攝影像
      <input type="radio" name="maplayer2" @click="removemap2" v-model="mapchange2" value="EMAP96">高DPI地圖
    </div>
  </div>
</template>

<script setup>
//import L, { map } from "leaflet";
import "leaflet/dist/leaflet.css";
import * as echarts from 'echarts';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted, ref, watch } from 'vue';
import axios from "axios"
const check1 = ref(true);
const check2 = ref(true);
const check3 = ref(true);
const mapCity = ref(false);
const mapStore = ref(false);
const mapchange = ref("EMAP");
const mapchange2 = ref("PHOTO2");
const mapContainer = ref(null);
const mapContainer2 = ref(null);
let echart = echarts;
let baseMaps = null;
let marker = null;
let markerList = [];
var mymap;
var mymap2;
const Emap = L.tileLayer("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}.png", {
  id: 'EMAP',
  zIndex: 0
});
const Photo2 = L.tileLayer("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}.png", {
  id: 'PHOTO2',
  zIndex: 0
});
const Emap96 = L.tileLayer("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}.png", {
  id: 'EMAP96',
  zIndex: 0
});
const CITY = L.tileLayer("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}.png", {
  id: 'CITY',
});
const TOWN = L.tileLayer("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}.png", {
  id: 'TOWN',
});
const CStore = L.tileLayer("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}.png", {
  id: 'ConvenienceStore',
});
onMounted(() => {
  baseMaps = {
    "EMAP": L.tileLayer("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}.png", {
      id: 'EMAP',
      zIndex: 0
    }),
    "PHOTO2": L.tileLayer("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}.png", {
      id: 'PHOTO2',
      zIndex: 0
    }),
    "EMAP96": L.tileLayer("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}.png", {
      id: 'EMAP96',
      zIndex: 0
    })
  };

  mymap = L.map(mapContainer.value, {
    center: [23.611, 120.768],
    zoom: 8,
    minZoom: 8,
    maxZoom: 18,
    layers: [Emap],
    zoomControl: false,
    attributionControl: false
  });

  mymap2 = L.map(mapContainer2.value, {
    center: [23.611, 120.768],
    zoom: 8,
    minZoom: 8,
    maxZoom: 18,
    layers: [Photo2],
    zoomControl: false,
    attributionControl: false
  });

  mymap.sync(mymap2);
  mymap2.sync(mymap);
  mymap.on('click', onMapClick);

  markMap(25.049020778409727, 121.5137793373914, "myEcharts1");
  markMap(24.232068065379462, 120.51757552333311, "myEcharts2");
  markMap(23.43566005981651, 121.4761326531655, "myEcharts3");
  markMap(22.890224018493637, 120.53130844299105, "myEcharts4");
});

// function initChart(int1, int2, int3, DOMID, Enum) {
//   let chart = echart.init(document.getElementById(DOMID));
//   let Xdata = [int1 + '%', int2 + '%', int3 + '%'];
//   let Ydata = [int1, int2, int3];
//   const color1 = '#ffc557'; const color2 = '#21c918'; const color3 = '#4169E1';
//   let colorD = [color1, color2, color3];
//   if (Enum == 2) {
//     if (int1 != null && int2 != null) {
//       Xdata = [int1 + '%', int2 + '%'];
//       Ydata = [int1, int2];
//       colorD = [color1, color2];
//     }
//     else if (int1 != null && int3 != null) {
//       Xdata = [int1 + '%', int3 + '%'];
//       Ydata = [int1, int3];
//       colorD = [color1, color3];
//     }
//     else if (int2 != null && int3 != null) {
//       Xdata = [int2 + '%', int3 + '%'];
//       Ydata = [int2, int3];
//       colorD = [color2, color3];
//     }
//   }
//   else if (Enum == 1) {
//     if (int1 != null) { Xdata = [int1 + '%']; Ydata = [int1]; colorD = [color1]; }
//     if (int2 != null) { Xdata = [int2 + '%']; Ydata = [int2]; colorD = [color2]; }
//     if (int3 != null) { Xdata = [int3 + '%']; Ydata = [int3]; colorD = [color3]; }
//   } else if (Enum == 0) {
//     Xdata = []; Ydata = []; colorD = [];;
//   }
//   // 把配置和数据放这里
//   chart.setOption({
//     xAxis: {
//       type: 'category',
//       data: Xdata,
//       axisLine: {
//         show: false
//       },
//       axisTick: {
//         show: false
//       }
//     },
//     yAxis: {
//       show: false
//     },
//     series: [
//       {
//         data: Ydata,
//         type: 'bar',
//         itemStyle: {
//           normal: {
//             color: function (params) {
//               var colorList = colorD;
//               return colorList[params.dataIndex];
//             }
//           }
//         }
//       }
//     ]
//   });
// }

function markMap(intx, inty, DOMID) {
  var cmark1 = L.marker([intx, inty], {
    icon: L.divIcon({
      className: 'leaflet-echart-icon',
      iconsize: [150, 140],
      iconAnchor: [70, 75],
      html: '<div id="' + DOMID + '" style="width:140px; height:180px; position:relatice;">'
    })
  }).addTo(mymap);

  const inta = Math.floor(Math.random() * 100);
  const intb = Math.floor(Math.random() * 100);
  const intc = Math.floor(Math.random() * 100);
  initChart(inta, intb, intc, DOMID, 3);
}

function position() {
  //定義Icon
  const customIcon = L.icon({
    iconUrl: 'https://letswritetw.github.io/letswrite-leaflet-osm-locate/dist/dot.svg',
    iconSize: [16, 16],
  });

  mymap.locate({
    setView: true, // 是否讓地圖跟著移動中心點
    watch: false, // 是否要一直監測使用者位置
    enableHighAccuracy: true, // 是否要高精準度的抓位置
    timeout: 10000 // 觸發locationerror事件之前等待的毫秒數
  });
  function foundHandler(e) {
    L.marker(e.latlng, {
      icon: customIcon,
      opacity: 1.0
    }).addTo(mymap);
    mymap.setView(e.latlng, 14);
  }
}

function fullmap() {
  mymap.setView([23.611, 120.768], 8);
}

//更新Echarts
watch(() => [check1.value, check2.value, check3.value], () => {
  updateEchart();
})
function updateEchart() {
  for (let i = 1; i <= 4; i++) {
    let Enum = 3;
    const DOMID = 'myEcharts' + i;
    let int1 = Math.floor(Math.random() * 100);
    let int2 = Math.floor(Math.random() * 100);
    let int3 = Math.floor(Math.random() * 100);
    if (check1.value == false) { int1 = null; Enum -= 1; }
    if (check2.value == false) { int2 = null; Enum -= 1; }
    if (check3.value == false) { int3 = null; Enum -= 1; }
    initChart(int1, int2, int3, DOMID, Enum);
  }
}
//圖層套疊
watch(() => [mapCity.value], () => {
  if (mapCity.value == true) {
    mymap.addLayer(CITY);
    mymap2.addLayer(CITY);
  }
  else {
    mymap.removeLayer(CITY);
    mymap2.removeLayer(CITY);
  }
})
watch(() => [mapStore.value], () => {
  if (mapStore.value == true) {
    mymap.addLayer(CStore);
    mymap2.addLayer(CStore);
  }
  else {
    mymap.removeLayer(CStore);
    mymap2.removeLayer(CStore);
  }
})
//底圖切換
function removemap() {
  baseMaps[mapchange.value].removeFrom(mymap);
}
watch(() => [mapchange.value], () => {
  baseMaps[mapchange.value].addTo(mymap);
});
function removemap2() {
  baseMaps[mapchange2.value].removeFrom(mymap2);
}
watch(() => [mapchange2.value], () => {
  baseMaps[mapchange2.value].addTo(mymap2);
});
//放大縮小
function zoomIn() {
  const center = mymap.getCenter();
  const zoom = mymap.getZoom() + 1;
  mymap.setView(center, zoom);
}
function zoomOut() {
  const center = mymap.getCenter();
  const zoom = mymap.getZoom() - 1;
  mymap.setView(center, zoom);
}
//點擊地圖取座標並查詢地段位置
function onMapClick(e) {
  mymap.setView(e.latlng, 18);
  const url = "https://api.nlsc.gov.tw/other/TownVillagePointQuery/" + e.latlng.lng + "/" + e.latlng.lat + "/4326";
  console.log(url);
  axios.get(url)
    .then((response) => {
      var rs = response.data;
      marker = new L.marker(e.latlng, {
        title: 'Position'
      }).addTo(mymap).bindPopup("<b>"+rs.ctyName+rs.townName+"</b><br>"+rs.villageName+rs.sectName).openPopup();
      markerList.push(marker);
    })
}
//刪除標記
function rmMarker() {
  markerList.forEach(item => {
    mymap.removeLayer(item);
  });
}
</script>