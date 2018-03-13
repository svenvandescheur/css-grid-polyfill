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
/***/ (function(module, exports) {

	'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var Polyfill=function(){function Polyfill(){_classCallCheck(this,Polyfill);this.stylesheet=document.styleSheets[0];this.ast=this.createAST();this.apply();}_createClass(Polyfill,[{key:'createAST',value:function createAST(){var rules=[].filter.call(this.stylesheet.rules,function(rule){return rule.constructor!==CSSMediaRule;}).map(function(css){return new Rule(css);}).filter(function(rule){return rule.isGridRelated();});[].filter.call(this.stylesheet.rules,function(rule){return rule.constructor===CSSMediaRule;}).forEach(function(mediaRule){[].forEach.call(mediaRule.cssRules,function(css){rules.push(new Rule(css,mediaRule));});});return new AST(rules);}},{key:'apply',value:function apply(){var _this=this;console.log(this.ast);var containers=this.ast.tree;containers.forEach(function(container){var node=container.node;var position=node.style.position.toLowerCase();if(position===''||position==='static'){node.style.position='relative';}var containerColumns=container.rule.meta.columns;var containerColumnCount=container.rule.meta.columns.length;var containerTotalWidth=container.node.clientWidth;var containerGutterWidth=parseInt(container.rule.meta.colGap)||0;var containerGutterHeight=parseInt(container.rule.meta.rowGap)||0;var containerTotalGutterWidth=containerGutterWidth*(containerColumnCount-1);var containerColumnWidth=(containerTotalWidth-containerTotalGutterWidth)/containerColumnCount;var columnCursor=0;var rowCursor=0;var rowIndex=0;var rowSpans=[];var rows=[];container.tree.forEach(function(item,index){var itemColumnObject=containerColumns[index]||{width:'auto'};var itemColSpan=item.rule.meta.colSpan||1;var itemWidth=void 0;if(itemColumnObject.width==='auto'){var gutters=Math.max(itemColSpan-1,0)*containerGutterWidth;itemWidth=containerColumnWidth*itemColSpan+gutters;}else{itemWidth=parseInt(itemColumnObject.width);}var columnIndex=rows[rowIndex]?rows[rowIndex].length:0;var skipped=rowSpans.filter(function(rSpan){return rSpan.index===columnIndex&&rSpan.rowSpan>0;})[0];var skippedWidth=skipped?skipped.itemWidth+containerGutterWidth:0;var nextLeft=columnCursor-containerGutterWidth+itemWidth+skippedWidth;if(nextLeft>containerTotalWidth){var tallestColumn=_this.getTallestRuleNode(rows[rowIndex]).node.clientHeight;columnCursor=0;rowCursor+=tallestColumn+containerGutterHeight;rowIndex++;}if(skipped){skipped.rowSpan--;}if(!rows[rowIndex]){rows[rowIndex]=[];}rows[rowIndex].push(item);item.node.style.position='absolute';item.node.style.width=itemWidth+'px';item.node.style.left=columnCursor+'px';item.node.style.top=rowCursor+'px';columnCursor+=item.node.clientWidth+containerGutterWidth;var rowSpan=Math.max(item.rule.meta.rowSpan-1||0,0);if(rowSpan){rowSpans.push({index:index,rowSpan:rowSpan,itemWidth:itemWidth});}});rows.forEach(function(row,rowIndex){row.forEach(function(column){var rowsToCheck=Math.max(column.rule.meta.rowSpan-1||0,0);if(!rows[rowIndex+1]){return;}var guttersHeight=rowsToCheck*parseInt(container.rule.meta.rowGap);var clientHeight=column.node.clientHeight+guttersHeight;for(var i=1;i<=rowsToCheck;i++){var nextRow=rows[rowIndex+i];if(nextRow){clientHeight+=_this.getTallestRuleNode(nextRow).node.clientHeight;}}column.node.style.height=clientHeight+'px';});});container.node.style.height=container.node.scrollHeight+'px';});}},{key:'getTallestRuleNode',value:function getTallestRuleNode(ruleNodes){return ruleNodes.reduce(function(acc,val){return acc.node.clientHeight>val.node.clientHeight?acc:val;},ruleNodes[0]);}}]);return Polyfill;}();var AST=function(){function AST(rules){_classCallCheck(this,AST);this.rules=rules;this.ruleNodes=[].concat(_toConsumableArray(this.getRuleNodes(this.getContainerRules())),_toConsumableArray(this.getRuleNodes(this.getItemRules())));this.tree=this.buildTree();}_createClass(AST,[{key:'getContainerRules',value:function getContainerRules(){return this.rules.filter(function(rule){return rule.isDisplayGrid();});}},{key:'getContainerRuleNodes',value:function getContainerRuleNodes(){return this.ruleNodes.filter(function(ruleNode){return ruleNode.rule.isDisplayGrid();});}},{key:'getItemRules',value:function getItemRules(){return this.rules.filter(function(rule){return!rule.isDisplayGrid();});}},{key:'getItemRuleNodes',value:function getItemRuleNodes(){return this.ruleNodes.filter(function(ruleNode){return!ruleNode.rule.isDisplayGrid();});}},{key:'getRuleNodes',value:function getRuleNodes(rules){var ruleNodes=[];rules.forEach(function(rule){var nodes=rule.nodes;var rNodes=[];[].forEach.call(nodes,function(node){var rNode=new RuleNode(rule,node);var existing=ruleNodes.filter(function(rn){return rn.node===node;})[0];if(existing){for(var key in rNode.rule.meta){existing.rule.meta[key]=rNode.rule.meta[key];}}else{ruleNodes.push(rNode);}});rNodes.forEach(function(ruleNode){return ruleNodes.push(ruleNode);});});return ruleNodes;}},{key:'buildTree',value:function buildTree(){var items=this.getItemRuleNodes();var containers=this.getContainerRuleNodes();containers.forEach(function(container){container.tree=items.filter(function(item){return[].indexOf.call(container.node.children,item.node)>-1;});});return containers;}}]);return AST;}();var RuleNode=function RuleNode(rule,node){_classCallCheck(this,RuleNode);this.rule=new Rule(rule.css,rule.mediaRule);this.node=node;};var Rule=function(){function Rule(css,mediaRule){_classCallCheck(this,Rule);var data=this.parseCSS(css);this.css=css;this.mediaRule=mediaRule;this.selector=data.selector;this.nodes=document.querySelectorAll(this.selector);this.rules=data.rules;this.addMeta();}_createClass(Rule,[{key:'parseCSS',value:function parseCSS(rule){var split=rule.cssText.split('{');var selector=split[0].trim();var rules=split[1].replace(/([^:;]+)/g,'"$1"').replace(/;/g,',').replace(/\s*?"\s+?/g,'"').replace(/,"}"$/g,'}');rules=JSON.parse('{'+rules);return{selector:selector,rules:rules};}},{key:'addMeta',value:function addMeta(){this.meta={};this.addColumns();this.addGridArea();this.addGap('grid-gap');this.addGap('grid-column-gap');this.addGap('grid-row-gap');this.addSpan('grid-column');this.addSpan('grid-row');}},{key:'addGridArea',value:function addGridArea(){var cssText=this.rules['grid-area'];if(cssText){var split=cssText.match(/span\s+?\d+/g);if(split[0]){this.meta.rowSpan=parseInt(split[0].match(/\d+/));}if(split[1]){this.meta.colSpan=parseInt(split[1].match(/\d+/));}}}},{key:'addColumns',value:function addColumns(){var cssText=this.rules['grid-template-columns'];if(cssText){var columns=cssText.replace(/\[.+?\]/g,'').trim().split(/\s+/);this.meta.columns=[];for(var i=0;i<columns.length;i++){this.meta.columns.push({width:columns[i]});}}}},{key:'addGap',value:function addGap(property){var cssText=this.rules[property];if(property==='grid-gap'&&cssText){var split=cssText.split(/\s+/);if(split[0]){this.meta.rowGap=split[0];}if(split[1]){this.meta.colGap=split[1];}}else if(cssText){var key=property.match('column')?'colGap':'rowGap';this.meta[key]=cssText;}}},{key:'addSpan',value:function addSpan(property){var cssText=this.rules[property];if(cssText){var span=cssText.match(/span\s+?\d+/g);if(span){var key=property.match('column')?'colSpan':'rowSpan';this.meta[key]=span[0].match(/\d+/)[0];}}}},{key:'isDisplayGrid',value:function isDisplayGrid(){var keys=Object.keys(this.rules).filter(function(key){return key.toLowerCase().match(/grid-template/);});return keys.length>0;}},{key:'isGridRelated',value:function isGridRelated(){return this.isDisplayGrid()||!!Object.keys(this.rules).filter(function(key){return key.match(/^grid/);}).length;}}]);return Rule;}();new Polyfill();

/***/ })
/******/ ])
});
;
//# sourceMappingURL=css-grid.js.map