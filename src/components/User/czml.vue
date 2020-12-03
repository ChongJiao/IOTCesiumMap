<template>
  <div></div>
</template>

<script>
// const speedList = [
//   {
//     name: '1倍速',
//     val: 1
//   },
//   {
//     name: '5倍速',
//     val: 5
//   },
//   {
//     name: '10倍速',
//     val: 10
//   },
//   {
//     name: '60倍速',
//     val: 60
//   },
//   {
//     name: '120倍速',
//     val: 120
//   },
//   {
//     name: '300倍速',
//     val: 300
//   },
//   {
//     name: '600倍速',
//     val: 600
//   }
// ]
let czmlFileNum = 0
let Cesium = null
let Viewer = null
// 更新czml数据定时器
let updateCzmlTimer = null
// 卫星集合
let satelliteAll = {}
let runSpeed = 1

/* 初始化加载czml文件路径 */
function initCzmlFileNum () {
  const day27 = new Date('2020-05-27 04:00:00').getTime()
  const nowDate = new Date(2020, 4, 27, new Date().getHours(), new Date().getMinutes(), new Date().getSeconds())
  const hLess = (nowDate - day27) / 1000 / 60 / 60
  czmlFileNum = Math.floor((hLess / 2) % 12)
}
export default {
  init (cesium_, viewer_) {
    console.log('init')
    Cesium = cesium_
    Viewer = viewer_
    initCzmlFileNum()
    this.loadSateData(true)
  },
  handleTimer () {
    const curClock = new Date(Cesium.JulianDate.toDate(Viewer.clock.currentTime)).getTime()
    const curClockH = new Date(curClock).getHours()
    // console.log(curClockH)
    const nextDateH = curClockH + (curClockH % 2 === 0 ? 2 : 1)
    // console.log(nextDateH)
    let nextDate = new Date(curClock)
    const nextClock = new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate(), nextDateH, 0, 0).getTime()
    const delay = (nextClock - curClock) / runSpeed
    updateCzmlTimer && clearInterval(updateCzmlTimer)
    updateCzmlTimer = setInterval(() => {
      czmlFileNum = (czmlFileNum + 1) % 12
      this.loadSateData()
    }, delay)
  },
  loadCzmlFromTime (timeStr) {
    const timeClock = new Date(timeStr)
    const day27 = new Date('2020-05-27 04:00:00').getTime()
    const nowDate = new Date(2020, 4, 27, timeClock.getHours(), timeClock.getMinutes(), timeClock.getSeconds())
    let number = nowDate - day27
    if (timeClock.getHours() < 4) {
      number = 24 - 4 + timeClock.getHours()
    }
    const hLess = (number) / 1000 / 60 / 60
    czmlFileNum = Math.floor((hLess / 2) % 12)
    let p = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.loadSateData(false, true))
      }, 10)
    })
    return p
  },
  /* 初始化轨道数据 */
  loadSateData (isInit = false, loadWithTask = false) {
    const satelliteNodeList = [
      'G1', 'G2', 'G3', 'G4', 'G5',
      'A11', 'A12', 'A13', 'A21', 'A22', 'A23',
      'A31', 'A32', 'A33', 'A41', 'A42', 'A43',
      'A51', 'A52', 'A53',
      'B11', 'B12', 'B13', 'B21', 'B22', 'B23',
      'B31', 'B32', 'B33', 'B41', 'B42', 'B43',
      'B51', 'B52', 'B53',
      'C11', 'C12', 'C13', 'C21', 'C22', 'C23',
      'C31', 'C32', 'C33', 'C41', 'C42', 'C43',
      'C51', 'C52', 'C53']
    console.log('load sate data')
    Viewer.dataSources.removeAll()
    satelliteAll = {}
    let p = new Promise((resolve, reject) => {
      console.log('load', `./static/czml/${czmlFileNum}-4/`)
      for (let it of satelliteNodeList) {
        const dataSrc = Cesium.CzmlDataSource.load(`./static/czml/${czmlFileNum}-4/${it}.czml`)
        // const dataSrc = Cesium.CzmlDataSource.load(`./static/czml/5-4/A11.czml`)
        Viewer.dataSources.add(dataSrc)
          .then(dataSource => {
            const satellite = dataSource.entities.values
            // console.log(satellite)
            satellite[0].show = false
            satellite[0].info = it
            // console.log(satellite)
            // 设置时钟倍数
            //
            if (!loadWithTask) {
              Viewer.clock.multiplier = runSpeed
            }
            if (isInit) {
              const date = new Date()
              const nowDate = new Date(2020, 5, 27, date.getHours(), date.getMinutes(), date.getSeconds())
              // console.log( date.toLocaleDateString(), 'lllll')
              setTimeout(() => {
                Viewer.clock.currentTime = Cesium.JulianDate.fromDate(nowDate).clone()
                // console.log(new Date(Viewer.clock.currentTime).toLocaleDateString(), 'Viewer.clock.currentTime')
              },
              2000)
            }
            // 所有卫星
            satelliteAll[it] = satellite
            if (it === 'C53') {
              resolve(satelliteAll)
            }
          }, reason => {
            console.log(reason)
            reject(new Error('-1'))
          })
      }
    })
    if (!loadWithTask) {
      setTimeout(() => {
        this.handleTimer()
      }, 2000)
    }
    return p
  },
  // 显示轨道
  openStar (flag) {
    let allData = this.GetAllSatellite()
    for (let key in allData) {
      if (key === 'G1' || key === 'G2' || key === 'G3' || key === 'G4' || key === 'G5') {
        continue
      }
      allData[key][0].show = flag
    }
  },
  // 控制倍速
  changeSpeed (speed) {
    runSpeed = speed
    Viewer.clock.multiplier = runSpeed
    this.handleTimer()
  },
  GetAllSatellite () {
    return satelliteAll
  },
  // 获取某个时刻所有卫星位置信息，并且计算最近距离
  GetTimeStarPos (tmpDate, starData, userPos, startSet) {
    return new Promise((resolve, reject) => {
      const setDate = new Date(2020, 5, 27, tmpDate.getHours(), tmpDate.getMinutes(), tmpDate.getSeconds())
      Viewer.clock.currentTime = Cesium.JulianDate.fromDate(setDate).clone()
      const DISTANCE = 800 * 1000
      setTimeout(() => {
        let resultList = []
        for (let satellite of starData) {
          const starPos = satellite[0].position.getValue(Viewer.clock.currentTime)
          if (starPos === undefined) {
            resolve(resultList)
          }
          const distance = Cesium.Cartesian3.distance(starPos, userPos)

          if (distance < DISTANCE && !startSet.has(satellite[0].id)) {
            resultList.push(satellite[0].info)
          }
        }
        resolve(resultList)
        // }
      }, 40)
    })
  },
  // 计算某个时间段下的卫星和绘制坐标的最近距离
  GetNearestStarList (startDateStr, endDateStr, posLat, posLng) {
    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)
    console.log(startDate, 'startDate')
    console.log(endDate, 'endDate')
    // console.log(allData, 'satellite name')
    let userPos = Cesium.Cartesian3.fromDegrees(posLng, posLat, 0)
    console.log(userPos, 'userPos')
    let nearStarDict = []
    let starSet = new Set()
    return new Promise((resolve, reject) => {
      this.loadCzmlFromTime(startDateStr).then(async (starData) => {
        var timeSecondDiff = (endDate.getTime() - startDate.getTime()) / 1000
        timeSecondDiff = parseInt((timeSecondDiff / 60)) * 60
        starData = Object.values(starData)

        for (let i = 0; i < timeSecondDiff; i += 60) {
          const tmpDate = new Date(startDate.getTime() + i * 1000)
          let nameList = await this.GetTimeStarPos(tmpDate, starData, userPos, starSet)
          if (nameList.length !== 0) {
            for (let name of nameList) {
              nearStarDict.push({'time': tmpDate.getTime(), 'star': name})
              starSet.add(name)
            }
          }
        }
        resolve(nearStarDict)
        initCzmlFileNum()
        this.loadSateData(true)
      }).catch((reason) => {
        console.log(reason, 'loadCzml Error')
      })
    })
  }
  /**
   * 获取卫星当前空间坐标
   * satellite 卫星实例
   * position 返回的空间坐标
   *
   */
  // const position= satellite.position.getValue(viewer.clock.currentTime);

  /**
   * 计算两个空间坐标的距离
   * positions1 positions2  空间坐标
   * distance 返回距离
   */
  // const distance=  Cesium.Cartesian3.distance(positions1, positions2)
}
</script>

<style>
</style>
