let vals = {}
let del = 0;
let cbox = document.getElementById("cbox");
function onScanSuccess(decodedText, decodedResult) {
  // Handle on success condition with the decoded text or result.
  console.log(`Scan result: ${decodedText}`);
  qrToJson(decodedText)
  scandler(10)
}
function onScanFailure(decodedText, decodedResult){
  scandler(0)
}
var html5QrcodeScanner = new Html5QrcodeScanner(//scans qr
  "reader", { fps: 10, qrbox: 500 });
html5QrcodeScanner.render(onScanSuccess,onScanFailure);
function scandler(x){
  del += x
  if(del>0){
    del--
    cbox.style.backgroundColor = "#00FF00"
  }else{
    cbox.style.backgroundColor = "red"
  }
}
function qrToJson(input) {
  let tempa = input.split(";")//splits out diferent teams
  for (let i = 0; i < tempa.length; i++) {
    let tempb = tempa[i].split(":")//splits team and data

    if (vals[tempb[0]] == undefined) {//makes sure team is on vals
      vals[tempb[0]] = {}
    }

    let data = tempb[1].split(".")
    for (let j = 0; j < data.length; j += 7) {
      let nv = [data[j + 1], data[j + 2], data[j + 3], data[j + 4], data[j + 5], data[j + 6]]
      vals[tempb[0]][data[j]] = nv
    }
  }
  updateAllList()
  genQr()
}

//qr code shit end
let cl = document.getElementById("clear");
let bs = document.getElementById("bs");//all page swapping code
bs.addEventListener("click", () => {
  window.location.href = "main.html";
})
cl.addEventListener("click", () => {
  vals = {}
  genQr()
  for(i=0;i<100;i++){
    allchart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    allchart.data.labels.pop();
  }
  updateAllList()
  console.log(vals)
})


let qrOut = ""
let team = document.getElementById("teamnum")
let teamnum = 0

team.addEventListener("input", () => {//when you type in a team this runs
  teamnum = parseInt(team.value)
  if (vals[teamnum] != undefined) {//makes sure team is on vals
    updateVals()
  }
})
function updateAllList() {
  let ls = []
  for (i = 0; i < Object.keys(vals).length; i++) {
    let teamnum = parseInt(Object.keys(vals)[i])
    let nv = [teamnum, 0, 0, 0, 0]//new values
    let totalRound = Object.keys(vals[teamnum]).length
    for (let j = 0; j < Object.keys(vals[teamnum]).length; j++) {
      let key = vals[teamnum][Object.keys(vals[teamnum])[j]]
      nv[1] += parseInt(key[2]) + parseInt(key[3])
      nv[2] += parseInt(key[0]) + parseInt(key[1])
      nv[3] += parseInt(key[4])
    }
    for (let t = 1; t < nv.length; t++) {//divides the newvalues by total rounds
      nv[t] = nv[t] / totalRound
    }
    nv[4] = nv[1] + nv[2] + nv[3]
    ls.push(nv)
    allchart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    allchart.data.labels.pop();
  }
  ls.sort((a, b) => { if (a[4] > b[4]) {return 1} else if (a[4] < b[4]) { return -1 } return 0 })


  for(i = 0;i<ls.length;i++){
    let cval = ls.length-i-1
    allchart.data.datasets.forEach((dataset) => {//this adds the values to the line graph
      switch (dataset.label) {
        case "teleop":
          dataset.data.push(ls[cval][1])
          break;
        case "auto":
          dataset.data.push(ls[cval][2])
          break;
        case "climb":
          dataset.data.push(ls[cval][3])
          break;
        default:
          break;
      }
    });
    allchart.data.labels.push(ls[cval][0])
  }
  allchart.update();
}
function updateVals() {//updates the garpghs
  for (let i = 0; i < 13; i++) {//deletes all the stuff
    line.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    radial.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
  }
  let nv = [0, 0, 0, 0, 0, 0, 0]//new values
  let totalRound = Object.keys(vals[teamnum]).length
  for (let j = 0; j < Object.keys(vals[teamnum]).length; j++) {
    let key = vals[teamnum][Object.keys(vals[teamnum])[j]]
    nv[5] += parseInt(key[2]) + parseInt(key[3])
    nv[4] += parseInt(key[0]) + parseInt(key[1])
    nv[3] += parseInt(key[3])
    nv[2] += parseInt(key[2])
    nv[1] += parseInt(key[1])
    nv[0] += parseInt(key[0])
    nv[6] += parseInt(key[4])

    line.data.datasets.forEach((dataset) => {//this adds the values to the line graph
      switch (dataset.label) {
        case "teleop":
          dataset.data.push(parseInt(key[2]) + parseInt(key[3]))
          break;
        case "auto":
          dataset.data.push(parseInt(key[0]) + parseInt(key[1]))
          break;
        case "climb":
          dataset.data.push(parseInt(key[4]))
          break;
        default:
          break;
      }
    });

  }
  for (let t = 0; t < nv.length; t++) {//divides the newvalues by total rounds
    nv[t] = nv[t] / totalRound
  }
  radial.data.datasets.forEach((dataset) => {
    dataset.data = nv //output in radial graph
  });

  line.update();
  radial.update();
}

