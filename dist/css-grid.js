(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _enquire=__webpack_require__(1);var _enquire2=_interopRequireDefault(_enquire);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var Polyfill=function(){function Polyfill(){_classCallCheck(this,Polyfill);this.stylesheet=document.styleSheets[0];this.ast=null;this.bindEvents();this.update();}_createClass(Polyfill,[{key:'bindEvents',value:function bindEvents(){window.addEventListener('resize',this.update.bind(this));}},{key:'update',value:function update(){this.ast=this.createAST();this.apply();}},{key:'createAST',value:function createAST(){var rules=[].filter.call(this.stylesheet.rules,function(rule){return!rule.parentRule&&rule.type===CSSRule.STYLE_RULE;}).map(function(css){return new Rule(css);}).filter(function(rule){return rule.isGridRelated();});[].filter.call(this.stylesheet.cssRules,function(rule){return rule.type===4;}).forEach(function(mediaRule){[].forEach.call(mediaRule.cssRules,function(css){rules.push(new Rule(css,mediaRule));});});return new AST(rules);}},{key:'apply',value:function apply(){var _this=this;console.log('GENERATED AST',this.ast);var containers=this.ast.tree;containers.forEach(function(container){var node=container.node;var position=node.style.position.toLowerCase();if(position===''||position==='static'){node.style.position='relative';}var containerColumns=container.rule.meta.columns;var containerColumnCount=container.rule.meta.columns.length;var containerTotalWidth=container.node.clientWidth;var containerGutterWidth=parseInt(container.rule.meta.colGap)||0;var containerGutterHeight=parseInt(container.rule.meta.rowGap)||0;var containerTotalGutterWidth=containerGutterWidth*(containerColumnCount-1);var containerColumnWidth=(containerTotalWidth-containerTotalGutterWidth)/containerColumnCount;var columnCursor=0;var rowCursor=0;var rowIndex=0;var rowSpans=[];var rows=[];container.tree.forEach(function(ruleNode,index){var itemColumnObject=containerColumns[index]||{width:'auto'};var itemColSpan=ruleNode.rule.meta.colSpan||1;var itemWidth=void 0;if(itemColumnObject.width==='auto'){var gutters=Math.max(itemColSpan-1,0)*containerGutterWidth;itemWidth=containerColumnWidth*itemColSpan+gutters;}else{itemWidth=parseInt(itemColumnObject.width);}var columnIndex=rows[rowIndex]?rows[rowIndex].length:0;var skipped=rowSpans.filter(function(rSpan){return rSpan.index===columnIndex&&rSpan.rowSpan>0;})[0];var skippedWidth=skipped?skipped.itemWidth+containerGutterWidth:0;var nextLeft=columnCursor-containerGutterWidth+itemWidth+skippedWidth;if(nextLeft>containerTotalWidth){var tallestColumn=_this.getTallestRuleNode(rows[rowIndex]).node.clientHeight;columnCursor=0;rowCursor+=tallestColumn+containerGutterHeight;rowIndex++;}if(skipped){skipped.rowSpan--;}if(!rows[rowIndex]){rows[rowIndex]=[];}rows[rowIndex].push(ruleNode);ruleNode.node.style.position='absolute';ruleNode.node.style.width=itemWidth+'px';ruleNode.node.style.left=columnCursor+'px';ruleNode.node.style.top=rowCursor+'px';columnCursor+=ruleNode.node.clientWidth+containerGutterWidth;var rowSpan=Math.max(ruleNode.rule.meta.rowSpan-1||0,0);if(rowSpan){rowSpans.push({index:index,rowSpan:rowSpan,itemWidth:itemWidth});}});rows.forEach(function(row,rowIndex){row.forEach(function(column){var rowsToCheck=Math.max(column.rule.meta.rowSpan-1||0,0);if(!rows[rowIndex+1]){return;}var guttersHeight=rowsToCheck*parseInt(container.rule.meta.rowGap);var clientHeight=column.node.clientHeight+guttersHeight;for(var i=1;i<=rowsToCheck;i++){var nextRow=rows[rowIndex+i];if(nextRow){clientHeight+=_this.getTallestRuleNode(nextRow).node.clientHeight;}}column.node.style.height=clientHeight+'px';});});container.node.style.height=container.node.scrollHeight+'px';});}},{key:'getTallestRuleNode',value:function getTallestRuleNode(ruleNodes){return ruleNodes.reduce(function(acc,val){return acc.node.clientHeight>val.node.clientHeight?acc:val;},ruleNodes[0]);}}]);return Polyfill;}();var AST=function(){function AST(rules){_classCallCheck(this,AST);this.rules=rules.filter(function(rule){return rule.isApplicable();});this.ruleNodes=[].concat(_toConsumableArray(this.getRuleNodes(this.getContainerRules())),_toConsumableArray(this.getRuleNodes(this.getItemRules())));this.tree=this.buildTree();}_createClass(AST,[{key:'getContainerRules',value:function getContainerRules(){return this.rules.filter(function(rule){return rule.isDisplayGrid();});}},{key:'getContainerRuleNodes',value:function getContainerRuleNodes(){return this.ruleNodes.filter(function(ruleNode){return ruleNode.rule.isDisplayGrid();});}},{key:'getItemRules',value:function getItemRules(){return this.rules.filter(function(rule){return!rule.isDisplayGrid();});}},{key:'getItemRuleNodes',value:function getItemRuleNodes(){return this.ruleNodes.filter(function(ruleNode){return!ruleNode.rule.isDisplayGrid();});}},{key:'getRuleNodes',value:function getRuleNodes(rules){var ruleNodes=[];rules.forEach(function(rule){var nodes=rule.nodes;var rNodes=[];[].forEach.call(nodes,function(node){var rNode=new RuleNode(rule,node);var existing=ruleNodes.filter(function(rn){return rn.node===node;})[0];if(existing){for(var key in rNode.rule.meta){if(rNode.rule.meta[key]){existing.rule.meta[key]=rNode.rule.meta[key];}}}else{ruleNodes.push(rNode);}});rNodes.forEach(function(ruleNode){return ruleNodes.push(ruleNode);});});return ruleNodes;}},{key:'buildTree',value:function buildTree(){var items=this.getItemRuleNodes();var containers=this.getContainerRuleNodes();containers.forEach(function(container){container.tree=items.filter(function(item){return[].indexOf.call(container.node.children,item.node)>-1;});});return containers;}}]);return AST;}();var RuleNode=function RuleNode(rule,node){_classCallCheck(this,RuleNode);this.rule=new Rule(rule.css,rule.mediaRule);this.node=node;};var Rule=function(){function Rule(css,mediaRule){_classCallCheck(this,Rule);var data=this.parseCSS(css);this.css=css;this.mediaRule=mediaRule;this.selector=data.selector;this.nodes=document.querySelectorAll(this.selector);this.rules=data.rules;this.addMeta();}_createClass(Rule,[{key:'parseCSS',value:function parseCSS(rule){var split=rule.cssText.split('{');var selector=split[0].trim();var rules=split[1].replace(/([^:;]+)/g,'"$1"').replace(/;/g,',').replace(/\s*?"\s+?/g,'"').replace(/,"}"$/g,'}');rules=JSON.parse('{'+rules);return{selector:selector,rules:rules};}},{key:'addMeta',value:function addMeta(){this.meta={};this.addColumns();this.addGridArea();this.addGap('grid-gap');this.addGap('grid-column-gap');this.addGap('grid-row-gap');this.addSpan('grid-column');this.addSpan('grid-row');}},{key:'addGridArea',value:function addGridArea(){var cssText=this.rules['grid-area'];if(cssText){var split=cssText.match(/span\s+?\d+/g);if(split[0]){this.meta.rowSpan=parseInt(split[0].match(/\d+/));}if(split[1]){this.meta.colSpan=parseInt(split[1].match(/\d+/));}}}},{key:'addColumns',value:function addColumns(){var cssText=this.rules['grid-template-columns'];if(cssText){var columns=cssText.replace(/\[.+?\]/g,'').trim().split(/\s+/);this.meta.columns=[];for(var i=0;i<columns.length;i++){this.meta.columns.push({width:columns[i]});}}}},{key:'addGap',value:function addGap(property){var cssText=this.rules[property];if(property==='grid-gap'&&cssText){var split=cssText.split(/\s+/);if(split[0]){this.meta.rowGap=split[0];}if(split[1]){this.meta.colGap=split[1];}}else if(cssText){var key=property.match('column')?'colGap':'rowGap';this.meta[key]=cssText;}}},{key:'addSpan',value:function addSpan(property){var cssText=this.rules[property];if(cssText){var span=cssText.match(/span\s+?\d+/g);if(span){var key=property.match('column')?'colSpan':'rowSpan';this.meta[key]=span[0].match(/\d+/)[0];}}}},{key:'isDisplayGrid',value:function isDisplayGrid(){var keys=Object.keys(this.rules).filter(function(key){return key.toLowerCase().match(/grid-template/);});return keys.length>0;}},{key:'isGridRelated',value:function isGridRelated(){return this.isDisplayGrid()||!!Object.keys(this.rules).filter(function(key){return key.match(/^grid/);}).length;}},{key:'isApplicable',value:function isApplicable(){if(this.mediaRule){return this.evaluateMediaRule();}return true;}},{key:'evaluateMediaRule',value:function evaluateMediaRule(){var result=null;var mq=this.mediaRule.cssText.match(/media.+(?=\s+{)/g);if(mq[0]){mq=mq[0].replace('media ','');_enquire2.default.register(mq,{match:function match(){return result=true;},unmatch:function unmatch(){return result=false;}});return result;}}}]);return Rule;}();new Polyfill();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var MediaQueryDispatch = __webpack_require__(2);
	module.exports = new MediaQueryDispatch();


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var MediaQuery = __webpack_require__(3);
	var Util = __webpack_require__(5);
	var each = Util.each;
	var isFunction = Util.isFunction;
	var isArray = Util.isArray;
	
	/**
	 * Allows for registration of query handlers.
	 * Manages the query handler's state and is responsible for wiring up browser events
	 *
	 * @constructor
	 */
	function MediaQueryDispatch () {
	    if(!window.matchMedia) {
	        throw new Error('matchMedia not present, legacy browsers require a polyfill');
	    }
	
	    this.queries = {};
	    this.browserIsIncapable = !window.matchMedia('only all').matches;
	}
	
	MediaQueryDispatch.prototype = {
	
	    constructor : MediaQueryDispatch,
	
	    /**
	     * Registers a handler for the given media query
	     *
	     * @param {string} q the media query
	     * @param {object || Array || Function} options either a single query handler object, a function, or an array of query handlers
	     * @param {function} options.match fired when query matched
	     * @param {function} [options.unmatch] fired when a query is no longer matched
	     * @param {function} [options.setup] fired when handler first triggered
	     * @param {boolean} [options.deferSetup=false] whether setup should be run immediately or deferred until query is first matched
	     * @param {boolean} [shouldDegrade=false] whether this particular media query should always run on incapable browsers
	     */
	    register : function(q, options, shouldDegrade) {
	        var queries         = this.queries,
	            isUnconditional = shouldDegrade && this.browserIsIncapable;
	
	        if(!queries[q]) {
	            queries[q] = new MediaQuery(q, isUnconditional);
	        }
	
	        //normalise to object in an array
	        if(isFunction(options)) {
	            options = { match : options };
	        }
	        if(!isArray(options)) {
	            options = [options];
	        }
	        each(options, function(handler) {
	            if (isFunction(handler)) {
	                handler = { match : handler };
	            }
	            queries[q].addHandler(handler);
	        });
	
	        return this;
	    },
	
	    /**
	     * unregisters a query and all it's handlers, or a specific handler for a query
	     *
	     * @param {string} q the media query to target
	     * @param {object || function} [handler] specific handler to unregister
	     */
	    unregister : function(q, handler) {
	        var query = this.queries[q];
	
	        if(query) {
	            if(handler) {
	                query.removeHandler(handler);
	            }
	            else {
	                query.clear();
	                delete this.queries[q];
	            }
	        }
	
	        return this;
	    }
	};
	
	module.exports = MediaQueryDispatch;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var QueryHandler = __webpack_require__(4);
	var each = __webpack_require__(5).each;
	
	/**
	 * Represents a single media query, manages it's state and registered handlers for this query
	 *
	 * @constructor
	 * @param {string} query the media query string
	 * @param {boolean} [isUnconditional=false] whether the media query should run regardless of whether the conditions are met. Primarily for helping older browsers deal with mobile-first design
	 */
	function MediaQuery(query, isUnconditional) {
	    this.query = query;
	    this.isUnconditional = isUnconditional;
	    this.handlers = [];
	    this.mql = window.matchMedia(query);
	
	    var self = this;
	    this.listener = function(mql) {
	        // Chrome passes an MediaQueryListEvent object, while other browsers pass MediaQueryList directly
	        self.mql = mql.currentTarget || mql;
	        self.assess();
	    };
	    this.mql.addListener(this.listener);
	}
	
	MediaQuery.prototype = {
	
	    constuctor : MediaQuery,
	
	    /**
	     * add a handler for this query, triggering if already active
	     *
	     * @param {object} handler
	     * @param {function} handler.match callback for when query is activated
	     * @param {function} [handler.unmatch] callback for when query is deactivated
	     * @param {function} [handler.setup] callback for immediate execution when a query handler is registered
	     * @param {boolean} [handler.deferSetup=false] should the setup callback be deferred until the first time the handler is matched?
	     */
	    addHandler : function(handler) {
	        var qh = new QueryHandler(handler);
	        this.handlers.push(qh);
	
	        this.matches() && qh.on();
	    },
	
	    /**
	     * removes the given handler from the collection, and calls it's destroy methods
	     *
	     * @param {object || function} handler the handler to remove
	     */
	    removeHandler : function(handler) {
	        var handlers = this.handlers;
	        each(handlers, function(h, i) {
	            if(h.equals(handler)) {
	                h.destroy();
	                return !handlers.splice(i,1); //remove from array and exit each early
	            }
	        });
	    },
	
	    /**
	     * Determine whether the media query should be considered a match
	     *
	     * @return {Boolean} true if media query can be considered a match, false otherwise
	     */
	    matches : function() {
	        return this.mql.matches || this.isUnconditional;
	    },
	
	    /**
	     * Clears all handlers and unbinds events
	     */
	    clear : function() {
	        each(this.handlers, function(handler) {
	            handler.destroy();
	        });
	        this.mql.removeListener(this.listener);
	        this.handlers.length = 0; //clear array
	    },
	
	    /*
	        * Assesses the query, turning on all handlers if it matches, turning them off if it doesn't match
	        */
	    assess : function() {
	        var action = this.matches() ? 'on' : 'off';
	
	        each(this.handlers, function(handler) {
	            handler[action]();
	        });
	    }
	};
	
	module.exports = MediaQuery;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	/**
	 * Delegate to handle a media query being matched and unmatched.
	 *
	 * @param {object} options
	 * @param {function} options.match callback for when the media query is matched
	 * @param {function} [options.unmatch] callback for when the media query is unmatched
	 * @param {function} [options.setup] one-time callback triggered the first time a query is matched
	 * @param {boolean} [options.deferSetup=false] should the setup callback be run immediately, rather than first time query is matched?
	 * @constructor
	 */
	function QueryHandler(options) {
	    this.options = options;
	    !options.deferSetup && this.setup();
	}
	
	QueryHandler.prototype = {
	
	    constructor : QueryHandler,
	
	    /**
	     * coordinates setup of the handler
	     *
	     * @function
	     */
	    setup : function() {
	        if(this.options.setup) {
	            this.options.setup();
	        }
	        this.initialised = true;
	    },
	
	    /**
	     * coordinates setup and triggering of the handler
	     *
	     * @function
	     */
	    on : function() {
	        !this.initialised && this.setup();
	        this.options.match && this.options.match();
	    },
	
	    /**
	     * coordinates the unmatch event for the handler
	     *
	     * @function
	     */
	    off : function() {
	        this.options.unmatch && this.options.unmatch();
	    },
	
	    /**
	     * called when a handler is to be destroyed.
	     * delegates to the destroy or unmatch callbacks, depending on availability.
	     *
	     * @function
	     */
	    destroy : function() {
	        this.options.destroy ? this.options.destroy() : this.off();
	    },
	
	    /**
	     * determines equality by reference.
	     * if object is supplied compare options, if function, compare match callback
	     *
	     * @function
	     * @param {object || function} [target] the target for comparison
	     */
	    equals : function(target) {
	        return this.options === target || this.options.match === target;
	    }
	
	};
	
	module.exports = QueryHandler;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	/**
	 * Helper function for iterating over a collection
	 *
	 * @param collection
	 * @param fn
	 */
	function each(collection, fn) {
	    var i      = 0,
	        length = collection.length,
	        cont;
	
	    for(i; i < length; i++) {
	        cont = fn(collection[i], i);
	        if(cont === false) {
	            break; //allow early exit
	        }
	    }
	}
	
	/**
	 * Helper function for determining whether target object is an array
	 *
	 * @param target the object under test
	 * @return {Boolean} true if array, false otherwise
	 */
	function isArray(target) {
	    return Object.prototype.toString.apply(target) === '[object Array]';
	}
	
	/**
	 * Helper function for determining whether target object is a function
	 *
	 * @param target the object under test
	 * @return {Boolean} true if function, false otherwise
	 */
	function isFunction(target) {
	    return typeof target === 'function';
	}
	
	module.exports = {
	    isFunction : isFunction,
	    isArray : isArray,
	    each : each
	};


/***/ })
/******/ ])
});
;
//# sourceMappingURL=css-grid.js.map