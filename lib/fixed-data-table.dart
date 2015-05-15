library fixed_data_table;

import 'dart:js';
import 'package:react/react_client.dart' as reactClient;
import 'dart:async';

var _FixedDataTable = context['FixedDataTable'];

var FixedDataTable = _getFixedDataTable('Table');
var FixedDataTableColumn = _getFixedDataTable('Column');
var FixedDataTableColumnGroup = _getFixedDataTable('ColumnGroup');
var FixedDataTableRow = _getFixedDataTable('Row');
var FixedDataTableBufferedRow = _getFixedDataTable('BufferedRow');
var FixedDataTableCell = _getFixedDataTable('Cell');
var FixedDataTableCellGroup = _getFixedDataTable('CellGroup');
var FixedDataTableColumnResizeHandler = _getFixedDataTable('ColumnResizeHandler');
var FixedDataTableHelper = _getFixedDataTable('TableHelper');
var FixedDataTableRowBuffer = _getFixedDataTable('RowBuffer');
var FixedDataTableScrollHelper = _getFixedDataTable('ScrollHelper');
var FixedDataTableWidthHelper = _getFixedDataTable('WidthHelper');

_getFixedDataTable(String name) {
	JsFunction method = _FixedDataTable[name];
	return (Map args, [children]) {
    _convertReactReturnFunctions(args);
		_convertBoundedValues(args);
		_convertEventHandlers(args);
		if (args.containsKey('style')) {
			args['style'] = new JsObject.jsify(args['style']);
		}
		if (children is Iterable) {
			children = new JsArray.from(children);
		}
		return method.apply([reactClient.newJsMap(args), children]);
	};
}

_convertReactReturnFunctions(Map args) {
  if (args['cellRenderer'] != null) {
    var cellRenderer = args['cellRenderer'];

    args['cellRenderer'] = (arg1, param, obj, arg4, arg5, arg6) {
      return cellRenderer(obj[param]);
    };
  }
}

_convertBoundedValues(Map args) {
	var boundValue = args['value'];
	if (args['value'] is List) {
		_setValueToProps(args, boundValue[0]);
		args['value'] = boundValue[0];
		var onChange = args["onChange"];

		args['onChange'] = (e) {
			boundValue[1](_getValueFromDom(e.target));
			if (onChange != null) {
				return onChange(e);
			}
		};
	}
}

_setValueToProps(Map props, val) {
	if (_isCheckbox(props)) {
		if(val) {
			props['checked'] = true;
		} else {
			if(props.containsKey('checked')) {
				props.remove('checked');
			}
		}
	} else {
		props['value'] = val;
	}
}

_isCheckbox(props) {
	  return props['type'] == 'checkbox';
}

_getValueFromDom(domElem) {
	var props = domElem.attributes;
	if (_isCheckbox(props)) {
		return domElem.checked;
	} else {
		return domElem.value;
	}
}

//---------------------------------------------------------------------
// private stuff pulled directly from react_client.dart
//---------------------------------------------------------------------

Set _syntheticClipboardEvents = new Set.from(["onCopy", "onCut", "onPaste",]);
Set _syntheticKeyboardEvents = new Set.from(["onKeyDown", "onKeyPress","onKeyUp",]);
Set _syntheticFocusEvents = new Set.from(["onFocus", "onBlur",]);
Set _syntheticFormEvents = new Set.from(["onChange", "onInput", "onSubmit",]);
Set _syntheticMouseEvents = new Set.from(["onClick", "onDoubleClick","onDrag", "onDragEnd", "onDragEnter", "onDragExit", "onDragLeave",
		        "onDragOver", "onDragStart", "onDrop", "onMouseDown", "onMouseEnter",
			    "onMouseLeave", "onMouseMove", "onMouseUp",]);
Set _syntheticTouchEvents = new Set.from(["onTouchCancel", "onTouchEnd",
		    "onTouchMove", "onTouchStart",]);
Set _syntheticUIEvents = new Set.from(["onScroll",]);
Set _syntheticWheelEvents = new Set.from(["onWheel",]);

/**
   * Convert event pack event handler into wrapper
    * and pass it only dart object of event
     * converted from JsObject of event.
      */
_convertEventHandlers(Map args) {
	var zone = Zone.current;
	args.forEach((key, value) {
		var eventFactory;
		if (_syntheticClipboardEvents.contains(key)) {
			eventFactory = reactClient.syntheticClipboardEventFactory;
		} else if (_syntheticKeyboardEvents.contains(key)) {
			eventFactory = reactClient.syntheticKeyboardEventFactory;
		} else if (_syntheticFocusEvents.contains(key)) {
			eventFactory = reactClient.syntheticFocusEventFactory;
		} else if (_syntheticFormEvents.contains(key)) {
			eventFactory = reactClient.syntheticFormEventFactory;
		} else if (_syntheticMouseEvents.contains(key)) {
			eventFactory = reactClient.syntheticMouseEventFactory;
		} else if (_syntheticTouchEvents.contains(key)) {
			eventFactory = reactClient.syntheticTouchEventFactory;
		} else if (_syntheticUIEvents.contains(key)) {
			eventFactory = reactClient.syntheticUIEventFactory;
		} else if (_syntheticWheelEvents.contains(key)) {
			eventFactory = reactClient.syntheticWheelEventFactory;
		} else return;
		args[key] = (JsObject e, [String domId]) => zone.run(() {
			value(eventFactory(e));
		});
	});
}
