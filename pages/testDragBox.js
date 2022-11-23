import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';

export default function DragBox() {
  var target = '#container div'; //셀렉트로 묶을 객체
  var mode = false;
  var startX = 0;
  var startY = 0;
  const [isFocus, setIsFocus] = React.useState(false);
  // const [startX, setStartX] = React.useState(0);
  // const [startY, setLeft] = React.useState(0);
  const [left, setLeft] = React.useState(0);
  const [top, setTop] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  // let selectedObj = window.getSelection();

  function handleChange(e) {
    console.log(e.target)
  }

  function handleMousedown(e) {
    mode = true;
    // console.log('333333', e.clientX, e.clientY)
    startX = e.clientX;
    startY = e.clientY;
    setWidth(0)
    setHeight(0)
    setLeft(e.clientX)
    setTop(e.clientY)
    setIsFocus(true)
    rangeSelect(e, 0, 0, 0, 0, function () { //기존에 선택된 객체를 선택취소한다.
      document.removeClass('highlight');
    });
  }

  function handleMouseup(e) {
    // console.log('33333333333333333', window.cloneContents())
    mode = false;
    setIsFocus(false)
    setWidth(0)
    setHeight(0)
    //범위 내 객체를 선택한다.
    rangeSelect(e, left, top, left + width, top + height, function (include) {
      console.log('&&&&&&')
      if (include)
        console.log('000', include)
      else
        console.log('111', include)
    });
  }

  function handleMousemove(e) {
    if (!mode) {
      return;
    }
    var x = e.clientX;
    var y = e.clientY;
    // console.log('*******************', x, y)
    //마우스 이동에 따라 선택 영역을 리사이징 한다
    setWidth(Math.max(x - startX, startX - x))
    setLeft(Math.min(startX, x))
    // $focus.css('left', left);
    // $focus.css("width", width);
    setHeight(Math.max(y - startY, startY - y));
    setTop(Math.min(startY, y))
    // $focus.css('top', top);
    // $focus.css('height', height);
  }

  function rangeSelect(e, x1, y1, x2, y2, cb) {
    // $(selector).each(function () {
    // var $this = e;
    // console.log('aaaaaaaaaa', e.clientX, e.clientY, top, left, width, height)

    // setWidth(0)
    // setHeight(0)
    // var offset = $this.offset();
    // var x = offset.left;
    // var y = offset.top;
    // var w = $this.width();
    // var h = $this.height();
    //범위 안인지 체크
    // cb.call(this, x >= x1 && y >= y1 && x + w <= x2 && y + h <= y2);
    // });
  }

  const focusStyle = {
    position: 'fixed',
    border: '1px solid red',
    backgroundColor: 'rgb(128, 0, 0, 0.3)',
    width: width,
    height: height,
    top: top,
    left: left
  }

  const checkboxStyle = {
    margin: '300px'
  }
  React.useEffect(() => {
    window.addEventListener('mousedown', handleMousedown);
    window.addEventListener('mouseup', handleMouseup);
    window.addEventListener('mousemove', handleMousemove);


  }, []);

  return (

    <div style={{ margin: '100px' }}>
      <div id="container" style={{ float: 'left' }}></div>
      {isFocus && <div className="focus" style={focusStyle} />}
      {['a', 'b', 'c', 'd', 'e',].map((data, i) => (
        <Checkbox
          key={`check_${i}`}
          type="checkbox"
          // id={data.name}
          onChange={(e) => handleChange(e.target.checked)}
        // checked={checkList.includes(data) ? true : false}
        // style={checkboxStyle}
        />
      ))}
      {/* <div className="focus" style={{ position: 'fixed', border: '1px solid red', backgroundColor: 'rgb(128, 0, 0, 0.3)' }}></div> */}
    </div>
  );
}