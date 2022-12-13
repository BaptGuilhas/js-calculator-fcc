import React,{useState} from 'react';
import ReactDOM from 'react-dom/client';
import "./styles.css"
import 'bootstrap/dist/css/bootstrap.min.css';


class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      value: []
    })
  }

  handleClick_clear() {
      this.setState({
        value : [],
      })
  }

  handleClick_operator(x) {
    let value = this.state.value.slice();
    // in case a previous operation has been done, the previous result is re-used
    if (value.includes("=")) {
      value = [...value.slice(value.findIndex(y=>y=="=")+1, value.length)] 
    }
    // in case an operator is pressed right after a first one, the first one is deleted (except for "-")
    while (["+","x","/"].includes(x) && ["+","x","/","-"].includes(value[value.length-1]))  {
      value.pop();
    }
    value.push(x)
    this.setState({
      value : value
    });
  }

handleClick_dot() {
  let value = this.state.value.slice();

  value.push(".");
  console.log(value)
  value = this.checkValueValidity_dot(value) ;
  console.log(value)
  this.setState({
    value : value
  });
}

  handleClick(x) {
    let value = this.state.value.slice();
    if (value.includes("=")) {
        value = []
    }

    value.push(x)
    if (!value.includes(".")) {
      value = this.checkValueValidity_zeros(value);
    }
    
    this.setState({ 
      value : value
    });
  }

  handleClick_equal() {
    let v_concat = "".concat(...this.state.value).match(/[\d|.]+|[= x + / -]+/gi);
    let v_numerical = v_concat.map(y=>parseFloat(y) ? parseFloat(y) : y);

    if (v_numerical[0]=="-") {
      v_numerical.splice(0,1);
      v_numerical[0] = -v_numerical[0];
    }
    for (let i=1;i<v_numerical.length;i++) {
      if ((v_numerical[i][1] && v_numerical[i][1]=="-")) {
        v_numerical[i] = v_numerical[i][0];
        v_numerical[i+1] = -v_numerical[i+1];
      }
    }

      let idMD = v_numerical.findIndex(y=>y=="x" | y=="/");
      while (idMD> -1) {
          let res = v_numerical[idMD]=="x" ? v_numerical[idMD-1] * v_numerical[idMD+1] : v_numerical[idMD-1] / v_numerical[idMD+1];
          v_numerical.splice(idMD-1,3,res)
          idMD = v_numerical.findIndex(y=>y=="x" | y=="/");
      };
      let idAS = v_numerical.findIndex(y=>y=="+" | y=="-");
      while (idAS> -1) {
          let res = v_numerical[idAS]=="+" ? v_numerical[idAS-1] + v_numerical[idAS+1] : v_numerical[idAS-1] - v_numerical[idAS+1];
          v_numerical.splice(idAS-1,3,res)
          idAS = v_numerical.findIndex(y=>y=="+" | y=="-");
      };
    //  v_numerical  is the  result of the numerical operation
    let nbOfDecimal = 4; //degree of decimal rounding
    let v_rounded = v_numerical[0].toFixed(nbOfDecimal);
    v_rounded = v_rounded.replace(/0+$/gi, "");
    v_rounded = v_rounded.replace(/[.]$/, "");
    let value = v_rounded.match(/\d|./gi);
    
   this.setState({
    value : [...this.state.value,"=",...value] 
  }) 
  
  }

  displayOperation() {
   return "".concat(...this.state.value);
  }
  displayCurrent() {
    return this.state.value.length==0 ? 0 : "".concat(...this.state.value).match(/[-*\d|.]+$|[= x + / -]$/gi)
   }

checkValueValidity_zeros(value) {
  // possible 0s at the beggining of numbers
  let v_allConcat = "".concat(...value)
  let v_concat = v_allConcat.match(/[\d|.]+|[= x + / -]+/gi);
  console.log(v_concat)
  let v_numerical = v_concat.map(y=>parseFloat(y) ? parseFloat(y) : y);
  if (v_numerical=="00") {
    v_numerical = "0"
  }
 console.log(v_numerical)
  value="".concat(...v_numerical).match(/\d|[.]|[= x + / -]/gi);
  return value
}
checkValueValidity_dot(value) {
  // doble dot in a number
let v_allConcat = "".concat(...value);
console.log(value)
let regDot = /(?=[x+-/]\d*)[.]\d*[.]/;
let indexRegDot = v_allConcat.match(regDot);
if (indexRegDot) {
  value="".concat(...value).match(/\d|[.]|[= x + / -]/gi);
  value.splice(indexRegDot["index"]+indexRegDot[0].length-1,1)
}
  return value
}


  render() {
    return (
      <div id="app">
        <div id="device">
          <div id="screen" className="">
          <div id="display-result" className="">{this.displayOperation()}</div>
          <div id="display" className="">{this.displayCurrent()}</div>
          </div>
          <div id="add" className="pads" onClick={()=>this.handleClick_operator("+")}>+</div>
          <div id="subtract" className="pads"  onClick={()=>this.handleClick_operator("-")}>-</div>
          <div id="divide" className="pads"  onClick={()=>this.handleClick_operator("/")}>/</div>
          <div id="multiply" className="pads"  onClick={()=>this.handleClick_operator("x")}>x</div>
          <div id="decimal" className="pads"  onClick={()=>this.handleClick_dot()}>.</div>
          <div id="clear" className="pads"  onClick={()=>this.handleClick_clear()}>AC</div>
          <div id="zero" className="pads" onClick={()=>this.handleClick("0")}>0</div>
          <div id="one" className="pads" onClick={()=>this.handleClick("1")}>1</div>
          <div id="two" className="pads" onClick={()=>this.handleClick("2")}>2</div>
          <div id="three" className="pads"  onClick={()=>this.handleClick("3")}>3</div>
          <div id="four" className="pads"  onClick={()=>this.handleClick("4")}>4</div>
          <div id="five" className="pads"  onClick={()=>this.handleClick("5")}>5</div>
          <div id="six" className="pads"  onClick={()=>this.handleClick("6")}>6</div>
          <div id="seven" className="pads"  onClick={()=>this.handleClick("7")}>7</div>
          <div id="eight" className="pads"  onClick={()=>this.handleClick("8")}>8</div>
          <div id="nine" className="pads"  onClick={()=>this.handleClick("9")}>9</div>
          <div id="equals" className="pads"  onClick={()=>this.handleClick_equal()}>=</div>
        </div>
      </div>
    )
  }
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Board />);