const radialdata = {
  labels: [
    'TeleUp',
    'TeleDown',
    'AutoUp',
    'AutoDown',
    'AutoAll',
    'TeleAll',
    'ClimbAll'
  ],
  datasets: [{
    label: 'Average Scores',
    data: [1, 2, 3, 4, 5, 6, 7],
    fill: true,
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgb(255, 99, 132)',
    pointBackgroundColor: 'rgb(255, 99, 132)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(255, 99, 132)'
  }],
};

const radialconfig = {
  type: 'radar',
  data: radialdata,
  options: {
    scales: {
      r: {
        pointLabels: {
          font: {
            size: 25
          }
        }
      }
    },
  }
};
const linedata = {
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  datasets: [{
    label: "teleop",
    data: [1, 2, 3, 4, 5, 6],
    borderColor: "rgb(255, 0, 0)",
  }, {

    label: "auto",
    data: [4, 2, 3, 4, 5, 6],
    borderColor: "rgb(0, 255, 0)",
  }, {
    label: 'climb',
    data: [1, 2, 3, 8, 5, 6],
    borderColor: "rgb(0, 0, 255)",
  }],
};

const lineconfig = {
  type: 'line',
  data: linedata,
  options: {
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 10,
        pointLabels: {
          font: {
            size: 25
          }
        }
      }
    },
  }
};

const radial = new Chart(document.getElementById('radial'), radialconfig);
const line = new Chart(
  document.getElementById('line'),
  lineconfig
);



const alldata = {
  labels: [],
  datasets: [
    {
      label: 'teleop',
      data: [],
      backgroundColor: "rgb(255, 0, 0)",
    },
    {
      label: 'auto',
      data: [],
      backgroundColor: "rgb(0, 255, 0)",
    },
    {
      label: 'climb',
      data: [],
      backgroundColor: "rgb(0, 0, 255)",
    },
  ]
};
const allconfig = {
  type: 'bar',
  data: alldata,
  options: {
    indexAxis: 'y',
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Bar Chart - Stacked'
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    }
  }
};

const allchart = new Chart(
  document.getElementById('allteams'),
  allconfig
);
  //store pit scouting data localy and transfer from paper



  var qr = new QRious({
    element: document.getElementById('qr'),
});
qr.level = 'L';
if(document.body.clientHeight>document.body.clientWidth){
  qr.size = document.body.clientWidth
}else{
  qr.size = document.body.clientHeight
}
qr.value = qrOut
  function genQr(){
    qrOut = ""
    for(let i = 0;i<Object.keys(vals).length;i++){//finds all the teams
        let iVal = vals[Object.keys(vals)[i]]
        qrOut+=Object.keys(vals)[i]+":"//adds them to a certain spot
        for(let j= 0;j<Object.keys(iVal).length;j++){//finds all the rounds
            let jVal = iVal[Object.keys(iVal)[j]]
            qrOut+=Object.keys(iVal)[j]+"."//adds them to the list
            for(let l = 0;l<6;l++){//adds all the vals
               qrOut+=jVal[l]
               if(l!=5){
                qrOut+="."
               }
            }
            if(j!=Object.keys(iVal).length-1){
              qrOut+="."  
            }
        }
        if(i!=Object.keys(vals).length-1){
            qrOut+=";"
        }
    }
    qr.value = qrOut
  }