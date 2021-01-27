"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var PropTypes = require("prop-types");
var React = require("react");
var util_1 = require("./util");
// disable touchAction, else the draw on canvas would not work
// because window would scroll instead of draw on it
var setUpForCanvas = function () {
    document.body.style.touchAction = 'none';
};
var cleanUpCanvas = function () {
    document.body.style.touchAction = null;
};
var ReactPainter = /** @class */ (function (_super) {
    __extends(ReactPainter, _super);
    function ReactPainter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canvasRef = null;
        _this.ctx = null;
        _this.lastX = 0;
        _this.lastY = 0;
        _this.scalingFactor = 1;
        _this.state = {
            canvasHeight: 0,
            canvasWidth: 0,
            color: _this.props.initialColor,
            imageCanDownload: null,
            imageDownloadUrl: null,
            isDrawing: false,
            isWritting: false,
            textToWrite: '',
            lineCap: _this.props.initialLineCap,
            lineJoin: _this.props.initialLineJoin,
            lineWidth: _this.props.initialLineWidth
        };
        _this.extractOffSetFromEvent = function (e) {
            var _a = e.nativeEvent, offsetX = _a.offsetX, offsetY = _a.offsetY, touches = _a.touches, mouseClientX = _a.clientX, mouseClientY = _a.clientY;
            // If offset coords are directly on the event we use them
            if (offsetX && offsetY) {
                return {
                    offsetX: offsetX * _this.scalingFactor,
                    offsetY: offsetY * _this.scalingFactor
                };
            }
            // Otherwise we need to calculate them themselves
            // We need to check whether user is using a touch device or just the mouse and extract
            // the touch/click coords accordingly
            var clientX = touches && touches.length ? touches[0].clientX : mouseClientX;
            var clientY = touches && touches.length ? touches[0].clientY : mouseClientY;
            var rect = _this.canvasRef.getBoundingClientRect();
            var x = (clientX - rect.left) * _this.scalingFactor;
            var y = (clientY - rect.top) * _this.scalingFactor;
            return {
                offsetX: x,
                offsetY: y
            };
        };
        _this.initializeCanvas = function (width, height, imgWidth, imgHeight) {
            if (imgWidth && imgHeight) {
                var _a = _this.getDrawImageCanvasSize(width, height, imgWidth, imgHeight), cvWidth = _a[0], cvHeight = _a[1], scalingRatio = _a[2];
                _this.canvasRef.width = imgWidth;
                _this.canvasRef.height = imgHeight;
                _this.setState({
                    canvasHeight: cvHeight,
                    canvasWidth: cvWidth
                });
                _this.scalingFactor = 1 / scalingRatio;
            }
            else {
                _this.canvasRef.width = width;
                _this.canvasRef.height = height;
                _this.setState({
                    canvasHeight: height,
                    canvasWidth: width
                });
            }
            var _b = _this.state, color = _b.color, lineWidth = _b.lineWidth, lineJoin = _b.lineJoin, lineCap = _b.lineCap;
            _this.ctx = _this.canvasRef.getContext('2d');
            _this.ctx.strokeStyle = color;
            _this.ctx.lineWidth = lineWidth * _this.scalingFactor;
            _this.ctx.lineJoin = lineJoin;
            _this.ctx.lineCap = lineCap;
        };
        _this.getDrawImageCanvasSize = function (cWidth, cHeight, imageWidth, imageHeight) {
            if (imageWidth <= cWidth) {
                return [imageWidth, imageHeight, 1];
            }
            var scalingRatio = cWidth / imageWidth;
            return [cWidth, scalingRatio * imageHeight, scalingRatio];
        };
        _this.handleMouseDown = function (e) {
            var _a = _this.extractOffSetFromEvent(e), offsetX = _a.offsetX, offsetY = _a.offsetY;
            _this.lastX = offsetX;
            _this.lastY = offsetY;
            if (!_this.state.isWritting) {
                _this.setState({
                    isDrawing: true
                });
            }
            else if (_this.state.isWritting) {
                _this.ctx.fillText(_this.state.textToWrite, _this.lastX, _this.lastY);
                _this.setState({
                    isWritting: false
                });
            }
        };
        _this.handleResetDrawingOnCanvas = function () {
            _this.ctx.clearRect(0, 0, innerWidth, innerHeight);
            //draw image if exists
            var _a = _this.props, width = _a.width, height = _a.height, image = _a.image;
            setUpForCanvas();
            if (image) {
                _this.drawImageToCanvas(image, width, height);
            }
        };
        _this.writeTextToCanvas = function () {
            _this.setState({
                isWritting: true
            });
            _this.ctx.fillStyle = _this.state.color;
            _this.ctx.strokeStyle = _this.state.color;
            _this.ctx.font = '30px Arial';
            _this.ctx.stroke();
        };
        _this.handleMouseMove = function (e) {
            var _a = _this.state, color = _a.color, lineWidth = _a.lineWidth, lineCap = _a.lineCap, lineJoin = _a.lineJoin;
            if (_this.state.isDrawing) {
                var _b = _this.extractOffSetFromEvent(e), offsetX = _b.offsetX, offsetY = _b.offsetY;
                var ctx = _this.ctx;
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth * _this.scalingFactor;
                ctx.lineCap = lineCap;
                ctx.lineJoin = lineJoin;
                var lastX = _this.lastX;
                var lastY = _this.lastY;
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(offsetX, offsetY);
                ctx.stroke();
                _this.lastX = offsetX;
                _this.lastY = offsetY;
            }
        };
        _this.handleMouseUp = function (e) {
            _this.setState({
                isDrawing: false
            });
        };
        _this.handleSave = function () {
            var onSave = _this.props.onSave;
            util_1.canvasToBlob(_this.canvasRef, 'image/png')
                .then(function (blob) {
                onSave(blob);
                _this.setState({
                    imageDownloadUrl: util_1.fileToUrl(blob)
                });
            })
                .catch(function (err) { return console.error('in ReactPainter handleSave', err); });
        };
        _this.handleSetColor = function (color) {
            _this.setState({
                color: color
            });
        };
        _this.handleSetLineWidth = function (lineWidth) {
            _this.setState({
                lineWidth: lineWidth
            });
        };
        _this.handleSetLineJoin = function (type) {
            _this.setState({
                lineJoin: type
            });
        };
        _this.handleSetLineCap = function (type) {
            _this.setState({
                lineCap: type
            });
        };
        _this.handleSetTextToWrite = function (textToWrite) {
            _this.setState({
                textToWrite: textToWrite
            });
        };
        _this.getCanvasProps = function (props) {
            if (props === void 0) { props = {}; }
            var onMouseDown = props.onMouseDown, onTouchStart = props.onTouchStart, onMouseMove = props.onMouseMove, onTouchMove = props.onTouchMove, onMouseUp = props.onMouseUp, onTouchEnd = props.onTouchEnd, style = props.style, ref = props.ref, restProps = __rest(props, ["onMouseDown", "onTouchStart", "onMouseMove", "onTouchMove", "onMouseUp", "onTouchEnd", "style", "ref"]);
            return __assign({ onMouseDown: util_1.composeFn(onMouseDown, _this.handleMouseDown), onMouseMove: util_1.composeFn(onMouseMove, _this.handleMouseMove), onMouseUp: util_1.composeFn(onMouseUp, _this.handleMouseUp), onTouchEnd: util_1.composeFn(onTouchEnd, _this.handleMouseUp), onTouchMove: util_1.composeFn(onTouchMove, _this.handleMouseMove), onTouchStart: util_1.composeFn(onTouchStart, _this.handleMouseDown), ref: util_1.composeFn(ref, function (canvasRef) {
                    _this.canvasRef = canvasRef;
                }), style: __assign({ height: _this.state.canvasHeight, width: _this.state.canvasWidth, cursor: _this.state.isWritting ? 'text' : 'default' }, style) }, restProps);
        };
        _this.drawImageToCanvas = function (image, width, height) {
            util_1.importImage(image)
                .then(function (_a) {
                var img = _a.img, imgWidth = _a.imgWidth, imgHeight = _a.imgHeight;
                _this.initializeCanvas(width, height, imgWidth, imgHeight);
                _this.ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
                _this.setState({
                    imageCanDownload: true
                });
            })
                .catch(function (err) {
                _this.setState({
                    imageCanDownload: false
                });
                _this.initializeCanvas(width, height);
            });
        };
        return _this;
    }
    ReactPainter.prototype.componentDidMount = function () {
        var _a = this.props, width = _a.width, height = _a.height, image = _a.image;
        setUpForCanvas();
        if (image) {
            this.drawImageToCanvas(image, width, height);
        }
        else {
            this.initializeCanvas(width, height);
        }
    };
    ReactPainter.prototype.componentWillUnmount = function () {
        cleanUpCanvas();
        util_1.revokeUrl(this.state.imageDownloadUrl);
    };
    ReactPainter.prototype.render = function () {
        var render = this.props.render;
        var _a = this.state, imageCanDownload = _a.imageCanDownload, imageDownloadUrl = _a.imageDownloadUrl;
        var canvasNode = React.createElement("canvas", __assign({}, this.getCanvasProps()));
        return typeof render === 'function'
            ? render({
                canvas: canvasNode,
                getCanvasProps: this.getCanvasProps,
                imageCanDownload: imageCanDownload,
                imageDownloadUrl: imageDownloadUrl,
                setColor: this.handleSetColor,
                setLineCap: this.handleSetLineCap,
                setLineJoin: this.handleSetLineJoin,
                setLineWidth: this.handleSetLineWidth,
                triggerSave: this.handleSave,
                resetDrawingOnCanvas: this.handleResetDrawingOnCanvas,
                handleTextInput: this.handleSetTextToWrite,
                writeTextToCanvas: this.writeTextToCanvas,
            })
            : canvasNode;
    };
    ReactPainter.propTypes = {
        color: PropTypes.string,
        height: PropTypes.number,
        image: PropTypes.oneOfType([PropTypes.instanceOf(File), PropTypes.string]),
        lineCap: PropTypes.string,
        lineJoin: PropTypes.string,
        lineWidth: PropTypes.number,
        onSave: PropTypes.func,
        render: PropTypes.func,
        width: PropTypes.number
    };
    ReactPainter.defaultProps = {
        height: 300,
        image: undefined,
        onSave: function () {
            // noop
        },
        initialColor: '#000',
        initialLineCap: 'round',
        initialLineJoin: 'round',
        initialLineWidth: 5,
        width: 300
    };
    return ReactPainter;
}(React.Component));
exports.ReactPainter = ReactPainter;
//# sourceMappingURL=ReactPainter.js.map