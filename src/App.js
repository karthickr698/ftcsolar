import './App.css';
import { Line } from "react-chartjs-2";
import datas from './errors.json'
import SelectSearch from 'react-select-search';
import { useState } from 'react';

function App() {

  const [showFilter,setShowFilter] = useState(false)
  const [select,setSelect]=useState(false)
  const [chartData,setChartData]=useState("")
  const [chartLabel,setChartLabel]=useState("")

  let arr={}
  let allData={}
  let options=[]

  datas.map((ele)=>{
    if(!(ele.site_id in arr)){
      arr[ele.site_id]=[ele.errorCount]
      allData[ele.site_id]=[ele]
      options.push({"name":ele.site_id,"value":ele.site_id})
    }
    else{
      arr[ele.site_id].push(ele.errorCount)
      allData[ele.site_id].push(ele)
    }
  })
  
  let label=[]
  if(!select){
    datas.map((ele)=>{
      if(!(label.includes(ele.date))){
        label.push(ele.date)
      }
    })
  }
  
  const randomColor = ()=>{
    const color=Math.floor(Math.random()*16777215).toString(16)
    return color
  }
  
  let dataset=[]
  if(!select){
    for (const prop in arr) {
      const data={
        label: prop,
        lineTension: 0,
        fill: false,
        borderColor: "#"+randomColor(), 
        data: arr[prop],
      }
      dataset.push(data)
    }
  }

  const handleOnChange=(value)=>{
    setSelect(true)
    let errorDates=[]
    allData[value].map(ele=>{errorDates.push(ele.date)})
    const data={
      label: value,
      lineTension: 0,
      fill: false,
      borderColor: "#"+randomColor(), 
      data: arr[value],
    }

    setChartData([data])
    setChartLabel(errorDates)
  }

  const handleClick = () => {
    if(showFilter){
      setShowFilter(false)
      setSelect(false)
    }
    else{
      setShowFilter(true)
    }
  }

  const stateRadar = {
    labels: !select? label : chartLabel,
    datasets: !select? dataset : chartData,
  };

  return (
    <>
      <div className="filterDiv">
        <button className="apply" onClick={handleClick}>{!showFilter?"Apply Filter":"Clear Filter"}</button>
        <div className="search">
          {showFilter?
          <SelectSearch
            options={options}
            search
            autoComplete
            onChange={handleOnChange}
            name="language"
            placeholder="Choose dashboard"
          />:null
          }
        </div>

      </div>
      <div className="chart">
        <Line
            data={stateRadar}
            options={{
              title: {
                display: true,
                text: "Error Report",
                fontSize: 20,
              },
              legend: {
                display: true,
                position: "right",
              },
              tooltips: {
                enabled: false,
                custom: function(tooltipModel) {
                    var tooltipEl = document.getElementById('chartjs-tooltip');
    
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        let stylesDiv='background-color:black; color:white;';
                        tooltipEl.innerHTML = '<table style='+stylesDiv+'></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = 0;
                        return;
                    }

                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }
    
                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }
    
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);
    
                        var innerHtml = '<thead>';
    
                        titleLines.forEach(function(title) {
                            innerHtml += '<tr><th>' + title + '</th></tr>';
                        });
                        innerHtml += '</thead><tbody>';

                        const key= tooltipModel.body[0].lines[0].split(": ")
                        const dateValue=tooltipModel.dataPoints[0].label
                        const filter=allData[key[0]]
                        const errorCode=filter.filter(ele=>ele.date==dateValue)
    
                        bodyLines.forEach(function(body, i) {
                            var colors = tooltipModel.labelColors[i];
                            var style = 'background:white';
                            style += '; border-color:' + colors.borderColor;
                            style += '; border-width: 2px';
                            var span = '<span style="' + style + '"></span>';
                            innerHtml += '<tr><td>' + span + body + '</td></tr>';
                        });
                        if(errorCode[0])
                          innerHtml += '<tr><td>' +"ErrorCode: " + errorCode[0].errorCodes.join() + '</td></tr>';
                        innerHtml += '</tbody>';
    
                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }
    
                    var position = this._chart.canvas.getBoundingClientRect();
    
                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            }
            }}
          />
        
      </div>
    </>
  );
}

export default App;
