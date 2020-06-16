export function addClass(el , className){
    if( hasClass(el , className) ){
        return;
    }
    let newClass = el.className.split(' ');
    newClass.push(className);
    el.className = newClass.join(' ');
}

export function hasClass( el , className ){
  let reg = new RegExp( '(^|\\s)' + className + '(\\s|$)' );
  return reg.test(el.className);
}

export function getData(el, name, val) {
  const prefix = 'data-';
  if (val) {
    return el.setAttribute(prefix + name, val)
  }
  return el.getAttribute(prefix + name)
}

let elementStyle = document.createElement('div').style;
let vendor = (()=>{

    let transformNames = {
        Moz : " MozTransform",
        O : "OTransform",
        ms : 'msTransform',
        webkit : "webkitTransform",
        standard : 'transform'
    };

    for( let key in transformNames ){
        let k = elementStyle[transformNames[key]];
        if( elementStyle[transformNames[key]] !== undefined ){
            return key;
        }
    }

    return false;


})();

export function prefixStyle(style) {
  if( vendor === false ){
      return false;
  }
  if( vendor === 'standard' ){
      return style;
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1);

}



































