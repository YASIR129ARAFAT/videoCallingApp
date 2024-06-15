import React from 'react'

function DropDown(
  {
    deviceList,
    defaultValue,
    handleChange,
    type,
  }
) { // video dropDown

  let dropDownElement;
  if (type === 'video') {
    dropDownElement = deviceList.map((ele, ind) => {
      return (
        <option
          key={ind}
          value={ele?.deviceId}
        >
          {ele?.label}
        </option>
      )
    })
  }
  else if (type === 'audio') {
    const audioInput = []
    const audioOutput = []

    deviceList.map((ele, ind) => {
      if (ele.kind === 'audiooutput') {
        if (ele?.deviceId !== '') {
          const val = `o${(ele)?ele.deviceId:""}`;
          audioOutput.push(
            <option
              key={ind}
              value={val}
            >
              {ele?.label}
            </option>);
        }
      }
      else if (ele.kind === 'audioinput') {
        if (ele?.deviceId !== '') {
          const val = `i${(ele)?ele.deviceId:""}`;
          audioInput.push(
            <option
              key={ind}
              value={val}
            >
              {ele?.label}
            </option>

          );
        }
      }
      return;
    })

    // console.log("jj: ", audioInput.length);
    // console.log(audioInput[0]);
    if (audioInput.length)
      audioInput.unshift(<optgroup key={"aa"} label='Audio Input' />) // grouping

    if (audioOutput.length)
      audioOutput.unshift(<optgroup key={"ca"} label='Audio Output' />)

    dropDownElement = [...audioInput, ...audioOutput]

    

  }

  return (
    <div className='caret-dropdown' style={{ top: "-60px" }}>
      <select 
      defaultValue={defaultValue} 
      onChange={(e) => {
        // console.log("clicked");
        handleChange(e)
      }}
      >
        {
          dropDownElement
        }
      </select>
       { 
        (dropDownElement.length === 0) 
        && 
        (<div className='text-red-600 text-sm '>Permission Not Given</div>)
       }
    </div>

  )
}

export default DropDown