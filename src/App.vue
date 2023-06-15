<style>
#mymap {
  margin-top: 5%;
  margin-left: 10%;
  width: 90%;
  height: 90%;
}

#checkContainer {
  margin-top: 5%;
  margin-left: 10%;
  width: 70px;
  height: 70px;
}

#checkText {
  color: #000;
}
</style>
<template>
  <div id="mymap" ref="mapContainer"></div>
  <div id="checkContainer">
    <input type="checkbox" v-model="checkA" @click=""><span id="checkText">202306</span>
    <input type="checkbox" v-model="checkB"><span id="checkText">202307</span>
    <input type="checkbox" v-model="checkC"><span id="checkText">202308</span>
  </div>
</template>
<script setup>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as echarts from 'echarts';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted, ref } from 'vue';

const checkA = ref(true);
const checkB = ref(true);
const checkC = ref(true);
const mapContainer = ref(null);
let echart = echarts;

onMounted(() => {
  const Emap = L.tileLayer("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}.png", {
    id: 'EMAP',
  });
  const Photo2 = L.tileLayer("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}.png", {
    id: 'PHOTO2',
  });
  const baseMaps = {
    電子地圖: Emap,
    PHOTO2: Photo2,
  };

  var map = L.map(mapContainer.value, {
    center: [23.611, 120.768],
    zoom: 8,
    minZoom: 8,
    maxZoom: 15,
    layers: [Emap]
    //dragging: false
  });
  L.control.layers(baseMaps).addTo(map);

  markMap(map, 25.049020778409727, 121.5137793373914, "myEcharts1");
  markMap(map, 24.232068065379462, 120.51757552333311, "myEcharts2");
  markMap(map, 23.43566005981651, 121.4761326531655, "myEcharts3");
  markMap(map, 22.890224018493637, 120.53130844299105, "myEcharts4");
});

function initChart(int1, int2, int3, DOMID) {
  let chart = echart.init(document.getElementById(DOMID));
  // 把配置和数据放这里
  chart.setOption({
    xAxis: {
      type: 'category',
      data: [int1 + '%', int2 + '%', int3 + '%'],
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
        data: [int1, int2, int3],
        type: 'bar',
        itemStyle: {
          normal: {
            color: function (params) {
              var colorList = ['#ffc557', '#21c918', '#4169E1'];
              return colorList[params.dataIndex];
            }
          }
        }
      }
    ]
  });
}

function markMap(map, intx, inty, DOMID) {
  var cmark1 = L.marker([intx, inty], {
    icon: L.divIcon({
      className: 'leaflet-echart-icon',
      iconsize: [150, 140],
      iconAnchor: [70, 75],
      html: '<div id="' + DOMID + '" style="width:140px; height:180px; position:relatice;">'
    })
  }).addTo(map);

  const inta = Math.floor(Math.random() * 100);
  const intb = Math.floor(Math.random() * 100);
  const intc = Math.floor(Math.random() * 100);
  initChart(inta, intb, intc, DOMID);
}

</script>