import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
// import MainPage from '../EmptyContainer/EmptyContainer'
import "./patternlock.less";
import { SwipeAction, List } from 'antd-mobile';
// import Navbar from '../Components/Navbar/Navbar'

const navBarStyle = { background: '#fff', color: '#333' }
// const leftIcon = require('../../static/images/SettingBack.png')


let pointerArr = []; //  Draw the path 
let startX, startY; // Line starting point 
let puts = []; // An array of nine points passed by 
let currentPointer; // Whether the current point is connected 
let pwd = [1,2,4,5,7]; // password 
let confirmPwd = []; // Confirm the password 
let unlockFlag = false; // Whether to unlock the logo 
let isMouseDown = false;
let arr = [];  // A coordinate array of nine points 
let canvas, ctx, width, height;
let canvasShow, ctxshow, widthShow, heightShow;

// import deviceStore from "../../store/deviceStore";


const PatternLock = ((observer(
class PatternLock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patternPassWord: [],
            setOrCheck: true,  //  Set or verify gesture password page   Set up true  obtain false
            tooEasy: false,  //  At least connect 4 A little bit 
            setAgain: false,  //  Set the gesture again 
            isFit: true, //  Whether the second gesture is the same as the first one 

        }
    }

    componentDidMount() {
        canvas = document.getElementById('canvas'); //  Draw a gesture canvas 
        ctx = canvas.getContext('2d'); //  Get the context object of the canvas 
        canvas.width = this.refs["drawPattern"].clientWidth;
        canvas.height = this.refs["drawPattern"].clientHeight;
        width = canvas.width;
        height = canvas.height; // The width and height of the canvas 
        canvasShow = document.getElementById('canvasShow'); //  The canvas of gesture display 
        ctxshow = canvasShow.getContext('2d');
        canvasShow.width = this.refs["showPattern"].clientWidth;
        canvasShow.height = this.refs["showPattern"].clientHeight;
        widthShow = canvasShow.width;
        heightShow = canvasShow.height; // The width and height of the canvas 
        console.log(canvas.offsetTop, width, height)
        // Jiugonggezhong 9 A point coordinate object 
        let lockCicle = {
            x: 0, //x coordinate 
            y: 0, //y coordinate 
            showX: 0,   //  Point coordinates of gesture display 
            showY: 0,
            color: "#999999",
            state: "1", //  Current point state , Whether it has been linked 
            stateShow: "1", //  The point state of gesture display 
        };
        let offset = (width - height) / 2; // Calculate the offset 
        arr = []; // A coordinate array of nine points 
        // Calculate the coordinates of nine points 
        for (let i = 1; i <= 3; i++) {
            for (let j = 1; j <= 3; j++) {
                let lockCicle = {};
                if (offset > 0) {   // Horizontal screen 
                    lockCicle.x = (height / 4) * j + Math.abs(offset);
                    lockCicle.y = (height / 4) * i - height / 5;
                    lockCicle.state = 0;
                    lockCicle.stateShow = 0;
                } else {    // Vertical screen 
                    lockCicle.x = (width / 4) * j;
                    lockCicle.y = (width / 4) * i + Math.abs(offset) - height / 5;
                    lockCicle.state = 0;
                    lockCicle.stateShow = 0;
                }
                lockCicle.showX = (heightShow / 4) * j;
                lockCicle.showY = (heightShow / 4) * i;
                arr.push(lockCicle);
            }
        }

        // Initialization interface 
        function init() {
            ctx.clearRect(0, 0, width, height); // Empty the canvas 
            ctxshow.clearRect(0, 0, widthShow, heightShow);
            pointerArr = []; // Clear draw path 
            for (var i = 0; i < arr.length; i++) {
                arr[i].state = 0; // Clear the drawing state 
                arr[i].stateShow = 0; 
                drawPointer(i);
            }
        }
        // Initialization interface 
        init();
        // *****
        //  Draw Jiugongge unlock interface 
        // *****
        function drawPointer(i) {
            ctx.save();
            ctxshow.save();
            let radius = width / 12;
            let _fillStyle = "#ccc";
            let _strokeStyle = "#ccc";
            let _strokeStyleShow = "#ccc";
            if (arr[i].state == 1) {   // Different states display different colors 
                _strokeStyle = "#0286fa";
                _fillStyle = "#0286fa";
            }
            if(arr[i].stateShow == 1) {
                _strokeStyleShow = "#0286fa";
            }
            // Draw the origin 
            ctx.beginPath();  //  Start a path 
            ctx.fillStyle = _fillStyle;   //  Fill color 
            ctx.arc(arr[i].x, arr[i].y, 6, 0, Math.PI * 2, false);    //  Create curves  false Clockwise 
            ctx.fill();
            ctx.closePath();   //  Create a path from the current point back to the starting point 
            // Draw the origin of gesture display 
            ctxshow.beginPath();
            ctxshow.fillStyle = _strokeStyleShow;
            ctxshow.arc(arr[i].showX, arr[i].showY, 4, 0, Math.PI * 2, false);
            ctxshow.fill();
            ctxshow.closePath();
            // Draw circles 
            ctx.beginPath();
            ctx.strokeStyle = _strokeStyle;
            ctx.lineWidth = 0.3;
            ctx.arc(arr[i].x, arr[i].y, radius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();   //  Return the previously saved path state and properties 
        }
    }

    // Initialization interface 
    init = (flag) => {   // flag：true Represents the path to format the display ,false It means that there is no need for 
        ctx.clearRect(0, 0, width, height); // Empty the canvas 
        if(flag){
            ctxshow.clearRect(0, 0, widthShow, heightShow);
        }       
        pointerArr = []; // Clear draw path 
        for (var i = 0; i < arr.length; i++) {
            arr[i].state = 0; // Clear the drawing state 
            if(flag) {
                arr[i].stateShow = 0; 
            } 
            this.drawPointer(i, flag);
        }
    }
    drawPointer = (i, flag) => {
        let radius = width / 12;
        let _fillStyle = "#ccc";
        let _strokeStyle = "#ccc";
        let _strokeStyleShow = "#ccc";
        if (arr[i].state == 1) {   // Different states display different colors 
            _strokeStyle = "#0286fa";
            _fillStyle = "#0286fa";
        }
        if(arr[i].stateShow == 1) {
            _strokeStyleShow = "#0286fa";
        }
        // Draw the origin 
        ctx.save();
        ctx.beginPath();  //  Start a path 
        ctx.fillStyle = _fillStyle;   //  Fill color 
        ctx.arc(arr[i].x, arr[i].y, 6, 0, Math.PI * 2, false);    //  Create curves  false Clockwise 
        ctx.fill();
        ctx.closePath();   //  Create a path from the current point back to the starting point 
        // Draw circles 
        ctx.beginPath();
        ctx.strokeStyle = _strokeStyle;
        ctx.lineWidth = 0.3;
        ctx.arc(arr[i].x, arr[i].y, radius, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();   //  Return the previously saved path state and properties 
        if(flag) {
            // Draw the origin of gesture display 
            ctxshow.save();
            ctxshow.beginPath();
            ctxshow.fillStyle = _strokeStyleShow;
            ctxshow.arc(arr[i].showX, arr[i].showY, 4, 0, Math.PI * 2, false);
            ctxshow.fill();
            ctxshow.closePath();
        }       
    }
    // *****
    //  How to draw the connecting line , Draw the points in the coordinate array on canvas On canvas 
    // *****
    drawLinePointer = (x, y, flag) => {
        //  Draw a point-to-point line 
        ctx.clearRect(0, 0, width, height);   //  Empty the canvas 
        ctx.save();     //  Save the state of the current environment 
        ctx.beginPath();
        ctx.strokeStyle = "#0286fa";
        ctx.lineWidth = 6;
        ctx.lineCap = "round";   //  Sets or returns the end style of the line 
        ctx.lineJoin = "round";  //  The type of corner at intersection 
        for (var i = 0; i < pointerArr.length; i++) {
            if (i == 0) {
                ctx.moveTo(pointerArr[i].x, pointerArr[i].y);
            } else {
                ctx.lineTo(pointerArr[i].x, pointerArr[i].y);
            }
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        //  Save the passing points 
        for (var i = 0; i < arr.length; i++) {
            this.drawPointer(i,true); // Draw circles and origin 
            //isPointInPath Judgment point (x, y) Is it in the path , With the return true, Otherwise return to false; At the same time, judge whether the point has passed through 
            if (ctx.isPointInPath(x, y) && currentPointer != i && puts.indexOf(i + 1) < 0) {
                pointerArr.push({
                    x: arr[i].x,
                    y: arr[i].y
                });
                currentPointer = i;
                puts.push(i + 1);  //  Save the coordinate point to the path array 
                startX = arr[i].x;
                startY = arr[i].y;
                arr[i].state = 1;
                if(!this.state.setAgain) {   //  Set the gesture for the second time , Small nine palace grid no longer make corresponding changes 
                    arr[i].stateShow = 1;
                }
                
            }
        }
        //  Draw a line from the point to the current mouse coordinate 
        if (flag) {
            ctx.save();
            ctx.beginPath();
            ctx.globalCompositeOperation = "destination-over";  //  Display the target image above the source image 
            ctx.strokeStyle = "#e2e0e0";
            ctx.lineWidth = 6;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.moveTo(startX, startY);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.restore();
        }
    }
    canvasTouchStart = (e) => {
        isMouseDown = true;
        // let x1 = e.targetTouches[0].pageX;
        // let y1 = e.targetTouches[0].pageY - canvas.offsetTop;
        let x1 = e.pageX - canvas.offsetLeft;
        let y1 = e.pageY - canvas.offsetTop;
        this.drawLinePointer(x1, y1, false);
    }
    canvasTouchMove = (e) => {
        if (isMouseDown) {
            // let x1 = e.targetTouches[0].pageX;
            // let y1 = e.targetTouches[0].pageY - canvas.offsetTop;
        let x1 = e.pageX - canvas.offsetLeft;
        let y1 = e.pageY - canvas.offsetTop;
            this.drawLinePointer(x1, y1, true);
        }
    }
    canvasTouchEnd = (e) => {
        this.drawLinePointer(0, 0, false);
        isMouseDown = false;
        pointerArr = [];
        if(this.state.setOrCheck) {  //  Set gesture password page 
            if (puts.length >= 4) {
                this.setState({
                    tooEasy: false
                })
                if(this.state.setAgain) {  //  Set the gesture for the second time                    
                    if(JSON.stringify(puts)==JSON.stringify(this.state.patternPassWord)) {
                        this.setState({
                            setAgain: false,
                            isFit: true
                        })
                        alert(" Gesture password set successfully ")
                    } else {
                        console.log(" The two drawings are inconsistent , Please redraw ")
                        this.setState({
                            setAgain: false,
                            isFit: false
                        }, ()=>{
                            setTimeout(()=>{this.setState({isFit:true})},2000)  //  The two drawings are inconsistent , Redraw after two seconds 
                        })
                    }
                    console.log(puts, this.state.patternPassWord,JSON.stringify(puts)==JSON.stringify(this.state.patternPassWord),' Set the gesture for the second time ')
                    this.init(true);
                } else {    //  Set up gestures for the first time 
                    this.setState({
                        setAgain: true,
                        patternPassWord: puts,
                    })
                    this.init(false);
                }
                console.log(" Your pattern code is : [   " + puts.join("    >   ") + "   ]");
                this.init(false);
            } else {    
                if (puts.length >= 1) {
                    console.log(" The pattern code is too simple ~~~");
                    this.setState({tooEasy:true})
                    if(this.state.setAgain) {
                        this.init(false);
                    } else {
                        this.init(true);
                    }                   
                }
            }
        } else {       //  Verify the gesture page 
            if (puts.length >= 4) {
                this.setState({
                    tooEasy: false
                })
                if(JSON.stringify(puts)==JSON.stringify(pwd)) {
                    alert(" The password is unlocked successfully ")
                } else {
                    alert(" Wrong password ！ Please re-enter ")
                }
                console.log(' The password you entered ：',JSON.stringify(puts),' The actual password ：', JSON.stringify(pwd))
                this.init(true);
            } else {
                if (puts.length >= 1) {
                    console.log(" The pattern code is too simple ~~~");
                    this.setState({tooEasy:true})
                    this.init(true);                    
                }
            }
        }        
        puts = [];
    }


    render() {

        return (
            <div className="PLcontainer">
                {/* <Navbar navBarStyle={navBarStyle} backKey={1} pageTitle={this.state.setOrCheck ? ' Set gesture password ' : ' Verify the gesture code '} leftIcon={leftIcon} /> */}
                <div className="PatternLock">
                    <div className="showPattern" ref="showPattern">
                        <canvas id="canvasShow"></canvas>
                    </div>
                    <div className="tips">
                        <div className="inputTips">
                            <p>{this.state.setAgain?' Please draw the unlock pattern again ':' Please draw the unlock pattern '}</p>
                            <div className="guide">
                                <p className={`guideTips${this.state.tooEasy||!this.state.isFit?'':' hide'}`}>
                                    {this.state.isFit?' At least connect 4 A little bit , Please redraw ':' The two drawings are inconsistent , Please redraw '}
                                </p>
                            </div>                           
                        </div>
                    </div>
                    <div className="drawPattern" ref="drawPattern">
                        <canvas
                            id="canvas"
                            onTouchStart={this.canvasTouchStart}
                            onTouchMove={this.canvasTouchMove}
                            onTouchEnd={this.canvasTouchEnd}
                          onMouseDown={this.canvasTouchStart}
                          onMouseMove={this.canvasTouchMove}
                          onMouseEnd={this.canvasTouchEnd}
                        ></canvas>
                    </div>
                </div>
            </div>
        );
    }
}
)))
export default PatternLock;
