import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

import { loadBusData } from "../lib/buslist/actions";

import { loadRouteStationListData } from "../lib/route/actions";
import { loadRouteStationData } from "../lib/routestation/actions";
import {
  loadMapData,
  selectDepStationData,
  selectDestStationData
} from "../lib/navermap/actions";

const useStyles = makeStyles(theme => ({
  '@global': {
    '.MuiPaper-elevation0': {
      backgroundColor: "transparent",
    }
  },
  naverMapRoot: {
    width: "33%",
    paddingRight: 10,
  },
  navermap: {
    width: '100%',
    height: '100%',
  },
}));

const ReservationMap = ({
  openModal, //배차하기 모달 팝업 여부
  allRouteStation, // 모든 노선정류소 정보(서버 API)
  selectStation, // 선택된 정류소 정보(redux)
  setTotalTime, // 총 운행 시간
  setTotalDistance, // 총 운행 거리
  setPersonTotalTime,	// 실 승객 이동 시간
  setPersonTotalDistance, // 실 승객 이동 거리
  setFinalRoutesInfoList, // 선택된 정류소들이 포함한 노선 리스트
  setRadioRouteNumber, // 선택된 노선 정보
  radioRouteNumber, // 선택된 노선 정보
  drtstation, // 정류소 리스트 정보 (서버 API)
  selectDepStationInfos, // 승차정류소 정보 (redux)
  selectDestStationInfos, // 하차정류소 정보 (redux)
  mapLoad, // 정류소 리스트 정보 로드 (서버 API)
  routeStationLoad, // 노선정류소 정보 로드 (서버 API)
  selectFindStation, // 검색으로 받아온 정류소 데이터
  setSelectFindStation,
  selectFindAddress, // 검색으로 받아온 주소 데이터
  setSelectFindAddress,
  isRsvPerson, // 예약 데이터 유/무
  rsvPersonDatas, // 예약 고객 데이터
  currentStarts, // 최근승차지에서 클릭
  setCurrentStarts,
  currentArrivals, // 최근하차지에서 클릭
  setCurrentArrivals,
  currentStartsCheck, // 최근승차지 선택 여부
  setCurrentStartsCheck,
  currentArrivalsCheck, // 최근승차지 선택 여부
  setCurrentArrivalsCheck,
}) => {

  useEffect(() => {
    mapLoad(); // 정류소 리스트 정보 로드
    routeStationLoad(); // 노선 정류소 리스트 정보 로드
  }, []);

  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const [naverMapZoom, setNaverMapZoom] = useState(14); // 지도 배율
  const [naverMapCenterX, setNaverMapCenterX] = useState(127.205296); //지도 중심 좌표
  const [naverMapCenterY, setNaverMapCenterY] = useState(36.496997); //지도 중심 좌표

  const [depStationNumber, setDepStationNumber] = useState(''); // 승차 정류소 번호
  const [destStationNumber, setDestStationNumber] = useState(''); // 하차 정류소 번호
  const [depIncludeRouteStation, setDepIncludeRouteStation] = useState(''); // 선택된 승차 정류소의 노선들에 포함된 모든 정류소들의 정보
  const [destIncludeRouteStation, setDestIncludeRouteStation] = useState(''); // 선택된 하차 정류소의 노선들에 포함된 모든 정류소들의 정보

  const [isExistRouteDep, setIsExistRouteDep] = useState(true); // 승차정류소에 포함된 노선인지 여부
  const [isExistRouteDest, setIsExistRouteDest] = useState(true); // 하차정류소에 포함된 노선인지 여부

  const [isRsvPersonCheck, setIsRsvPersonCheck] = useState(false); // APP예약 고객 여부


  let markerLists = []; // 마커 정보
  let markerInfoLists = []; //마커말풍선 정보
  let arr = new Array();

  useEffect(() => {
    // 승차 정류소가 없는 경우, 승차 정류소가 포함된 노선을 담는 객체를 비움
    if (!selectStation.dep.data) {
      setDepIncludeRouteStation('');
    }

    // 하차 정류소가 없는 경우, 하차 정류소가 포함된 노선을 담는 객체를 비움
    if (!selectStation.dest.data) {
      setDestIncludeRouteStation('');
    }
  }, [selectStation.dep.data, selectStation.dest.data])

  useEffect(() => {
    // 배차하기 팝업 시, 초기화
    markerLists = [];
    markerInfoLists = [];
    setDepStationNumber('');
    setDestStationNumber('');
    setDepIncludeRouteStation('');
    setDestIncludeRouteStation('');
    selectDepStationInfos(false);
    selectDestStationInfos(false);
    setIsExistRouteDep(true);
    setIsExistRouteDest(true);
    setIsRsvPersonCheck(isRsvPerson); // isRsvPerson (Reservation에서 받아온 APP예약 고객 유/무)
  }, []);

  useEffect(() => {
    // APP예약 고객인지 유/무 판별하여, 승/하차 정류소를 넣어주기 위해
    if (isRsvPersonCheck) {
      // APP예약 정보가 있을 때, 예약 정보에서 승/하차 정류소를 담아주고,
      if (rsvPersonDatas) {
        selectDepStationInfos({
          name: rsvPersonDatas.data[0].rsv_dep_station.station_nm,
          id: rsvPersonDatas.data[0].rsv_dep_station.station_no,
          address: rsvPersonDatas.data[0].rsv_dep_station.station_address,
          lat: rsvPersonDatas.data[0].rsv_dep_station.station_lat,
          lng: rsvPersonDatas.data[0].rsv_dep_station.station_lng,
          img: '/static/mapicon/drt_busstation.png',
        });
        selectDestStationInfos({
          name: rsvPersonDatas.data[0].rsv_dest_station.station_nm,
          id: rsvPersonDatas.data[0].rsv_dest_station.station_no,
          address: rsvPersonDatas.data[0].rsv_dest_station.station_address,
          lat: rsvPersonDatas.data[0].rsv_dest_station.station_lat,
          lng: rsvPersonDatas.data[0].rsv_dest_station.station_lng,
          img: '/static/mapicon/drt_busstation.png',
        });
        //  해당 정류소들이 갖고 있는 노선 정류소 정보를 구한다.
        check_this_station_include_route_stations(rsvPersonDatas.data[0].rsv_dep_station.station_no, 'dep');
        check_this_station_include_route_stations(rsvPersonDatas.data[0].rsv_dest_station.station_no, 'dest');
      }
    }
  }, [rsvPersonDatas]);

  useEffect(() => {
    // 정류소 선택 시, 해당 승차 정류소가 포함된 노선이 없는 경우, Alert띄우고  승차정류소 관련 객체 초기화
    if (!isExistRouteDep) {
      alert("해당 승차 정류소를 포함한 노선이 없습니다.");
      setDepIncludeRouteStation('');
      setDepStationNumber('');
      selectDepStationInfos(false);
      setIsExistRouteDep(true);
    }

    // 정류소 선택 시, 해당 하차 정류소가 포함된 노선이 없는 경우, Alert띄우고  하차정류소 관련 객체 초기화
    if (!isExistRouteDest) {
      alert("해당 하차 정류소를 포함한 노선이 없습니다.");
      setDestIncludeRouteStation('');
      setDestStationNumber('');
      selectDestStationInfos(false);
      setIsExistRouteDest(true);
    }
  }, [isExistRouteDep, isExistRouteDest]);

  useEffect(() => {
    // 네이버맵 API가 쓰이는 부분
    if (openModal) {
      // 지도 CORE
      var map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(naverMapCenterY, naverMapCenterX),
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
      // 세종시 바운더리
      var sejongsi = new naver.maps.LatLngBounds(
        new naver.maps.LatLng(36.4127755, 127.1255566),
        new naver.maps.LatLng(36.5860935, 127.398155)
      );

      naver.maps.Event.addListener(map, 'idle', function () {
        setNaverMapCenterY(map.getCenter().y);
        setNaverMapCenterX(map.getCenter().x);
        setNaverMapZoom(map.getZoom());
      });

      // 지도 마커와, 지도가 사용되는 부분은 하나의 useEffect안에서 실행
      if (selectStation.dep.data && selectStation.dest.data) {
        // 승/하차 정류소 모두 선택된 경우
        createMarker(check_selected_stations_include_route_stations(depIncludeRouteStation, destIncludeRouteStation), 'drt', selectStation.dep.data.id, selectStation.dest.data.id);
      } else if (selectStation.dep.data && !selectStation.dest.data) {
        // 승차 정류소만 선택된 경우
        if (depIncludeRouteStation.length < 1) {
          // 선택된 승차 정류소가 포함된 노선이 없는 경우
          setIsExistRouteDep(false);
        } else {
          createMarker(depIncludeRouteStation, 'drt', selectStation.dep.data.id, selectStation.dest.data.id);
        }
      } else if (!selectStation.dep.data && selectStation.dest.data) {
        // 하차 정류소만 선택된 경우
        if (destIncludeRouteStation.length < 1) {
          // 선택된 하차 정류소가 포함된 노선이 없는 경우
          setIsExistRouteDest(false);
        } else {
          createMarker(destIncludeRouteStation, 'drt', selectStation.dep.data.id, selectStation.dest.data.id);
        }
      } else {
        // 선택된 정류소가 없는 경우
        if (drtstation) {
          createMarker(drtstation, 'drt', selectStation.dep.data.id, selectStation.dest.data.id);
        } else {
          alert("정류소 목록을 가져오는데 실패했습니다.");
        }
      }

      naver.maps.Event.addListener(map, 'idle', function () {
        updateMarkers(map, markerLists);
      });

      // 마커 클릭 이벤트 등록
      for (var i = 0; i < markerLists.length; i++) {
        naver.maps.Event.addListener(markerLists[i], 'click', getClickHandler(i));
      }

      // 정류소 검색 데이터가 있을 경우  // 주소검색으로 나온 정류소가 해당 노선의 정류소와 일치 여부 확인용. (다른 정류소라면 막아야한다.)
      if (selectFindStation != '') {
        let markerIndex = null;
        let m_flag = false;
        for (var i = 0; i < markerInfoLists.length; i++) {
          if (markerInfoLists[i].st_no == selectFindStation.station_no) {
            // 마커에 등록된 st_no(정류소 번호)와 정류소 검색시 결과정류소의 번호가 같을 경우에 flag 변경
            markerIndex = i;
            m_flag = true;
          }
        }
        // 검색결과와 같은 정류소 번호가 있을 경우에만 마커에 이벤트 등록
        if (m_flag) {
          if (markerInfoLists[markerIndex].getMap()) {
            markerInfoLists[markerIndex].close();
          } else {
            // 주소검색으로 정류소를 클릭했을시 뜨는 말풍선 
            markerInfoLists[markerIndex].open(map, markerLists[markerIndex]);
            removeInfoWindEvents(); // 이벤트 핸들러가 여러번 등록되는 현상이 있어, 핸들러를 등록하기전에 등록된 핸들러를 삭제한다
            {/* [닫기 버튼] 이벤트 바인딩 */ }
            $("#closeWindow").bind("click", function () {
              setSelectFindStation('');
              markerInfoLists[markerIndex].close();
              return false;
            });
            {/* [승차정류소 입력] 이벤트 바인딩 */ }
            $("#startStation").bind("click", function () {
              if (isRsvPersonCheck) {
                alert('예약고객의 승차정류소는 변경할 수 없습니다.');
                return false;
              }
              if (selectStation.dest.data) {
                if (selectStation.dest.data.id == document.getElementById('stationtId').textContent) {
                  // 선택한 정류소가 하차정류지와 같은 경우, 하차 정류소 정보를 비워주어 승차지와의 충돌을 막기위해
                  selectDestStationInfos(false);
                }
              }
              setSelectFindStation('');
              setSelectFindAddress('');
              selectDepStationInfos(false);
              check_this_station_include_route_stations(document.getElementById('stationtId').textContent, 'dep');
              selectDepStationInfos({
                name: document.getElementById('stationtName').textContent,
                id: document.getElementById('stationtId').textContent,
                address: document.getElementById('stationAddr').textContent,
                lat: document.getElementById('stationtLat').textContent,
                lng: document.getElementById('stationtLng').textContent,
                img: document.getElementById('stationMarker').getAttribute('src'),
              });
              setDepStationNumber(document.getElementById('stationtId').textContent);
              markerInfoLists[markerIndex].close();
              return false;
            });
            $("#arrivalStation").bind("click", function () {
              if (isRsvPersonCheck) {
                alert('예약고객의 하차정류소는 변경할 수 없습니다.');
                return false;
              }
              if (selectStation.dep.data) {
                if (selectStation.dep.data.id == document.getElementById('stationtId').textContent) {
                  // 선택한 정류소가 승차정류지와 같은 경우, 승차 정류소 정보를 정보를 비워주어 승차지와의 충돌을 막기위해
                  selectDepStationInfos(false);
                }
              }
              setSelectFindStation('');
              setSelectFindAddress('');
              selectDestStationInfos(false);
              check_this_station_include_route_stations(document.getElementById('stationtId').textContent, 'dest');
              selectDestStationInfos({
                name: document.getElementById('stationtName').textContent,
                id: document.getElementById('stationtId').textContent,
                address: document.getElementById('stationAddr').textContent,
                lat: document.getElementById('stationtLat').textContent,
                lng: document.getElementById('stationtLng').textContent,
                img: document.getElementById('stationMarker').getAttribute('src'),
              });
              setDestStationNumber(document.getElementById('stationtId').textContent);
              markerInfoLists[markerIndex].close();
              return false;
            });
          }
        } else {
          alert("승/하차 정류소에 입력된 연관 노선의 정류소가 아닙니다.");
          setSelectFindStation('');
          setSelectFindAddress('');
        }
      }

      var s_latlan = '';
      var s_marker = '';
      // 주소 검색 데이터가 있을 경우, 해당 위치에 기본 마커를 찍어주기 위해
      if (selectFindAddress != '') {
        // name: "김종서장군묘소"
        // id: "11572"
        // address: "세종시 세종시  "
        // lat: "36.52124573"
        // lng: "127.21283437"
        // seq: "/static/mapicon/map_marker.png"
        // seq2: "tmap"
        s_latlan = new naver.maps.LatLng(selectFindAddress.lat, selectFindAddress.lng);
        s_marker = new naver.maps.Marker({
          position: s_latlan,
          map: map
        });
        map.panTo(s_latlan);
      } else {
        s_latlan = '';
        s_marker = '';
      }

      if (selectStation.dep.data && selectStation.dest.data) {
        // 승차 정류소와 하차 정류소가 모두 있을 때, 정류소간 노선의 정보를 구하기 위해
        if (selectStation.dep.routes && selectStation.dest.routes) {
          var dep_tmp = [];
          var dest_tmp = [];
          var routeList = [];
          var final_routes = [];
          arr = [];
          //승차 정류소 노선 탐색
          for (var i = 0; i < selectStation.dep.routes.length; i++) {
            // 하차 정류소 노선 탐색
            for (var j = 0; j < selectStation.dest.routes.length; j++) {
              // 승차 하차 정류소에서 같은 노선 탐색 후 배열 저장
              if (selectStation.dep.routes[i].route_no == selectStation.dest.routes[j].route_no) {
                routeList.push(selectStation.dep.routes[i].route_no);
              }
            }
          }
          for (var i = 0; i < routeList.length; i++) {
            for (var j = 0; j < allRouteStation.length; j++) {
              if (routeList[i] == allRouteStation[j].route_no) {
                if (selectStation.dep.data.id == allRouteStation[j].station_no) {
                  if (allRouteStation[j].station_active_fl == "ACTIVE" && allRouteStation[j].route_active_fl == 'ACTIVE') { // 정류소가 active 인 상태만 가져옴
                    // 출발 정류소의 노선 정보들을 담는다
                    dep_tmp.push(allRouteStation[j]);
                  }
                }
                if (selectStation.dest.data.id == allRouteStation[j].station_no) {
                  if (allRouteStation[j].station_active_fl == "ACTIVE" && allRouteStation[j].route_active_fl == 'ACTIVE') { // 정류소가 active 인 상태만 가져옴
                    // 하차 정류소의 노선 정보들을 담음
                    dest_tmp.push(allRouteStation[j]);
                  }
                }
              }
            }
          }
          var finalRoutesInfoList_obj_list = new Array(); // 아래에서 생성할 노선 리스트 obj를 담기위한 배열

          var listLength = '';
          // 승차 정류소와 하차정류소의 노선의 개수를 비교, 둘중에 더 적은 노선의 갯수로 기준을 잡기위해
          if (dep_tmp.length == dest_tmp.length) {
            listLength = dep_tmp.length;
          } else if (dep_tmp.length < dest_tmp.length) {
            listLength = dep_tmp.length;
          } else if (dep_tmp.length > dest_tmp.length) {
            listLength = dest_tmp.length;
          }

          for (var i = 0; i < listLength; i++) {
            var routeStationsInfo_obj = new Object(); // 아래에서 생서한 배열을 담기위한 obj
            if (dep_tmp[i].route_no == dest_tmp[i].route_no) {
              if (dep_tmp[i].route_station_turn_no < dest_tmp[i].route_station_turn_no) {
                var routeStationsInfo_array = new Array(); // 같은 노선에 포함된 아래의 정류소 정보들을 한 배열에 담기위해
                for (var j = 0; j < allRouteStation.length; j++) {
                  var routeStationsInfo = new Object(); // 노선에 포함된 1개에 해당하는 정류소 정보를 담기위한 obj
                  if (routeList[i] == allRouteStation[j].route_no) {
                    routeStationsInfo_obj.route_nm = allRouteStation[j].route_nm;
                    routeStationsInfo.station_no = allRouteStation[j].station_no;
                    routeStationsInfo.turn_no = allRouteStation[j].route_station_turn_no;
                    routeStationsInfo.route_nm = allRouteStation[j].route_nm;
                    routeStationsInfo.station_nm = allRouteStation[j].station_nm;
                    routeStationsInfo.station_lat = allRouteStation[j].station_lat;
                    routeStationsInfo.station_lng = allRouteStation[j].station_lng;
                    routeStationsInfo.route_active_fl = allRouteStation[j].route_active_fl;
                    routeStationsInfo.station_active_fl = allRouteStation[j].station_active_fl;
                    routeStationsInfo_array.push(routeStationsInfo);
                  }
                }
                var routeLength = routeStationsInfo_array.length - 1;
                if (routeStationsInfo_array[0].turn_no > routeStationsInfo_array[routeLength].turn_no) {
                  // 승차 정류소와 하차정류소의 turn no를 비교하면 turn no가 작은 쪽이 승차 정류소이다.
                  // 때문에 배열의 첫번째 값의 turn no가 마지막값의 turn no보다 크면 배열의 순서를 뒤집어 주어야 한다.
                  var routeTemp = new Array();
                  for (var k = routeLength; k > -1; k--) {
                    routeTemp.push(routeStationsInfo_array[k]); // turn_no가 역순인 경우 순서를 바꿔주기 위함
                  }
                  routeStationsInfo_array = routeTemp;
                }
                routeStationsInfo_obj.route_no = routeList[i];
                routeStationsInfo_obj.route_Stations = routeStationsInfo_array;
                finalRoutesInfoList_obj_list.push(routeStationsInfo_obj);
              }

            }
          }

          // 최종으로 생성된 노선 배열을 state 객체에 담는다
          setFinalRoutesInfoList(finalRoutesInfoList_obj_list);

          // **** 티맵 API 경로 탐색 , 경로 그리기 ****
          // 노선선택이 없는 경우(처음 노선을 생성할 때는 선택된 노선 번호가 없기때문에 위에서 생서된 배열의 0번째를 임의로 넣어준다)
          if (radioRouteNumber == '') {
            // 예외 처리 : 선택된 노선번호가 없고, 최종 생성된 노선이 없을 경우 처리
            if (finalRoutesInfoList_obj_list.length < 1) {
              alert("존재하지 않는 노선입니다.");
              setRadioRouteNumber('');
              selectDestStationInfos(false);
              selectDepStationInfos(false);
            } else {
              var st_turn_no = '';
              var ar_turn_no = '';
              var route_temp2 = [];
              for (var j = 0; j < finalRoutesInfoList_obj_list[0].route_Stations.length; j++) {
                // 선택된 노선에서 승객의 승차,하차 정류소를 구한다.
                if (finalRoutesInfoList_obj_list[0].route_Stations[j].station_no == selectStation.dep.data.id) {
                  st_turn_no = finalRoutesInfoList_obj_list[0].route_Stations[j].turn_no;
                }
                if (finalRoutesInfoList_obj_list[0].route_Stations[j].station_no == selectStation.dest.data.id) {
                  ar_turn_no = finalRoutesInfoList_obj_list[0].route_Stations[j].turn_no;
                }
              }
              for (var j = 0; j < finalRoutesInfoList_obj_list[0].route_Stations.length; j++) {
                if (st_turn_no <= finalRoutesInfoList_obj_list[0].route_Stations[j].turn_no && ar_turn_no >= finalRoutesInfoList_obj_list[0].route_Stations[j].turn_no) {
                  // 승차,하차 정류소로 실제로 승객이 이동할 경로의 정류소 들을 구한다
                  route_temp2.push(finalRoutesInfoList_obj_list[0].route_Stations[j]);
                }
              }
              //노선리스트 기본 값(리스트의 0번째 노선) 입력
              setRadioRouteNumber(finalRoutesInfoList_obj_list[0].route_no);
              setLoading(true);
              // 운행 경로탐색
              ajax_SK_PathExplorer(finalRoutesInfoList_obj_list[0]);
              setLoading(true);
              setTimeout(() => {
                // 실제 승객이 이동해야할 경로탐색
                ajax_SK_Real_PathExplorer(route_temp2);
              }, 1500); // API를 연속으로 데이터를 보낼 경우, API초당 요청 건수 오류가 뜰 수 있으므로, 1500ms만큼의 시간을 준다
            }
          } else {
            for (var i = 0; i < finalRoutesInfoList_obj_list.length; i++) {
              if (finalRoutesInfoList_obj_list[i].route_no == radioRouteNumber) {
                var st_turn_no = '';
                var ar_turn_no = '';
                var route_temp = [];
                for (var j = 0; j < finalRoutesInfoList_obj_list[i].route_Stations.length; j++) {
                  if (finalRoutesInfoList_obj_list[i].route_Stations[j].station_no == selectStation.dep.data.id) {
                    st_turn_no = finalRoutesInfoList_obj_list[i].route_Stations[j].turn_no;
                  }
                  if (finalRoutesInfoList_obj_list[i].route_Stations[j].station_no == selectStation.dest.data.id) {
                    ar_turn_no = finalRoutesInfoList_obj_list[i].route_Stations[j].turn_no;
                  }
                }
                for (var j = 0; j < finalRoutesInfoList_obj_list[i].route_Stations.length; j++) {
                  // 정류소 목록을 가져올때, turn_no가 빠른 순이 승차정류소 또는 노선의 출발정류소 이므로, 배열의 순서를 승차정류소가 빠른 배열로 오도록 수정한다.
                  if (st_turn_no <= finalRoutesInfoList_obj_list[i].route_Stations[j].turn_no && ar_turn_no >= finalRoutesInfoList_obj_list[i].route_Stations[j].turn_no) {
                    route_temp.push(finalRoutesInfoList_obj_list[i].route_Stations[j]);
                  }
                }
                setRadioRouteNumber(finalRoutesInfoList_obj_list[i].route_no); //노선리스트 기본 값 입력

                setLoading(true);
                ajax_SK_PathExplorer(finalRoutesInfoList_obj_list[i])
                setLoading(true);
                setTimeout(() => {
                  ajax_SK_Real_PathExplorer(route_temp);
                }, 1500); // API를 연속으로 데이터를 보낼 경우, API초당 요청 건수 오류가 뜰 수 있으므로, 1500ms만큼의 시간을 준다
              }
            }

          }
        }
      } else {
        setFinalRoutesInfoList(''); // 노선 정보 비우기
        setRadioRouteNumber(''); // 라디오 버튼 정보 비우기
      }
    }

    /**
     * 마커 생성 함수
     * @param {*} drtstaion 모든 DRT 정류소 정보
     * @param {*} seq 정류소 종류 구분
     * @param {*} dep 승차 정류소
     * @param {*} dest 하차 정류소
     * 해당 정보를 갖고 정류소 마커를 표시해 주기 위해,
     * 승차 정류소는 출발 마커, 하차 정류소는 도착 마커를 찍어주며
     * 정류소 구분을 통하여, DRT정류소 인지 버스 정류소인지 구분해 주기 위해 사용
     * 네이버맵 API 마커 생성 부분 참조
     */
    function createMarker(drtstaion, seq, dep, dest) {
      markerLists = [];
      markerInfoLists = [];
      for (var i = 0, ii = drtstaion.length; i < ii; i++) {
        if (drtstaion[i].station_active_fl == 'ACTIVE') {
          // 정류소가 active 상태인 경우에만 마크 생성,
          var url = '';
          if (drtstaion[i].station_no == dep) { // 승차지인 경우
            url = '/static/mapicon/start_text.png';
          }
          else if (drtstaion[i].station_no == dest) { // 하차지인 경우
            url = '/static/mapicon/arrival_text.png';
          }
          else if (seq == 'drt') { // DRT 버스정류소
            url = '/static/mapicon/drt_busstation.png'
          }
          var marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(drtstaion[i].station_lat, drtstaion[i].station_lng),
            map: map,
            icon: {
              url: url,
              scaledSize: new naver.maps.Size(25, 25),
              origin: new naver.maps.Point(0, 0),
            },
            id: drtstaion[i].station_no
          });
          marker.set('seq', i);
          marker.set('st_no', drtstaion[i].station_no); // 정류소 검색 후, 마커 선택시 사용하게될 마커 변수?
          markerLists.push(marker);
          // 말풍선
          var markerInfo = new naver.maps.InfoWindow({
            content: markerInfoWindow('drt', drtstaion[i]),
            disableAnchor: true, //기본 말풍선 꼬리의 사용 여부(false : 사용,  true : 미사용, defautl : false)
            // maxWidth: 200, //정보 창의 최대 너비
            backgroundColor: '#fff', // 정보 창의 배경색(default : #fff)
            borderColor: '#fff', //정보 창의 테두리 색상(default : #333)
            borderWidth: 0, //정보 창 테두리 두께(default : 1)
            pixelOffset: new naver.maps.Point(0, -5) //마커와 정보 창간 거리
          });
          markerInfo.set('st_no', drtstaion[i].station_no); // 정류소 검색 후, 마커 선택시 사용하게될 마커 변수?
          markerInfoLists.push(markerInfo);
          marker = null;
        }
      }
      return true;
    }



    // 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
    // 네이버맵 API (다수의 마커에 이벤트 핸들러 사용하기) 참조 (https://navermaps.github.io/maps.js.ncp/docs/tutorial-marker-viewportevents.example.html)
    function getClickHandler(seq) {
      return function (e) {
        var marker = markerLists[seq],
          markerInfo = markerInfoLists[seq];

        if (markerInfo.getMap()) {
          markerInfo.close();
        } else {
          markerInfo.open(map, marker);
          setSelectFindStation('');
          // 이벤트 핸들러가 여러번 등록되는 현상이 있어, 핸들러를 등록하기전에 등록된 핸들러를 삭제한다
          removeInfoWindEvents();
          {/* [닫기 버튼] 이벤트 바인딩 */ }
          $("#closeWindow").bind("click", function () {
            setSelectFindStation('');
            setSelectFindAddress('');
            markerInfo.close(); // 마커 닫기
            return false;
          });
          {/* [승차정류소 입력] 이벤트 바인딩 */ }
          $("#startStation").bind("click", function () {
            if (isRsvPersonCheck) {
              alert('예약고객의 승차정류소는 변경할 수 없습니다.');
              return false;
            }
            if (selectStation.dest.data) {
              if (selectStation.dest.data.id == document.getElementById('stationtId').textContent) {
                // 선택한 정류소가 하차정류지와 같은 경우, 하차 정류소 정보를 정보를 비워주어 승차지와의 충돌을 막기위해
                selectDestStationInfos(false);
              }
            }
            setSelectFindStation('');
            setSelectFindAddress('');
            selectDepStationInfos(false);
            check_this_station_include_route_stations(document.getElementById('stationtId').textContent, 'dep');
            selectDepStationInfos({
              name: document.getElementById('stationtName').textContent,
              id: document.getElementById('stationtId').textContent,
              address: document.getElementById('stationAddr').textContent,
              lat: document.getElementById('stationtLat').textContent,
              lng: document.getElementById('stationtLng').textContent,
              img: document.getElementById('stationMarker').getAttribute('src'),
              // img : "/static/mapicon/start_text.png"
            });
            setDepStationNumber(document.getElementById('stationtId').textContent);
            markerInfo.close();
            return false;
          });
          {/* [하차정류소 입력] 이벤트 바인딩 */ }
          $("#arrivalStation").bind("click", function () {
            if (isRsvPersonCheck) {
              alert('예약고객의 하차정류소는 변경할 수 없습니다.');
              return false;
            }
            if (selectStation.dep.data) {
              if (selectStation.dep.data.id == document.getElementById('stationtId').textContent) {
                // 선택한 정류소가 승차정류지와 같은 경우, 승차 정류소 정보를 정보를 비워주어 승차지와의 충돌을 막기위해
                selectDepStationInfos(false);
              }
            }
            setSelectFindStation('');
            setSelectFindAddress('');
            selectDestStationInfos(false);
            check_this_station_include_route_stations(document.getElementById('stationtId').textContent, 'dest');
            selectDestStationInfos({
              name: document.getElementById('stationtName').textContent,
              id: document.getElementById('stationtId').textContent,
              address: document.getElementById('stationAddr').textContent,
              lat: document.getElementById('stationtLat').textContent,
              lng: document.getElementById('stationtLng').textContent,
              img: document.getElementById('stationMarker').getAttribute('src'),
            });
            setDestStationNumber(document.getElementById('stationtId').textContent);
            markerInfo.close();
            return false;
          });
        }
      }
    }

    // 말풍선에 등록되어있던 이벤트 제거 함수
    function removeInfoWindEvents() {
      $("#closeWindow").unbind("click");
      $("#startStation").unbind("click");
      $("#arrivalStation").unbind("click");
    };

    // 네이버맵 API (다수의 마커에 이벤트 핸들러 사용하기)
    // 참조 (https://navermaps.github.io/maps.js.ncp/docs/tutorial-marker-viewportevents.example.html)
    function updateMarkers(map, markers) {
      var mapBounds = map.getBounds();
      var marker, position;
      for (var i = 0; i < markers.length; i++) {
        marker = markers[i]
        position = marker.getPosition();
        if (mapBounds.hasLatLng(position)) showMarker(map, marker);
        else hideMarker(map, marker);
      }
    };

    // 네이버맵 API (다수의 마커에 이벤트 핸들러 사용하기)
    // 참조 (https://navermaps.github.io/maps.js.ncp/docs/tutorial-marker-viewportevents.example.html)
    function showMarker(map, marker) {
      if (marker.setMap()) return;
      marker.setMap(map);
    };

    // 네이버맵 API (다수의 마커에 이벤트 핸들러 사용하기)
    // 참조 (https://navermaps.github.io/maps.js.ncp/docs/tutorial-marker-viewportevents.example.html)
    function hideMarker(map, marker) {
      if (!marker.setMap()) return;
      marker.setMap(null);
    };

    /**
     * 운행경로 탐색 API
     * http://tmapapi.sktelecom.com/main.html#webv2/usecase/UseCasePathSearch
     * @param {*} datas 노선의 정류소 정보들
     * 전달 받은 정류소 정보들에서 노선 기점, 종점 정보와 경유지 정보를 추출하여 SK 경로안내 API로 전송하여
     * 이동경로 정보 및 운행 시간, 운행 거리를 받아온다
     */
    function ajax_SK_PathExplorer(datas) {
      var start_lat = '';
      var start_lng = '';
      var end_lat = '';
      var end_lng = '';
      var passList = '';
      var prtcl;
      var headers = {};
      var passList_array = new Array();

      var center_lat = '';
      var center_lng = '';

      for (var i = 0; i < datas.route_Stations.length; i++) {
        // 받아온 정류소에서 처음과 끝은 승/하차지
        if (i == 0) {
          start_lat = datas.route_Stations[i].station_lat;
          start_lng = datas.route_Stations[i].station_lng;
        } else if (i == datas.route_Stations.length - 1) {
          end_lat = datas.route_Stations[i].station_lat;
          end_lng = datas.route_Stations[i].station_lng;
        } else {
          passList_array.push(createLatLng(datas.route_Stations[i].station_lat, datas.route_Stations[i].station_lng));
        }
      }

      for (var i = 0; i < passList_array.length; i++) {
        //passList 형태 = "array[0].lng","array[0].lat_array[1].lng","array[1].lat_array[2].lng","array[2].lat_array[3].lng","array[3].lat",
        if (i == 0) {
          passList += "" + passList_array[i].lng + ", " + passList_array[i].lat + "_";
        } else if (i == passList_array.length - 1) {
          passList += "" + passList_array[i].lng + ", " + passList_array[i].lat + "";
        } else {
          passList += "" + passList_array[i].lng + ", " + passList_array[i].lat + "_";
        }
      }

      center_lat = passList_array[parseInt(passList_array.length / 2)].lat; // 경유지를 그릴 때, 지도 이동을 시키기 위한 Lat, (노선의 중간 경유지)
      center_lng = passList_array[parseInt(passList_array.length / 2)].lng; // 경유지를 그릴 때, 지도 이동을 시키기 위한 Lng, (노선의 중간 경유지)
      headers["appKey"] = "a3bb2817-6417-4060-bd8f-b1ca928ef831";
      $.ajax({
        method: "POST",
        headers: headers,
        url: "https://apis.openapi.sk.com/tmap/routes?version=1&format=json",
        async: false,
        data: {
          startX: start_lng,
          startY: start_lat,
          endX: end_lng,
          endY: end_lat,
          passList: passList, //경유지
          reqCoordType: "WGS84GEO",
          resCoordType: "WGS84GEO",
          angle: "172",
          searchOption: "0",
          trafficInfo: "Y"
        },
        success: function (response) {
          prtcl = response;
          // 범용 소용시간 state SET
          setTotalTime(prtcl.features[0].properties.totalTime);
          setTotalDistance(prtcl.features[0].properties.totalDistance);

          // 경유지 그리기
          drawData(prtcl, center_lat, center_lng);
          setTimeout(() => {
            setLoading(false);
          }, 500);
        },
        error: function (request, status, error) {
          console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
          setTimeout(() => {
            setLoading(false);
            ajax_SK_PathExplorer(datas)
          }, 1500);
        }
      });
    }

    /**
     * 경로 데이터를 가지고,
     * 네이버 Polyline API함수를 이용해 지도에 경로를 그려주고,
     * 경로의 중간 정류소로 지도를 이동시켜 주기 위해
     * @param {*} data 경로 데이터
     * @param {*} lat 경로의 중간 정류소 lat
     * @param {*} lng 경로의 중간 정류소 lng
     */
    function drawData(data, lat, lng) {
      // 지도에 경로 그리기
      // 네이버맵 api, SK 경로탐색 api 참고
      var ar_line = [];
      var pointArray = [];
      var tmp_latlng = new naver.maps.LatLng(lat, lng);

      for (var i = 0; i < data.features.length; i++) {
        var feature = data.features[i];
        //배열에 경로 좌표 저장
        if (feature.geometry.type == "LineString") {
          ar_line = [];
          for (var j = 0; j < feature.geometry.coordinates.length; j++) {
            var startPt = new naver.maps.LatLng(feature.geometry.coordinates[j][1], feature.geometry.coordinates[j][0]);
            ar_line.push(startPt);
            pointArray.push(feature.geometry.coordinates[j]);
          }
          var polyline = '';
          polyline = new naver.maps.Polyline({
            map: map,
            path: ar_line,
            strokeWeight: 5, // 선 두께
            strokeColor: "#DF0101", // 선 색상
            strokeStyle: "solid", // 선 스타일
            strokeLineCap: "round", // 선 마감 스타일(butt, round, square)
            strokeLineJoin: "round", // 선 꺽임 스타일(miter, round, bevel)
          });
        }
      }
      map.panTo(tmp_latlng);
    };

    /**
     * 실제 승객이 이동한 경로를 구하기 위해 사용
     * @param {*} datas 승객이 실제로 이동하게될 정류소 정보
     * TODO : 운행경로 탐색 API와 같은 API를 사용하므로, 통합하는게 좋을 것 같다고 생각함
     */
    function ajax_SK_Real_PathExplorer(datas) {
      // 실제 승객 이동 경로 탐색 API
      var start_lat = '';
      var start_lng = '';
      var end_lat = '';
      var end_lng = '';
      var passList = '';
      var prtcl;
      var headers = {};
      var passList_array = new Array();

      for (var i = 0; i < datas.length; i++) {
        if (i == 0) {
          start_lat = datas[i].station_lat;
          start_lng = datas[i].station_lng;
        } else if (i == datas.length - 1) {
          end_lat = datas[i].station_lat;
          end_lng = datas[i].station_lng;
        } else {
          passList_array.push(createLatLng(datas[i].station_lat, datas[i].station_lng));
        }
      }
      for (var i = 0; i < passList_array.length; i++) {
        if (i == 0) {
          passList += "" + passList_array[i].lng + ", " + passList_array[i].lat + "_";
        } else if (i == passList_array.length - 1) {
          passList += "" + passList_array[i].lng + ", " + passList_array[i].lat + "";
        } else {
          passList += "" + passList_array[i].lng + ", " + passList_array[i].lat + "_";
        }
      }

      headers["appKey"] = "a3bb2817-6417-4060-bd8f-b1ca928ef831";
      $.ajax({
        method: "POST",
        headers: headers,
        url: "https://apis.openapi.sk.com/tmap/routes?version=1&format=json",
        async: false,
        data: {
          startX: start_lng,
          startY: start_lat,
          endX: end_lng,
          endY: end_lat,
          passList: passList, //경유지	
          reqCoordType: "WGS84GEO",
          resCoordType: "WGS84GEO",
          angle: "172",
          searchOption: "0",
          trafficInfo: "Y"
        },
        success: function (response) {
          prtcl = response;
          // 범용 소용시간 state SET	
          setPersonTotalTime(Math.ceil(prtcl.features[0].properties.totalTime / 60));
          setPersonTotalDistance(prtcl.features[0].properties.totalDistance);
          setLoading(false);
        },
        error: function (request, status, error) {
          console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
          setTimeout(() => {
            ajax_SK_Real_PathExplorer(datas);
          }, 1500);
          setLoading(false);
        }
      });
    }

  }, [drtstation, selectStation, radioRouteNumber, depIncludeRouteStation, destIncludeRouteStation, depStationNumber, destStationNumber,
    selectFindStation, selectFindAddress]);

  useEffect(() => {
    // station_no: 9
    // station_nm: "대교3리노인회관"
    // station_lat: "36.502643"
    // station_lng: "127.21312"
    // station_address: "대교3리노인회관"
    // station_active_fl: "ACTIVE"
    // reg_date: "20200321211748"
    // 최근 승차지 클릭 한 경우
    if (currentStartsCheck) {
      if (currentStarts != '') {
        let stFlag = false; // 선택 가능한 정류소 유무를 판별하기 위한 flag
        if (selectStation.dest.data) {
          // 하차지 있는지 체크
          if (selectStation.dest.data.id == currentStarts.station_no) {
            // 선택한 정류소가 하차지랑 같은지 체크
            // 같으면 하차지 정보 제거, 승차지와 하차지가 같아서 생길 버그 차단
            // 하차 정류소가 승차 정류소로 변경 되면, 지도에는 하나의 마커만 찍히게 되므로 선택가능한 정류소가 된다
            selectDestStationInfos(false);
            stFlag = true;
          }
        }
        for (var i = 0; i < destIncludeRouteStation.length; i++) {
          if (destIncludeRouteStation[i].station_no == currentStarts.station_no) {
            // 하차 정류소가 포함된 노선의 정류소 정보중에, 선택된 최근 승차지가 있는지 탐색
            // 하차 정류소가 먼저 찍혀 있는 상태에서 하차정류소가 포함된 노선의 정류소들만 선택가능하여야 하므로
            stFlag = true;
          }
        }
        if (selectStation.dest.data) {
          // 우선적으로 선택된 하차정류소가 존재한다면, FLAG를 통해 해당 정류소가 선택 가능한지를 살핀다
          if (stFlag) { // 선택가능한 정류소 라면,
            setSelectFindStation('');
            setSelectFindAddress('');
            selectDepStationInfos(false);
            check_this_station_include_route_stations(currentStarts.station_no, 'dep');
            selectDepStationInfos({
              name: currentStarts.station_nm,
              id: currentStarts.station_no,
              address: currentStarts.station_address,
              lat: currentStarts.station_lat,
              lng: currentStarts.station_lng,
              img: '/static/mapicon/drt_busstation.png'
            });
            setDepStationNumber(currentStarts.station_no);
          } else {
            alert("선택된 하차 정류소의 노선에 포함된 정류소가 아닙니다.");
            setCurrentStarts('');
            setCurrentStartsCheck(false);

          }
        } else {
          // 하차 정류소가 없을 경우, 승차정류소는 제약이 없으므로 아무 정류소든 선택이가능하다
          // 우선적으로 선택된 하차정류소가 없다면, 해당 정류소 정보를 등록
          setSelectFindStation('');
          setSelectFindAddress('');
          selectDepStationInfos(false);
          check_this_station_include_route_stations(currentStarts.station_no, 'dep');
          selectDepStationInfos({
            name: currentStarts.station_nm,
            id: currentStarts.station_no,
            address: currentStarts.station_address,
            lat: currentStarts.station_lat,
            lng: currentStarts.station_lng,
            img: '/static/mapicon/drt_busstation.png'
          });
          setDepStationNumber(currentStarts.station_no);
        }
      }
    }
  }, [currentStarts])

  useEffect(() => {
    // 최근 하차지 클릭 한 경우
    if (currentArrivalsCheck) {
      if (currentArrivals != '') {
        let arFlag = false;

        if (selectStation.dep.data) {
          if (selectStation.dep.data.id == currentArrivals.station_no) {
            // 선택한 정류소가 승/하차 정류소에 있을 경우, 승/하차정류소 지우고 넣기
            // 선택한 정류소가 승차지랑 같은지 체크
            // 같으면 승차지 정보 제거, 승차지와 하차지가 같아서 생길 버그 차단
            // 승차 정류소가 하차 정류소로 변경 되면, 지도에는 하나의 마커만 찍히게 되므로 선택가능한 정류소가 된다
            selectDepStationInfos(false);
            arFlag = true;
          }
        }

        for (var i = 0; i < depIncludeRouteStation.length; i++) {
          if (depIncludeRouteStation[i].station_no == currentArrivals.station_no) {
            // 하차 정류소가 포함된 노선의 정류소 정보중에, 선택된 최근 승차지가 있는지 탐색
            // 하차 정류소가 먼저 찍혀 있는 상태에서 하차정류소가 포함된 노선의 정류소들만 선택가능하여야 하므로
            arFlag = true;
          }
        }

        // 승차 정류소가 있을 경우, 플래그가 true일 경우에만 선택이 가능하다
        if (selectStation.dep.data) {
          if (arFlag) {
            setSelectFindStation('');
            setSelectFindAddress('');
            selectDestStationInfos(false);
            check_this_station_include_route_stations(currentArrivals.station_no, 'dest');
            selectDestStationInfos({
              name: currentArrivals.station_nm,
              id: currentArrivals.station_no,
              address: currentArrivals.station_address,
              lat: currentArrivals.station_lat,
              lng: currentArrivals.station_lng,
              img: '/static/mapicon/drt_busstation.png'
            });
            setDestStationNumber(currentArrivals.station_no);
          } else {
            alert("선택된 승차 정류소의 노선에 포함된 정류소가 아닙니다.");
            setCurrentArrivals('');
            setCurrentArrivalsCheck(false);
          }
        } else { // 승차 정류소가 없을 경우, 하차 정류소의 선택에 제약이 없으므로 아무 정류소든 선택이가능하다
          setSelectFindStation('');
          setSelectFindAddress('');
          selectDestStationInfos(false);
          check_this_station_include_route_stations(currentArrivals.station_no, 'dest');
          selectDestStationInfos({
            name: currentArrivals.station_nm,
            id: currentArrivals.station_no,
            address: currentArrivals.station_address,
            lat: currentArrivals.station_lat,
            lng: currentArrivals.station_lng,
            img: '/static/mapicon/drt_busstation.png'
          });
          setDestStationNumber(currentArrivals.station_no);
        }
      }
    }

  }, [currentArrivals])

  const markerInfoWindow = (seq, stationInfo) => {
    // 마커 말풍선 생성
    // 참조 https://navermaps.github.io/maps.js.ncp/docs/tutorial-1-infowindow-simple.example.html
    if (seq == "drt") seq = "drt_busstation";
    else seq = "busstation";

    var tpl = '<div id="stationInfo" style="min-width:210px; margin:10px; font-family:NotoSansCJKkr;">' +
      '<div style="position:relative;">' +
      '<img id="stationMarker"style="width:23px; height:23px; position:absolute; left:0; top:0;" src="/static/mapicon/' + seq + '.png"/>' +
      '<div style=" margin-left:25px; padding-top:2px; position:relative;">' +
      '<div style="position:relative;">' +
      '<span id="stationtName" style="font-size:13px; color:#313131; font-weight:normal;" lat="' + stationInfo.station_lat + '"lng="' + stationInfo.station_lng + '">' + stationInfo.station_nm + '</span>' +
      '<span style="color:#717171; margin:0 2px;">|</span>' +
      '<span id="stationtId" style="font-size:13px; right:0; top:0; font-weight:500; color: #313131; margin-right:12px;">' + stationInfo.station_no + '</span>' +
      '</div>' +
      '<span style="font-size:11px; line-height:normal; letter-spacing:-0.1px; color:#717171;">(<span id="stationAddr">' + stationInfo.station_address + '</span>)</span>' +
      '<img id="closeWindow" style="position:absolute; top:0; right:0; width:10px; height:9px; background-color:transparent; object-fit:contain; cursor:pointer; " src="/static/buttonicon/x-button-black.png"/>' +
      '</div>' +
      '</div>' +
      '<div style="width:100%; height:21px; position:relative; margin-top:12px; font-weight: normal; font-stretch:normal; font-style:normal; line-height:1.15; letter-spacing:normal;">' +
      '<a id="startStation" style="width:45%; cursor:pointer; position:absolute; left:0; padding:4px; font-size:12px; background-color:#679b4d; color:#ffffff; text-align:center;">' + '승차정류소 입력' + '</a>' +
      '<a id="arrivalStation" style="width:45%; cursor:pointer; position:absolute; right:0; padding:4px; font-size:12px; background-color:#d85b4e; color:#ffffff; text-align:center">' + '하차정류소 입력' + '</a>' +
      '</div>' +
      '<span id="stationtLat" style="display:none;">' + stationInfo.station_lat + '</span>' +
      '<span id="stationtLng" style="display:none;">' + stationInfo.station_lng + '</span>' +
      '</div>';
    return tpl;
  }

  // 경유지 좌표들 생성용  - 추후 삭제 해볼것 
  function createLatLng(lat, lng) {
    return { lat, lng };
  }

  /**
   * 선택된 정류소를 포함한 노선들의 정류소 정보를 구하는 함수
   * 
   * @param {*} station_no 선택된 정류소 번호
   * @param {*} seq 선택 종류 ('dep', 'dest)
   * 
   * 정류소 정보들을 구한 뒤, setDepIncludeRouteStation, setDestIncludeRouteStation에 저장해 준다
   */
  const check_this_station_include_route_stations = (station_no, seq) => {
    // TODO : route_station API 말고, 바뀐 API로 변경해야함
    if (allRouteStation) {
      var willChangeMakerList = [];
      var routeNo = [];
      var stationNo = [];
      for (var i = 0; i < allRouteStation.length; i++) {
        // 모든 노선정류소 정보에서 station_no가 포함된 노선 번호 탐색 및 취합
        if (station_no == allRouteStation[i].station_no) {
          // 선택된 정류소가 포함된 노선이 무었인지 알수 있다.
          routeNo.push(allRouteStation[i].route_no);
        }
      }

      for (var i = 0; i < routeNo.length; i++) {
        for (var j = 0; j < allRouteStation.length; j++) {
          // 위에서 구한 노선번호 배열을 갖고, 전체 노선정류소에서 해당 노선을 찾는다
          if (routeNo[i] == allRouteStation[j].route_no) {
            // 탐색된 노선에서 정류소 번호들을 배열에 담는다
            stationNo.push(allRouteStation[j].station_no);
          }
        }
      }
      // 가져온 노선의 정류소 번호에서 중복 제거
      stationNo = Array.from(new Set(stationNo));

      for (var i = 0; i < stationNo.length; i++) {
        for (var j = 0; j < drtstation.length; j++) {
          // 위에서 얻은 노선의 정류소 번호를 갖고, 전체 정류소정보에서 정류소 번호를 탐색 하여, 정류소가 갖는 정보를 담는다.
          if (stationNo[i] == drtstation[j].station_no) {
            // 정류소번호(stationNo[i])로 모든 정류소 목록에서 탐색하여 정류소 정보를 담아, 해당 정류소의 노선이 갖는 정류소 정보들을 추출한다.
            willChangeMakerList.push(drtstation[j]);
          }
        }
      }
      // 중복제거
      willChangeMakerList = Array.from(new Set(willChangeMakerList));

      // station_no의 seq가 승차인 경우
      if (seq == 'dep') {
        setDepIncludeRouteStation(willChangeMakerList);
        // station_no의 seq가 하차인 경우
      } else if (seq = 'dest') {
        setDestIncludeRouteStation(willChangeMakerList);
      }
    } else {
      return false;
    }
  }

  /**
   * 입력받은 승/하차지의 노선정류소들로 중복되는 정류소들을 추출하기 위한 함수
   * @param {*} dep 승차 정류소의 노선에 속한 정류소들의 정보
   * @param {*} dest 하차 정류소의 노선에 속한 정류소들의 정보
   * 
   * dep에 속한 정보들과, dest에 속한 정보들중 같은 정류소번호를 갖는 정류소 들을 추출하여, 승/하차지가 동시에 갖고있는 노선의 정류소들을 구한다
   * 승차 정류소의 노선에 속한 정류소들과, 하차 정류소의 노선에 속한 정류소들이 같아야 한다.
   * 승/하차지가 동시에 갖고있는 노선의 정류소들을 구한뒤 리턴
   */
  const check_selected_stations_include_route_stations = (dep, dest) => {
    var bothStationsInfo = [];
    for (var i = 0; i < dep.length; i++) {
      for (var j = 0; j < dest.length; j++) {
        if (dep[i].station_no == dest[j].station_no) {
          bothStationsInfo.push(dest[j]);
        }
      }
    }
    return bothStationsInfo;
  }


  return (
    <React.Fragment>
      <div className={classes.naverMapRoot}>
        {/* 네이버 지도 */}
        {loading &&
          <div style={{ position: "absolute", left: 0, top: 0, zIndex: 9999, width: "100%", height: "100%" }}>
            <div style={{ position: "absolute", top: "50%", right: "50%" }}>
              <CircularProgress />
            </div>
          </div>
        }
        <div id="map" className={classes.navermap}></div>
      </div>
    </React.Fragment>
  );
};

ReservationMap.getInitialProps = async props => {
  const { store, isServer } = props;
  store.dispatch(loadRouteStationListData());
  store.dispatch(selectDepStationData());
  store.dispatch(selectDestStationData());
  store.dispatch(loadRouteStationData());
  if (isServer) {
    /** 로그인이 필요한 페이지는 서버사이드 렌더링을 하지 않는다 */
  }
  return { isServer };
};
const mapStateToProps = state => {
  return {
    drtstation: state.navermap.drtstation.data,
    selectStation: { dep: state.navermap.depStationInfos, dest: state.navermap.destStationInfos },
    allRouteStation: state.routestation.allList,
    test: state,
  };
};

const mapDispatchToProps = dispatch => ({
  mapLoad: () => dispatch(loadMapData()),
  carLoad: () => dispatch(loadBusData()),
  routeStationLoad: () => dispatch(loadRouteStationData()),
  selectDepStationInfos: (depStationInfos) => dispatch(selectDepStationData(depStationInfos)),
  selectDestStationInfos: (destStationInfos) => dispatch(selectDestStationData(destStationInfos)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReservationMap);