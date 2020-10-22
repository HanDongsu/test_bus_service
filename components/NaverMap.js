import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from "react-redux";
import { compose } from "recompose";

// 체크박스 묶음
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import { loadMapData } from "../lib/navermap/actions";
// import request from "../lib/request";
// 셀렉트박스
// import FormControl from '@material-ui/core/FormControl';
// import InputLabel from '@material-ui/core/InputLabel';
// import NativeSelect from '@material-ui/core/NativeSelect';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
  naverMapRoot: {
    width: "33%",
    paddingRight: 10,
  },
  navermap: {
    // minWidth: 484,
    // minHeight: 450,
    width: '100%',
    height: '100%',
    // marginLeft: 20,
    // marginRight: 20,
    // margin: 10,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 80,
    Height: 20,
    padding: 0,
    // margin: 0,
  },
  nav: {
    backgroundColor: "#ffffff",
    height: 34,
    display: "flex",
    boxShadow: 'none',
    borderTop: "1px solid #e4e8ee",
    // borderBottom: "1px solid #edf1f5",
  },
  // 커스텀 셀렉트 박스 만들기 
  selectBox: {
    margin: 5,
    marginLeft: 20,
    width: 100,
    height: 24,
    border: "1px solid #d0d1d5", // 테두리
    backgroundColor: "#ffffff",
    background: "url(/static/selectbox.png)",  /* 화살표 모양의 이미지 */
    backgroundPosition: '90% 50%',
    backgroundSize: '8% 20%',
    backgroundRepeat: 'no-repeat',
    appearance: 'none',  // 화살표 삭제
    borderRadius: 0, // 둥근 테두리 제거
    paddingLeft: 9,
  },
  navInfoText: {
    position: "relative",
    top: "20%",
    height: 17,
    paddingRight: 11,
    marginLeft: 9,
    fontFamily: "NotoSansCJKkr",
    fontSize: 13,
    fontWeight: "normal",
    fontStretch: "normal",
    fontStyle: "normal",
    // lineHeight: 1.15,
    letterSpacing: "normal",
    textAlign: "left",
    color: "#212121",
  },
  formGroup: {
    height: 34,
  },
  formControlLabel: {
    height: 34,
  },
}));
const NaverMap = param => {
  const classes = useStyles();
  const [bus, setBus] = useState('1');
  const [loading, setLoading] = useState(false);
  
  // console.log("줌,센터좌표 다시 설정");
  const [naverMapZoom, setNaverMapZoom] = useState(15);
  const [naverMapCenterX, setNaverMapCenterX] = useState(127.2408058);
  const [naverMapCenterY, setNaverMapCenterY] = useState(36.5143847);
  
  //TEST - hds
  const [stationName, setStationName] = useState('관정리경로당경로당');
  const [stationAddr, setStationAddr] = useState('세종특별자치시 전의면 대추리길42');
  const [markerInfo, setMarkerInfo] = useState('');
  const [test, setTest] = useState(0);
  const [currentStart, setCurrentStart] = useState('');
  const [currentArrival, setCurrentArrival] = useState('');
  const [loadDrtStation, setLoadDrtStation] = useState([]);
  const [startStationCheck, setStartStationCheck] = useState('');
  const [arrivalStationCheck, setArrivalStationCheck] = useState('');

  const [paramDrtStation, setParamDrtStation] = useState('');
  
  const [state, setState] = React.useState({
    checkedBooker: true,
    checkedDrt: true,
    checkedSj: false,
    bus1: true,
    bus2: false,
    bus3: false,
  });

  // 지도 체크박스 
  const handleCheckBox = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  // 지도 셀렉트박스 ( 차량선택 )
  const handleSelectBox = event => {
    setBus(event.target.value);
  };


  
  useEffect(() => {
    // param.mapLoad();
    // getData();
  },[]);
  // 실제 네이버맵 로딩을 하는 부분
  useEffect(() => {
    // param.mapLoad();
    // async function getData() {
    //   await 
    // };
    // getData();
    console.log('param.drtStation');
    console.log(param.drtstaion);
    setLoading(true);
    if(!param.drtstaion) {
      param.mapLoad();
    } else {

    
    console.log("UseEffect NaverMap!");

    // 세종시 지도 영역 제한
    var sejongsi = new naver.maps.LatLngBounds(
        new naver.maps.LatLng(36.4127755, 127.1255566),
        new naver.maps.LatLng(36.5860935, 127.398155));
    
    // 네이버 맵 CORE
    var map = new N.Map('map', {
      center: new N.LatLng(naverMapCenterY,naverMapCenterX),
      //center: new N.LatLng(36.5143847,127.2408058),
      mapTypeId: N.MapTypeId.NORMAL,
      scaleControl: true,
      useStyleMap: true,
      logoControl: false,
      mapDataControl: true,
      mapTypeControl: true,
      maxBounds: sejongsi,
      minZoom: 11,
      maxZoom: 18,
      zoomControlOptions: {
        // style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_LEFT
        },
      zoomControl: true,
      zoom: naverMapZoom,
    });

        /* 변경점 */
        // naver.maps.Event.once(map, 'init_stylemap', function () {
        //   console.log('올바른 참조 시점', map.getOptions('minZoom') === 15);
        // });

        // 지도 줌 변화 감지 리스너
        // naver.maps.Event.addListener(map, 'zoom_changed', function() {
        //     //console.log(naverMapZoom);
        //     setNaverMapZoom(map.getZoom());
        // });
        // 지도 좌표(센터좌표) 변화 감지 리스너
        // naver.maps.Event.addListener(map, 'center_changed', function() {
        //   //console.log(map.getCenter().y);
        //   //console.log(map.getCenter().x);
        //   setNaverMapCenterY(map.getCenter().y);
        //   setNaverMapCenterX(map.getCenter().x);
        // });

        // 지도의 움직임이 멈추면 이벤트 실행. 
        naver.maps.Event.addListener(map, 'idle', function() {
          setNaverMapCenterY(map.getCenter().y);
          setNaverMapCenterX(map.getCenter().x);
          setNaverMapZoom(map.getZoom());
        });
        
        // naver.maps.Event.addListener(map, 'bounds_changed', function() {
        //   setNaverMapZoom(map.getOptions("zoom"));
        //   setNaverMapCenterY(map.getOptions("center").x);
        //   setNaverMapCenterX(map.getOptions("center").y);
        //   console.log(map.getCenterPoint());
        //   console.log(naverMapCenterX,naverMapCenterY);
        //   // console.log(naverMapZoom);
        // });

        // 운행버스 1
        if(bus == 1){
          var marker = new N.Marker({
            position: new N.LatLng(36.5138458,127.2368583),
            // animation: naver.maps.Animation.BOUNCE,   // DROP, BOUNCE
                      icon: {
                        url: "/static/mapicon/drt_bus.png",
                        scaledSize: new naver.maps.Size(25, 25),
                        origin: new naver.maps.Point(0, 0),
                    },
            map: map,
          });
        }
        // 운행버스 2
        if(bus == 2){
          var marker = new N.Marker({
            position: new N.LatLng(36.5119422,127.2454012),
            // animation: naver.maps.Animation.BOUNCE,   // DROP, BOUNCE
                      icon: {
                        url: "/static/mapicon/bus.png",
                        scaledSize: new naver.maps.Size(25, 25),
                        origin: new naver.maps.Point(0, 0),
                    },
            map: map,
          });
        }
        // 운행버스 3
        if(bus == 3){
          var marker = new N.Marker({
            position: new N.LatLng(36.5207352, 127.2334895),
            // animation: naver.maps.Animation.BOUNCE,   // DROP, BOUNCE
                      icon: {
                        url: "/static/mapicon/drt_bus.png",
                        scaledSize: new naver.maps.Size(25, 25),
                        origin: new naver.maps.Point(0, 0),
                        // anchor: new naver.maps.Point(12, 34)
                    },
            map: map,
          });
        }
        // 세종과학예술 영재학교 , 세종국제고
        // var marker = new N.Marker({
        //   position: new N.LatLng(36.5216931,127.247978),
        //   map: map
        // });

        // 두루초등학교
        // var marker = new N.Marker({
        //   position: new N.LatLng(36.519585,127.2391428),
        //   map: map
        // });

        // 클릭시 마커
        // naver.maps.Event.addListener(map, 'click', function(e) {
        //   marker.setPosition(e.latlng);
        // });

        // 은빛초등학교 : 36.5146098,127.2394647
        // 고운고등학교 : 36.5106518,127.2336819
        // 고운중학교 : 36.5059218, 127.2379841

        var booker = [
          // // 온빛초등학교 건너편
          // new naver.maps.LatLng(36.5151521,127.2409399),
          // new naver.maps.LatLng(36.5133595,127.2458269),
        ];

        var drtStation = [
          // 아름 중.고등학교
      
          // // 세종과학예술 영재학교 , 세종국제고
          // new naver.maps.LatLng(36.5216931,127.247978),
          // // 두루초등학교
          // new naver.maps.LatLng(36.519585,127.2391428),
        ];

        var sjStation = [
          // // 은빛초등학교
          // new naver.maps.LatLng(36.5146098,127.2394647),
          // // 고운고등학교
          // new naver.maps.LatLng(36.5106518,127.2336819),
          // // 고운중학교
          // new naver.maps.LatLng(36.5059218, 127.2379841),
        ];
        var testMarker = [
          new naver.maps.LatLng(36.52667640239135,127.22349715742358), //0
          new naver.maps.LatLng(36.52408786176048,127.22638863495403), //1
          new naver.maps.LatLng(36.51774129268074,127.2221419662466), //2
          new naver.maps.LatLng(36.50916442752946,127.21809811756216), //3
          new naver.maps.LatLng(36.50925329319984,127.21736207008192), //4
          new naver.maps.LatLng(36.50929772689496,127.21704265309171), //5
          new naver.maps.LatLng(36.51025040297424,127.21747314415819), //6
          new naver.maps.LatLng(36.5101420969088,127.21831196072212), //7
          new naver.maps.LatLng(36.50708965787925,127.21766210189288), //8
          new naver.maps.LatLng(36.502553982391994,127.2128682106608), //9
          new naver.maps.LatLng(36.50089857826325,127.21069067316665), //10
          new naver.maps.LatLng(36.498076609298394,127.20670221866813), //11
          new naver.maps.LatLng(36.498209924537164,127.20654389592436), //12
          new naver.maps.LatLng(36.4983904560898,127.20635779661455), //13
          new naver.maps.LatLng(36.4986154287065,127.20626890959976), //14
          new naver.maps.LatLng(36.49818768105302,127.20519679516964), //15
          new naver.maps.LatLng(36.49830710865267,127.20501903010282), //16
          new naver.maps.LatLng(36.51755500401773,127.22224283739907), //17
          new naver.maps.LatLng(36.50946960461256,127.2173945375269), //18
          new naver.maps.LatLng(36.50254030512018,127.21289723764107), //19
          new naver.maps.LatLng(36.49819950541735,127.20654813776055), //20
        ]

//TEST - hds
        var drt_station_name = [
          // "아름중.고교",
          "세종과학예술 영재학교",
          "두루초등학교",
        ]
        var bus_station_name = [
          "은빛초등학교",
          "고운고등학교",
          "고운중학교",
        ]     
        var start = [
          "온빛초등학교 건너편",
          "아름중.고교"
        ];
        var start_info = [
          "drt",
          "bus",
        ];
        var start_t = [
          "13:30",
          "15:53"
        ];
        var arrive = [
          "세종과학예술 영재학교",
          "고운중학교"
        ];
        var arrive_info = [
          "drt",
          "drt"
        ];
        var arrive_t = [
          "13:50",
          "16:10"
        ];
        var client_name = [
          "김두루",
          "박고운"
        ];
        var board_count = [
          "3",
          "6",
        ];
        var client_phone = [
          "010-1245-7896",
          "011-1593-7946",
        ];
        var route = [
          [
            ["36.502305","127.2050063"],
            ["36.5127748","127.2059634"],
            ["36.5206564","127.2122201"],
            ["36.4981984","127.2065485"],
            ["36.499055","127.2059643"]
          ],
        ];

        var routeStations = [
            {
              "start" : {"lat":"36.526448"  , "lng":"127.2233158", "id": "12345678"},
              // "station1" :{"lat":"36.5025392" , "lng":"127.2128976"},
              "stations" :[
                            {"lat":"36.5175539" , "lng":"127.2222432", "id": "11114444"}, // 1
                            {"lat":"36.5094685" , "lng":"127.2173949", "id": "12341234"}, // 2
                            {"lat":"36.5025392" , "lng":"127.2128976", "id": "65432187"}, // 3
                            {"lat":"36.4981984" , "lng":"127.2065485", "id": "22222666"}, // 4
                          ],
              // "station5" :{"lat":"36.499055" , "lng":"127.2059643"},
              "arrival" :{"lat":"36.499055" , "lng":"127.2059643", "id": "88855544"}
            }
        ];


      
      var markerList = [];
      var markerInfoList = [];

      // 예약고객 마커 찍기
      // if(state.checkedBooker){
      //   for (var i=0, ii=booker.length; i<ii; i++) {
      //       var marker = new naver.maps.Marker({
      //               position: booker[i],
      //               map: map,
      //               // animation: naver.maps.Animation.BOUNCE,   // DROP, BOUNCE
      //               icon: {
      //                 url: "/static/mapicon/people.png",
      //                 scaledSize: new naver.maps.Size(25, 25),
      //                 origin: new naver.maps.Point(0, 0),
      //                 // size: new naver.maps.Size(50, 52),
      //                 // anchor: new naver.maps.Point(25, 26)
      //             }
      //             //  icon: icon
      //           });
      //       marker.set('seq', i);
      //       markerList.push(marker);

      //       var markerInfo = new naver.maps.InfoWindow({
      //         content: bookerInfoWindow(client_name[i], board_count[i], client_phone[i], start[i], start_info[i], start_t[i], arrive[i], arrive_info[i], arrive_t[i]),
      //         disableAnchor: false, //기본 말풍선 꼬리의 사용 여부(false : 사용,  true : 미사용, defautl : false)
      //         // maxWidth: 200, //정보 창의 최대 너비
      //         backgroundColor: '#fff', // 정보 창의 배경색(default : #fff)
      //         borderColor: '#fff', //정보 창의 테두리 색상(default : #333)
      //         borderWidth: 0, //정보 창 테두리 두께(default : 1)
      //         pixelOffset: new naver.maps.Point(0,-5), //마커와 정보 창간 거리
      //         anchorSize: new naver.maps.Size(20, 10),// 말풍선 꼬리 사이즈(width, height)
      //       });
      //       markerInfoList.push(markerInfo);
      //       // marker.addListener('mouseover', onMouseOver);
      //       // marker.addListener('mouseout', onMouseOut);
      //       // icon = null;
      //       marker = null;
      //   }
      // }
      // 두루타 정류소 마커 찍기
      // if(state.checkedDrt){
        // console.log(param);
        var drtstaion = param.drtstaion;
        console.log(drtstaion);
        for (var i=0, ii=drtstaion.length; i<ii; i++) {
            var marker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(drtstaion[i].stLat,drtstaion[i].stLng),
                    map: map,
                    // animation: naver.maps.Animation.BOUNCE,   // DROP, BOUNCE
                    icon: {
                      url: "/static/mapicon/drt_busstation.png",
                      scaledSize: new naver.maps.Size(25, 25),
                      origin: new naver.maps.Point(0, 0),
                      // size: new naver.maps.Size(50, 52),
                      // anchor: new naver.maps.Point(25, 26)
                  }
                  //  icon: icon
                });       
            marker.set('seq', i);       
            markerList.push(marker);
// 말풍선
            var markerInfo = new naver.maps.InfoWindow({
              content: markerInfoWindow("drt", drtstaion[i].stNm, drtstaion[i].stAddr),
              disableAnchor: true, //기본 말풍선 꼬리의 사용 여부(false : 사용,  true : 미사용, defautl : false)
              // maxWidth: 200, //정보 창의 최대 너비
              backgroundColor: '#fff', // 정보 창의 배경색(default : #fff)
              borderColor: '#fff', //정보 창의 테두리 색상(default : #333)
              borderWidth: 0, //정보 창 테두리 두께(default : 1)
              pixelOffset: new naver.maps.Point(0,-5) //마커와 정보 창간 거리
            });
            markerInfoList.push(markerInfo);
            // console.log("station_name = "+drt_station_name[i]);
            // marker.addListener('mouseover', onMouseOver);
            // marker.addListener('mouseout', onMouseOut);     
            // icon = null;
            marker = null;
        }
      // }

      // 세종시 버스 정류소 마커 찍기
      if(state.checkedSj){
        for (var i=0, ii=sjStation.length; i<ii; i++) {
            var marker = new naver.maps.Marker({
                    position: sjStation[i],
                    map: map,
                    // animation: naver.maps.Animation.BOUNCE,
                    icon: {
                      url: "/static/mapicon/busstation.png",
                      // size: new naver.maps.Size(50, 52),
                      scaledSize: new naver.maps.Size(25, 25),
                      origin: new naver.maps.Point(0, 0),
                      // anchor: new naver.maps.Point(25, 26)
                    }
                  //  icon: icon
                });
        
            marker.set('seq', i);     
            markerList.push(marker);

            var markerInfo = new naver.maps.InfoWindow({
              content: markerInfoWindow("bus", bus_station_name[i], stationAddr), 
              disableAnchor: true, //기본 말풍선 꼬리의 사용 여부(false : 사용,  true : 미사용, defautl : false)
              // maxWidth: 200, //정보 창의 최대 너비
              backgroundColor: '#fff', // 정보 창의 배경색(default : #fff)
              borderColor: '#fff', //정보 창의 테두리 색상(default : #333)
              borderWidth: 0, //정보 창 테두리 두께(default : 1)
              pixelOffset: new naver.maps.Point(0,-5) //마커와 정보 창간 거리
            });            
            markerInfoList.push(markerInfo);
            // marker.addListener('mouseover', onMouseOver);
            // marker.addListener('mouseout', onMouseOut);
            // icon = null;
            marker = null;
        }
      }

      ////// *** 지도 클릭해서 위도,경도 좌표 가져오기 *** 

      //   var infoWindow = new naver.maps.InfoWindow({
      //     content: ''
      //   });

      //   const initGeocoder = () => {
      //     console.log("!!!!!!! initGeocoder !!!!!!!!!!!");
      //     var latlng = map.getCenter();
      //     var utmk = naver.maps.TransCoord.fromLatLngToUTMK(latlng); // 위/경도 -> UTMK
      //     var tm128 = naver.maps.TransCoord.fromUTMKToTM128(utmk);   // UTMK -> TM128
      //     var naverCoord = naver.maps.TransCoord.fromTM128ToNaver(tm128); // TM128 -> NAVER
      
      //     infoWindow = new naver.maps.InfoWindow({
      //         content: ''
      //     });
      
      //     map.addListener('click', function(e) {
      //         var latlng = e.coord,
      //             utmk = naver.maps.TransCoord.fromLatLngToUTMK(latlng),
      //             tm128 = naver.maps.TransCoord.fromUTMKToTM128(utmk),
      //             naverCoord = naver.maps.TransCoord.fromTM128ToNaver(tm128);
      
      //         utmk.x = parseFloat(utmk.x.toFixed(1));
      //         utmk.y = parseFloat(utmk.y.toFixed(1));
      
      //         infoWindow.setContent([
      //             '<div style="padding:10px;width:380px;font-size:14px;line-height:20px;">',
      //             '<strong>LatLng</strong> : '+ '좌 클릭 지점 위/경도 좌표' +'<br />',
      //             // '<strong>UTMK</strong> : '+ '위/경도 좌표를 UTMK 좌표로 변환한 값' +'<br />',
      //             // '<strong>TM128</strong> : '+ '변환된 UTMK 좌표를 TM128 좌표로 변환한 값' +'<br />',
      //             // '<strong>NAVER</strong> : '+ '변환된 TM128 좌표를 NAVER 좌표로 변환한 값' +'<br />',
      //             '</div>'
      //         ].join(''));
      
      //         infoWindow.open(map, latlng);
      //         console.log('LatLng: ' + latlng.toString());
      //         // console.log('UTMK: ' + utmk.toString());
      //         // console.log('TM128: ' + tm128.toString());
      //         // console.log('NAVER: ' + naverCoord.toString());
      //     });
      // }
      // naver.maps.onJSContentLoaded = initGeocoder;

      ///////// 위도,경도 좌표가져오기 END *****

// 경로탐색 TEST
        const drawData = data => {
          var ar_line = [];
          var pointArray = [];
          var new_polyLine = [];

          for (var i = 0; i < data.features.length; i++) {
            var feature = data.features[i];
            //배열에 경로 좌표 저잘
            if(feature.geometry.type == "LineString"){
              ar_line = [];
              for (var j = 0; j < feature.geometry.coordinates.length; j++) {
                var startPt = new naver.maps.LatLng(feature.geometry.coordinates[j][1],feature.geometry.coordinates[j][0]);
                
                ar_line.push(startPt);
                pointArray.push(feature.geometry.coordinates[j]);
              }
              var polyline;
              polyline = new naver.maps.Polyline({
                map: map,
                path: ar_line,
                strokeWeight: 5, // 선 두께
                strokeColor: "#DF0101", // 선 색상
                strokeStyle: "solid", // 선 스타일
                strokeLineCap: "round", // 선 마감 스타일(butt, round, square)
                strokeLineJoin: "round", // 선 꺽임 스타일(miter, round, bevel)
              });
              new_polyLine.push(polyline);
            }
          }
        };
        
        var passListMarker = [];
        var routeMarker= [];
        // JSON array test - hds
        // getRoutePassAPI2();
        function getRoutePassAPI2() {

          for(var i in routeStations) {
            var startLng = routeStations[i].start.lng;
            var startLat = routeStations[i].start.lat;
            var endLng = routeStations[i].arrival.lng;;
            var endLat = routeStations[i].arrival.lat;
            var prtcl;
            // var passList = "127.247978,36.5216931";
            var passList = "";
            for(var k in routeStations[i].stations) {
              if(k != 0) {
                passList += "_";
              }
              passList += routeStations[i].stations[k].lng + "," + routeStations[i].stations[k].lat;
            }
            var headers = {};
            headers["appKey"]="a3bb2817-6417-4060-bd8f-b1ca928ef831";
            $.ajax({
              method:"POST", 
              headers : headers, 
              url:"https://apis.openapi.sk.com/tmap/routes?version=1&format=json",//
              async:false,
              data:{ 
                startX : startLng,
                startY : startLat,
                endX : endLng,
                endY : endLat,
                passList : passList, //경유지
                reqCoordType : "WGS84GEO",
                resCoordType : "WGS84GEO",
                angle : "172",
                searchOption : "0",
                trafficInfo : "Y"
              },
              success:function(response){
                prtcl = response;
                // console.log("total_time ["+prtcl.features[0].properties.totalTime+"]"); //총 시간(sec)  ex> 4234 -> 71분?
                // console.log("total_time ["+prtcl.features[0].properties.totalDistance+"]"); //총 거리(M)
                // console.log("total_time ["+prtcl.features[0].properties.taxiFare+"]"); //총 택시요금(원)
                // console.log("total_time ["+prtcl.features[0].properties.totalFare+"]"); //무슨 요금?
        
                var test_str = "총 시간 : "+ Math.ceil(prtcl.features[0].properties.totalTime/60) + "분, 총 거리 : "+ prtcl.features[0].properties.totalDistance/1000+"Km";
                console.log(test_str);
        
                // 범용 소용시간 state SET
                param.setTotalTime(Math.ceil(prtcl.features[0].properties.totalTime/60));
                // param.setTotalTime(26);
                /////////
                drawData(prtcl);
  
                var start = new naver.maps.Marker({
                  position: new N.LatLng(startLat,startLng),
                  map: map,
                  icon: {
                          url: "/static/mapicon/start_text.png",
                          scaledSize: new naver.maps.Size(25, 25),
                          origin: new naver.maps.Point(0, 0),
                        }
                });
                // passListMarker.push(start);
                markerList.push(start);
                var markerInfo = new naver.maps.InfoWindow({
                  content: markerInfoWindow('drt', 'start'),
                  disableAnchor: false, //기본 말풍선 꼬리의 사용 여부(false : 사용,  true : 미사용, defautl : false)
                  // maxWidth: 200, //정보 창의 최대 너비
                  backgroundColor: '#fff', // 정보 창의 배경색(default : #fff)
                  borderColor: '#fff', //정보 창의 테두리 색상(default : #333)
                  borderWidth: 0, //정보 창 테두리 두께(default : 1)
                  pixelOffset: new naver.maps.Point(0,-5), //마커와 정보 창간 거리
                  anchorSize: new naver.maps.Size(20, 10),// 말풍선 꼬리 사이즈(width, height)
                });
                markerInfoList.push(markerInfo);

  
                for(var k in routeStations[i].stations) {
                  var pass = new naver.maps.Marker({
                    position: new N.LatLng(routeStations[i].stations[k].lat, routeStations[i].stations[k].lng),
                    map: map,
                    icon: {
                            url: "/static/mapicon/drt_busstation.png",
                            scaledSize: new naver.maps.Size(25, 25),
                            origin: new naver.maps.Point(0, 0),
                          }
                  });
                  // passListMarker.push(pass);
                  markerList.push(pass);
                  var markerInfo = new naver.maps.InfoWindow({
                    content: markerInfoWindow('drt','경유지'+k),
                    disableAnchor: false, //기본 말풍선 꼬리의 사용 여부(false : 사용,  true : 미사용, defautl : false)
                    // maxWidth: 200, //정보 창의 최대 너비
                    backgroundColor: '#fff', // 정보 창의 배경색(default : #fff)
                    borderColor: '#fff', //정보 창의 테두리 색상(default : #333)
                    borderWidth: 0, //정보 창 테두리 두께(default : 1)
                    pixelOffset: new naver.maps.Point(0,-5), //마커와 정보 창간 거리
                    anchorSize: new naver.maps.Size(20, 10),// 말풍선 꼬리 사이즈(width, height)
                  });
                  markerInfoList.push(markerInfo);
                  pass = null;
                }
  
                var arrival = new naver.maps.Marker({
                  position: new N.LatLng(endLat,endLng),
                  map: map,
                  icon: {
                          url: "/static/mapicon/arrival_text.png",
                          scaledSize: new naver.maps.Size(25, 25),
                          origin: new naver.maps.Point(0, 0),
                        }
                });
                // passListMarker.push(arrival);
                markerList.push(arrival);

                var markerInfo = new naver.maps.InfoWindow({
                  content: markerInfoWindow('drt', '도착지'),
                  disableAnchor: false, //기본 말풍선 꼬리의 사용 여부(false : 사용,  true : 미사용, defautl : false)
                  // maxWidth: 200, //정보 창의 최대 너비
                  backgroundColor: '#fff', // 정보 창의 배경색(default : #fff)
                  borderColor: '#fff', //정보 창의 테두리 색상(default : #333)
                  borderWidth: 0, //정보 창 테두리 두께(default : 1)
                  pixelOffset: new naver.maps.Point(0,-5), //마커와 정보 창간 거리
                  anchorSize: new naver.maps.Size(20, 10),// 말풍선 꼬리 사이즈(width, height)
                });
                markerInfoList.push(markerInfo);
  
              },
              error:function(request,status,error){
                console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
              }
            });
          }
        }

        // 경유지 최적화 API 테스트 - hds
        // getRoutePassAPI();
        function getRoutePassAPI() {
          for(var i in routeStations) {
            var startLng = routeStations[i].start.lng;
            var startLat = routeStations[i].start.lat;
            var endLng = routeStations[i].arrival.lng;;
            var endLat = routeStations[i].arrival.lat;
            var prtcl;
            var viaPoints = [];
            var passList = "";
            for(var k in routeStations[i].stations) {
              var viaPoint = '';
              viaPoint = {
                "viaPointId": routeStations[i].stations[k].id,
                "viaPointName": routeStations[i].stations[k].id,
                "viaX": routeStations[i].stations[k].lng,
                "viaY": routeStations[i].stations[k].lat,
              }
              viaPoints.push(viaPoint);
            }
            var headers = {};
            headers["appKey"]="a3bb2817-6417-4060-bd8f-b1ca928ef831";
            
            $.ajax({
              type:"POST",
              headers : headers,
              url:"https://apis.openapi.sk.com/tmap/routes/routeOptimization20?version=1&format=json",//
              async:false,
              contentType: "application/json",
              data: JSON.stringify({
                    "reqCoordType": "WGS84GEO",
                    "resCoordType" : "WGS84GEO",
                    "startName": "출발",
                    // "startX": "127.2233158",
                    // "startY": "36.526448",
                    "startX": startLng,
                    "startY": startLat,
                    "startTime": "202002171831",
                    "endName": "도착",
                    "endX": endLng,
                    "endY": endLat,
                    "searchOption" : "0",
                    "viaPoints": viaPoints
              }),
              success:function(response){
                prtcl = response;
                console.log(prtcl)
                // var test_str = "총 시간 : "+ Math.ceil(prtcl.features[0].properties.totalTime/60) + "분, 총 거리 : "+ prtcl.features[0].properties.totalDistance/1000+"Km";
                var test_str = "총 시간 : "+ Math.ceil(prtcl.properties.totalTime/60) + "분, 총 거리 : "+ prtcl.properties.totalDistance/1000+"Km";
                console.log(test_str);
                param.setTotalTime(Math.ceil(prtcl.features[0].properties.totalTime/60));
  
                var start = new naver.maps.Marker({
                  position: new N.LatLng(startLat,startLng),
                  map: map,
                  icon: {
                          url: "/static/mapicon/start_text.png",
                          scaledSize: new naver.maps.Size(25, 25),
                          origin: new naver.maps.Point(0, 0),
                        }
                });
                passListMarker.push(start);
  
                for(var k in routeStations[i].stations) {
                  var pass = new naver.maps.Marker({
                    position: new N.LatLng(routeStations[i].stations[k].lat, routeStations[i].stations[k].lng),
                    map: map,
                    icon: { 
                            url: "/static/mapicon/drt_busstation.png",
                            scaledSize: new naver.maps.Size(25, 25),
                            origin: new naver.maps.Point(0, 0),
                          }
                  });
                  passListMarker.push(pass);
                }
  
                var arrival = new naver.maps.Marker({
                  position: new N.LatLng(endLat,endLng),
                  map: map,
                  icon: {
                          url: "/static/mapicon/arrival_text.png",
                          scaledSize: new naver.maps.Size(25, 25),
                          origin: new naver.maps.Point(0, 0),
                        }
                });
                passListMarker.push(arrival); 
  
                drawData(prtcl);
            
            },
            error:function(request,status,error){
              console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
          });
        }
        }

      naver.maps.Event.addListener(map, 'idle', function() {
        updateMarkers(map, markerList);
        // updateMarkers(map, routeMarker);
      });

      function updateMarkers(map, markers) {
        var mapBounds = map.getBounds();
        var marker, position;
    
        for (var i = 0; i < markers.length; i++) {
    
          marker = markers[i]
          position = marker.getPosition();
    
          if (mapBounds.hasLatLng(position)) {
            showMarker(map, marker);
          } else {
            hideMarker(map, marker);
          }
        }
      }

      function showMarker(map, marker) {
        if (marker.setMap()) return;
        marker.setMap(map);
      }
    
      function hideMarker(map, marker) {
        if (!marker.setMap()) return;
        marker.setMap(null);
      }

      function removeInfoWindEvents() {
        // 말풍선에 등록되어있던 이벤트 제거 함수
        $("#closeWindow").unbind("click");
        $("#startStation").unbind("click");
        $("#arrivalStation").unbind("click");
      }
      // 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
      function getClickHandler(seq) {
        return function(e) {
          var marker = markerList[seq],
              markerInfo = markerInfoList[seq];
          
          if (markerInfo.getMap()) {
            removeInfoWindEvents();
            markerInfo.close();
          } else {
            removeInfoWindEvents();
            markerInfo.open(map, marker);

            // 닫기 버튼 이벤트 등록
            $("#closeWindow").bind("click", function() {
              removeInfoWindEvents();
              markerInfo.close();
              return false;
            });
            // 출발지에 입력 클릭
            $("#startStation").bind("click", function() {
              const busStation_json = {
                "name" : $("#stationtName").text(),
                "id" : $("#stationtId").text(),
                "address" : $("#stationAddr").text(),
                "seq" : $("#stationMarker").attr('src'),
                "lat" : "위도",
                "lng" : "경도"
              };
              param.setStartStation(busStation_json);
              return false;
            });
            // 도착지에 입력 클릭
            $("#arrivalStation").bind("click", function() {
              const busStation_json = {
                "name" : $("#stationtName").text(),
                "id" : $("#stationtId").text(),
                "address" : $("#stationAddr").text(),
                "seq" : $("#stationMarker").attr('src'),
                "lat" : "위도",
                "lng" : "경도"
              };
              param.setArrivalStation(busStation_json);
              return false;
            });
          }
        }
      }

      for (var i=0, ii=markerList.length; i<ii; i++) {
        naver.maps.Event.addListener(markerList[i], 'click', getClickHandler(i));
      }

      function markerInfoWindow(seq, name, addr) {
        if(seq == "drt") seq = "drt_busstation";
        else seq = "busstation";

        var tpl = '<div id="stationInfo" style="min-width:180px; margin:10px; font-family:NotoSansCJKkr;" seq="'+ seq + '">' +
                    '<div style="position:relative;">' + 
                      '<img id="stationMarker"style="width:23px; height:23px; position:absolute; left:0; top:0;" src="/static/mapicon/' + seq + '.png"/>' +
                      '<div style=" margin-left:25px; padding-top:2px; position:relative;">' +
                        '<div style="position:relative;">' +
                          '<span id="stationtName" style="font-size:13px; color:#313131; font-weight:normal;">' + name + '</span>' +
                          '<span style="color:#717171; margin:0 2px;">|</span>' +
                          '<span id="stationtId" style="font-size:13px; right:0; top:0; font-weight:500; color: #313131; margin-right:12px;">' + '정류소 ID' + '</span>' +
                        '</div>' +
                        '<span style="font-size:11px; line-height:normal; letter-spacing:-0.1px; color:#717171;">(<span id="stationAddr">' + addr + '</span>)</span>' +
                        '<img id="closeWindow" style="position:absolute; top:0; right:0; width:10px; height:9px; background-color:transparent; object-fit:contain; cursor:pointer; " src="/static/buttonicon/x-button-black.png"/>' +
                      '</div>' +
                    '</div>' +
                    '<div style="width:100%; height:21px; position:relative; margin-top:12px; font-weight: normal; font-stretch:normal; font-style:normal; line-height:1.15; letter-spacing:normal;">' +
                      '<a id="startStation" style="width:45%; cursor:pointer; position:absolute; left:0; padding:4px; font-size:12px; background-color:#679b4d; color:#ffffff; text-align:center;">' + '출발지에 입력' + '</a>' +
                      '<a id="arrivalStation" style="width:45%; cursor:pointer; position:absolute; right:0; padding:4px; font-size:12px; background-color:#d85b4e; color:#ffffff; text-align:center">' + '도착지에 입력' + '</a>' +
                    '</div>' +
                  '</div>';
        return tpl;
      }

      function bookerInfoWindow(client, count, phone, start, start_info, start_t, arrive, arrive_info, arrive_t) {
        if(start_info == "drt") start_info = "drt_busstation";
        else start_info = "busstation";

        if(arrive_info == "drt") arrive_info = "drt_busstation";
        else arrive_info = "busstation";

        var tpl = '<div id="bookerInfo" style="width:200px; font-family:NotoSansCJKkr; position:relative;">' + // 1
                    '<div style="width:180px; padding:10px; background-color:gray; display:inline-flex; font-size:12px; color:#fff; text-align: center;">' +
                      '<div style="width:40px; float:left;">' + client + '</div>' +
                      '<div style="width:87px; float:left; border-left:1px solid #fff; border-right:1px solid #fff; margin:0 3px; padding:0 3px;">' + phone + '</div>' +
                      '<div style="width:26px; float:left;">' + count + '인</div>' +
                      '<img id="closeWindow" style="position:absolute; top:14px; right:10px;" src="/static/buttonicon/x-button-white.png"/>' +
                    '</div>' + // 1-1 E
                    '<div style="width:200px; position:relative;">' + // 1-2
                      '<div style="width:190px; position:relative; margin-top:10px; margin-left:10px;">' + // 1-2-1
                        '<img style="width:23px; height:23px; position:absolute; left:0; top:0;" src="/static/mapicon/' + start_info + '.png">' +
                        '<div style="margin-left:28px;">' + // 1-2-1-1
                          '<div style="display:inline-flex; font-size:13px;">' +
                            '<div style="float:left; width:80px;">' + start + '</div>' +
                            '<div style="float:left; color:#717171; margin:0 2px;">|</div>' +
                            '<div style="float:left;">' + '정류소 ID' + '</div>' +
                          '</div>' +
                          '<div style="font-size:10px; color:#4fa0cb;">승차 <span>' + start_t + '</span></div>' +
                        '</div>' + // 1-2-1-1 E
                        '<img style="width:6px; height:11px; position:absolute; left:8px; bottom:-7px;" src="/static/mapicon/down_arrow.png">' +
                      '</div>' + // 1-2-1 E
                      '<div style="position:relative; margin-top:10px; margin-left:10px;">' + // 1-2-2
                        '<img style="width:23px; height:23px; position:absolute; left:0; top:0;" src="/static/mapicon/' + arrive_info + '.png">' +
                        '<div style="margin-left:28px;">' + // 1-2-1-1
                          '<div style="display:inline-flex; font-size:13px;">' +
                            '<div style="float:left; width:80px;">' + arrive + '</div>' +
                            '<div style="float:left; color:#717171; margin:0 2px;">|</div>' +
                            '<div style="float:left;">' + '정류소 ID' + '</div>' +
                          '</div>' +
                          '<div style="font-size:10px; color:#4fa0cb;">하차 <span>' + arrive_t + '</span></div>' +
                        '</div>' + // 1-2-1-1 E
                      '</div>' + // 1-2-2 E
                    '</div>' + // 1-2 E
                  '</div>' ; // 1 E
        return tpl;
      }

      if(param.setSearchAddress) {
        console.log("주소 검색 클릭 => ",param.setSearchAddress);
        var latlan = new naver.maps.LatLng(param.setSearchAddress.lat, param.setSearchAddress.lng);
        var marker = new naver.maps.Marker({
          position: latlan,
          map: map
        });
        // map.setZoom(15, true);
        map.panTo(latlan);
        // map.setCenter(latlan);
        // console.log("go center ==> ",latlan);
      } else {
        console.log("search Address Fail");
      }
      
      // console.log("param seq ===> "+param.setCurrentStationSeq);
      if(param.setCurrentStationSeq == 'start') {
        if(param.setCurrentStart) {
          var latlan = '';
          console.log("최근출발지 클릭 => ", param.setCurrentStart);
          //테스트에서만 표시해주기위해 사용
          latlan = new naver.maps.LatLng(param.setCurrentStart.lat, param.setCurrentStart.lng);
          var marker = new naver.maps.Marker({
            position: latlan,
            icon: {
              url: param.setCurrentStart.seq,
              scaledSize: new naver.maps.Size(25, 25),
              origin: new naver.maps.Point(0, 0),
            },
            map: map
          });
  
          map.panTo(latlan);
          console.log("최근 출발지로 이동!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
          // map.setCenter(latlan);
          
          param.setStartStation(param.setCurrentStart);
          setStartStationCheck(param.setCurrentStart);
          // routeMarker.push(marker);
          // markerList.push(marker);
          setCurrentStart('');
        } else {
          console.log("1111");
        }
      } else {

      }

      if (param.setCurrentStationSeq == 'arrival') {
        if(param.setCurrentArrival) {
          var latlan = '';
          console.log("최근도착지 클릭 => ", param.setCurrentArrival);
          //테스트에서만 표시해주기위해 사용
          latlan = new naver.maps.LatLng(param.setCurrentArrival.lat, param.setCurrentArrival.lng);
          var marker = new naver.maps.Marker({
            position: latlan,
            icon: {
              url: param.setCurrentArrival.seq,
              scaledSize: new naver.maps.Size(25, 25),
              origin: new naver.maps.Point(0, 0),
            },
            map: map
          });
  
          map.panTo(latlan);
          console.log("최근 도착지로 이동!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  
          param.setArrivalStation(param.setCurrentArrival);
          setArrivalStationCheck(param.setCurrentArrival);
          // routeMarker.push(marker);
          // markerList.push(marker);
          setCurrentArrival('');
        } else {
          console.log("22222");
        }
      } else {
      }
    }

    if(startStationCheck != '' && arrivalStationCheck != '') {
      console.log("wow");
      
    } else {
      
    }

      setLoading(false);
  }, [param.drtstaion, state.checkedSj , state.checkedDrt , state.checkedBooker , bus , markerInfo, currentStart, currentArrival,
    param.setCurrentStart, param.setCurrentArrival, param.setCurrentStationSeq, param.setSearchAddress,
    startStationCheck, arrivalStationCheck
  ]);

  return (
    <div className={classes.naverMapRoot}>
      {/* 네이버 지도 */}
      {loading && <LinearProgress />}
      <div id="map"  className={classes.navermap}></div>
    </div>
  );
};
// export default NaverMap;
NaverMap.getInitialProps = async props => {
  // console.log(props);
  console.log("===== NaverMap Init Props =====")
  const { store, isServer } = props;
  store.dispatch(loadMapData());
  if (isServer) {
    /** 로그인이 필요한 페이지는 서버사이드 렌더링을 하지 않는다 */
  }
  return { isServer };
};
const mapStateToProps = state => {
  return {
    drtstaion: state.navermap.drtstaion,
    // drtstaion1: state.navermap,
    // drtstaion2: state,
    // index: state.index.data,
    // home: state.home.data
    // contents: state.content.contents,
    // loading: state.content.loading,
  };
};

const mapDispatchToProps = dispatch => ({
  mapLoad: () => dispatch(loadMapData()),
  // homeLoad: () => dispatch(loadHomeData())
  // contentsLoad: (page, pageSize, searchKey, searchVal) =>
  //   dispatch(loadIndexData(page, pageSize, searchKey, searchVal))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NaverMap);
