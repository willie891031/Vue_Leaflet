<style>
.map {
  margin-top: 10px;
  margin-left: 10px;
  height: 90%;
}

#checkContainer {
  margin-top: 10px;
  margin-left: 20px;
  width: 100px;
}

#checkText {
  color: #000;
}
</style>
<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap";
</script>

<template>
  <div id="mymap" ref="mapContainer" class="col-5 map"></div>
  <div id="mymap2" ref="mapContainer2" class="col-5 map"></div>
  <div id="checkContainer" class="col-1">
    <input type="checkbox" v-model="check1" @click="updateEchart()"><span id="checkText">202306</span>
    <input type="checkbox" v-model="check2" @click="updateEchart()"><span id="checkText">202307</span>
    <input type="checkbox" v-model="check3" @click="updateEchart()"><span id="checkText">202308</span>
    <button @click="position()">定位</button>
    <button @click="fullmap()">全圖</button>
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
const check1 = ref(true);
const check2 = ref(true);
const check3 = ref(true);
const mapContainer = ref(null);
const mapContainer2 = ref(null);
let echart = echarts;
var mymap;
var mymap2;
onMounted(() => {
  const Emap = L.tileLayer("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}.png", {
    id: 'EMAP',
  });
  const Photo2 = L.tileLayer("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}.png", {
    id: 'PHOTO2',
  });

  const baseMaps = {
    電子地圖: Emap,
    正射影像圖: Photo2,
  };
  const baseMaps2 = {
    電子地圖: Emap,
    正射影像圖: Photo2,
  };

  mymap = L.map(mapContainer.value, {
    center: [23.611, 120.768],
    zoom: 8,
    minZoom: 8,
    maxZoom: 18,
    layers: [Emap],
    zoomControl: false
  });
  L.control.layers(baseMaps).addTo(mymap);

  mymap2 = L.map(mapContainer2.value, {
    center: [23.611, 120.768],
    zoom: 8,
    minZoom: 8,
    maxZoom: 18,
    layers: [Photo2],
    zoomControl: false
  });
  L.control.layers(baseMaps2).addTo(mymap2);
  mymap.sync(mymap2);
  mymap2.sync(mymap);

  
  markMap(25.049020778409727, 121.5137793373914, "myEcharts1");
  markMap(24.232068065379462, 120.51757552333311, "myEcharts2");
  markMap(23.43566005981651, 121.4761326531655, "myEcharts3");
  markMap(22.890224018493637, 120.53130844299105, "myEcharts4");
});

function initChart(int1, int2, int3, DOMID, Enum) {
  let chart = echart.init(document.getElementById(DOMID));
  let Xdata = [int1 + '%', int2 + '%', int3 + '%'];
  let Ydata = [int1, int2, int3];
  const color1 = '#ffc557'; const color2 = '#21c918'; const color3 = '#4169E1';
  let colorD = [color1, color2, color3];
  if (Enum == 2) {
    if (int1 != null && int2 != null) {
      Xdata = [int1 + '%', int2 + '%'];
      Ydata = [int1, int2];
      colorD = [color1, color2];
    }
    else if (int1 != null && int3 != null) {
      Xdata = [int1 + '%', int3 + '%'];
      Ydata = [int1, int3];
      colorD = [color1, color3];
    }
    else if (int2 != null && int3 != null) {
      Xdata = [int2 + '%', int3 + '%'];
      Ydata = [int2, int3];
      colorD = [color2, color3];
    }
  }
  else if (Enum == 1) {
    if (int1 != null) { Xdata = [int1 + '%']; Ydata = [int1]; colorD = [color1]; }
    if (int2 != null) { Xdata = [int2 + '%']; Ydata = [int2]; colorD = [color2]; }
    if (int3 != null) { Xdata = [int3 + '%']; Ydata = [int3]; colorD = [color3]; }
  } else if (Enum == 0) {
    Xdata = []; Ydata = []; colorD = [];;
  }
  // 把配置和数据放这里
  chart.setOption({
    xAxis: {
      type: 'category',
      data: Xdata,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      show: false
    },
    series: [
      {
        data: Ydata,
        type: 'bar',
        itemStyle: {
          normal: {
            color: function (params) {
              var colorList = colorD;
              return colorList[params.dataIndex];
            }
          }
        }
      }
    ]
  });
}

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
</script>