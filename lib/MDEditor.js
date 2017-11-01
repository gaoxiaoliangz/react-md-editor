'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _formatJs = require('./format.js');

var classNames = require('classnames');
var CM = require('codemirror');
var React = require('react');
var ReactDOM = require('react-dom');
var Icons = require('./icons');

require('codemirror/mode/xml/xml');
require('codemirror/mode/markdown/markdown');
require('codemirror/addon/edit/continuelist');

var MarkdownEditor = (function (_React$Component) {
	_inherits(MarkdownEditor, _React$Component);

	_createClass(MarkdownEditor, null, [{
		key: 'propTypes',
		value: function propTypes() {
			return {
				onChange: React.PropTypes.func,
				options: React.PropTypes.object,
				path: React.PropTypes.string,
				value: React.PropTypes.string
			};
		}
	}]);

	function MarkdownEditor(props) {
		_classCallCheck(this, MarkdownEditor);

		_get(Object.getPrototypeOf(MarkdownEditor.prototype), 'constructor', this).call(this, props);
		this.state = {
			isFocused: false,
			cs: {}
		};
	}

	_createClass(MarkdownEditor, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var $textarea = ReactDOM.findDOMNode(this.codemirror);
			this.codeMirror = CM.fromTextArea($textarea, this.getOptions());
			this.codeMirror.on('change', this.codemirrorValueChanged.bind(this));
			this.codeMirror.on('focus', this.focusChanged.bind(this, true));
			this.codeMirror.on('blur', this.focusChanged.bind(this, false));
			this.codeMirror.on('cursorActivity', this.updateCursorState.bind(this));
			this._currentCodemirrorValue = this.props.value;
		}
	}, {
		key: 'getOptions',
		value: function getOptions() {
			return _extends({
				mode: 'markdown',
				lineNumbers: false,
				indentWithTabs: true,
				tabSize: '2'
			}, this.props.options);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			// todo: is there a lighter-weight way to remove the cm instance?
			if (this.codeMirror) {
				this.codeMirror.toTextArea();
			}
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			if (this.codeMirror && this._currentCodemirrorValue !== nextProps.value) {
				this.codeMirror.setValue(nextProps.value);
			}
		}
	}, {
		key: 'getCodeMirror',
		value: function getCodeMirror() {
			return this.codeMirror;
		}
	}, {
		key: 'focus',
		value: function focus() {
			if (this.codeMirror) {
				this.codeMirror.focus();
			}
		}
	}, {
		key: 'focusChanged',
		value: function focusChanged(focused) {
			this.setState({ isFocused: focused });
		}
	}, {
		key: 'updateCursorState',
		value: function updateCursorState() {
			this.setState({ cs: (0, _formatJs.getCursorState)(this.codeMirror) });
		}
	}, {
		key: 'codemirrorValueChanged',
		value: function codemirrorValueChanged(doc, change) {
			var newValue = doc.getValue();
			this._currentCodemirrorValue = newValue;
			this.props.onChange && this.props.onChange(newValue);
		}
	}, {
		key: 'toggleFormat',
		value: function toggleFormat(formatKey, e) {
			e.preventDefault();
			(0, _formatJs.applyFormat)(this.codeMirror, formatKey);
		}
	}, {
		key: 'renderIcon',
		value: function renderIcon(icon) {
			return React.createElement('span', { dangerouslySetInnerHTML: { __html: icon }, className: 'MDEditor_toolbarButton_icon' });
		}
	}, {
		key: 'renderButton',
		value: function renderButton(formatKey, label, action) {
			if (!action) action = this.toggleFormat.bind(this, formatKey);

			var isTextIcon = formatKey === 'h1' || formatKey === 'h2' || formatKey === 'h3';
			var className = classNames('MDEditor_toolbarButton', {
				'MDEditor_toolbarButton--pressed': this.state.cs[formatKey]
			}, 'MDEditor_toolbarButton--' + formatKey);

			var labelClass = isTextIcon ? 'MDEditor_toolbarButton_label-icon' : 'MDEditor_toolbarButton_label';

			return React.createElement(
				'button',
				{ className: className, onClick: action, title: formatKey },
				isTextIcon ? null : this.renderIcon(Icons[formatKey]),
				React.createElement(
					'span',
					{ className: labelClass },
					label
				)
			);
		}
	}, {
		key: 'renderToolbar',
		value: function renderToolbar() {
			return React.createElement(
				'div',
				{ className: 'MDEditor_toolbar' },
				this.renderButton('h1', 'h1'),
				this.renderButton('h2', 'h2'),
				this.renderButton('h3', 'h3'),
				this.renderButton('bold', 'b'),
				this.renderButton('italic', 'i'),
				this.renderButton('oList', 'ol'),
				this.renderButton('uList', 'ul'),
				this.renderButton('quote', 'q')
			);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this = this;

			var editorClassName = classNames('MDEditor_editor', { 'MDEditor_editor--focused': this.state.isFocused });
			return React.createElement(
				'div',
				{ className: 'MDEditor' },
				this.renderToolbar(),
				React.createElement(
					'div',
					{ className: editorClassName },
					React.createElement('textarea', { ref: function (ref) {
							return _this.codemirror = ref;
						}, name: this.props.path, defaultValue: this.props.value, autoComplete: 'off' })
				)
			);
		}
	}]);

	return MarkdownEditor;
})(React.Component);

exports['default'] = MarkdownEditor;
module.exports = exports['default'];
/*this.renderButton('link', 'a')*/