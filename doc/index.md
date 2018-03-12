## Classes

<dl>
<dt><a href="#Polyfill">Polyfill</a></dt>
<dd><p>Main polyfill class.</p>
</dd>
<dt><a href="#AST">AST</a></dt>
<dd><p>Represents the Abstract Syntax Tree</p>
</dd>
<dt><a href="#RuleNode">RuleNode</a></dt>
<dd><p>Combines a single (cloned) Rule matched to a single Node</p>
</dd>
<dt><a href="#Rule">Rule</a></dt>
<dd><p>A parsed rule.</p>
</dd>
</dl>

<a name="Polyfill"></a>

## Polyfill
Main polyfill class.

**Kind**: global class  

* [Polyfill](#Polyfill)
    * [new Polyfill()](#new_Polyfill_new)
    * [.createAST()](#Polyfill+createAST) ⇒ <code>[AST](#AST)</code>
    * [.apply()](#Polyfill+apply)

<a name="new_Polyfill_new"></a>

### new Polyfill()
Constructor method.

<a name="Polyfill+createAST"></a>

### polyfill.createAST() ⇒ <code>[AST](#AST)</code>
Converts this.stylesheets to an abstract syntax tree like object.
Returned object is used by this.apply() to polyfill CSS grid behaviour.

**Kind**: instance method of <code>[Polyfill](#Polyfill)</code>  
<a name="Polyfill+apply"></a>

### polyfill.apply()
Builds the grid based on this.ast.

**Kind**: instance method of <code>[Polyfill](#Polyfill)</code>  
<a name="AST"></a>

## AST
Represents the Abstract Syntax Tree

**Kind**: global class  

* [AST](#AST)
    * [new AST(rules)](#new_AST_new)
    * [.rules](#AST+rules)
    * [.ruleNodes](#AST+ruleNodes)
    * [.getContainerRules()](#AST+getContainerRules) ⇒ <code>[Array.&lt;Rule&gt;](#Rule)</code>
    * [.getContainerRuleNodes()](#AST+getContainerRuleNodes) ⇒ <code>[Array.&lt;Rule&gt;](#Rule)</code>
    * [.getItemRules()](#AST+getItemRules) ⇒ <code>[Array.&lt;Rule&gt;](#Rule)</code>
    * [.getItemRuleNodes()](#AST+getItemRuleNodes) ⇒ <code>[Array.&lt;Rule&gt;](#Rule)</code>
    * [.getRuleNodes()](#AST+getRuleNodes) ⇒ <code>[Array.&lt;RuleNode&gt;](#RuleNode)</code>
    * [.buildTree()](#AST+buildTree)

<a name="new_AST_new"></a>

### new AST(rules)
Constructor method.


| Param | Type |
| --- | --- |
| rules | <code>[Rule](#Rule)</code> | 

<a name="AST+rules"></a>

### asT.rules
{Rules[]}

**Kind**: instance property of <code>[AST](#AST)</code>  
<a name="AST+ruleNodes"></a>

### asT.ruleNodes
{RuleNode[]

**Kind**: instance property of <code>[AST](#AST)</code>  
<a name="AST+getContainerRules"></a>

### asT.getContainerRules() ⇒ <code>[Array.&lt;Rule&gt;](#Rule)</code>
Returns the rules that describe grid containers (display: grid;).

**Kind**: instance method of <code>[AST](#AST)</code>  
<a name="AST+getContainerRuleNodes"></a>

### asT.getContainerRuleNodes() ⇒ <code>[Array.&lt;Rule&gt;](#Rule)</code>
Returns the rules that describe grid containers (display: grid;).

**Kind**: instance method of <code>[AST](#AST)</code>  
<a name="AST+getItemRules"></a>

### asT.getItemRules() ⇒ <code>[Array.&lt;Rule&gt;](#Rule)</code>
Returns the rules that describe grid items.

**Kind**: instance method of <code>[AST](#AST)</code>  
<a name="AST+getItemRuleNodes"></a>

### asT.getItemRuleNodes() ⇒ <code>[Array.&lt;Rule&gt;](#Rule)</code>
Returns the rules that describe grid containers (display: grid;).

**Kind**: instance method of <code>[AST](#AST)</code>  
<a name="AST+getRuleNodes"></a>

### asT.getRuleNodes() ⇒ <code>[Array.&lt;RuleNode&gt;](#RuleNode)</code>
Converts all nodes in all rules to RuleNode instances.

**Kind**: instance method of <code>[AST](#AST)</code>  
<a name="AST+buildTree"></a>

### asT.buildTree()
Returns a nested tree of RuleNode instances.

**Kind**: instance method of <code>[AST](#AST)</code>  
<a name="RuleNode"></a>

## RuleNode
Combines a single (cloned) Rule matched to a single Node

**Kind**: global class  

* [RuleNode](#RuleNode)
    * [new RuleNode(rule, node)](#new_RuleNode_new)
    * [.rule](#RuleNode+rule)
    * [.node](#RuleNode+node)

<a name="new_RuleNode_new"></a>

### new RuleNode(rule, node)
Constructor method.


| Param | Type |
| --- | --- |
| rule | <code>[Rule](#Rule)</code> | 
| node | <code>HTMLElement</code> | 

<a name="RuleNode+rule"></a>

### ruleNode.rule
{Rule}

**Kind**: instance property of <code>[RuleNode](#RuleNode)</code>  
<a name="RuleNode+node"></a>

### ruleNode.node
{HTMLElement}

**Kind**: instance property of <code>[RuleNode](#RuleNode)</code>  
<a name="Rule"></a>

## Rule
A parsed rule.

**Kind**: global class  

* [Rule](#Rule)
    * [new Rule(css)](#new_Rule_new)
    * [.parseCSS(rule)](#Rule+parseCSS) ⇒ <code>[Rule](#Rule)</code>
    * [.addMeta()](#Rule+addMeta)
    * [.addGridArea()](#Rule+addGridArea)
    * [.addColumns()](#Rule+addColumns)
    * [.addGap(property)](#Rule+addGap)
    * [.addSpan(property)](#Rule+addSpan)
    * [.isDisplayGrid()](#Rule+isDisplayGrid) ⇒ <code>boolean</code>
    * [.isGridRelated()](#Rule+isGridRelated) ⇒ <code>boolean</code>

<a name="new_Rule_new"></a>

### new Rule(css)
Constructor method.


| Param | Type |
| --- | --- |
| css | <code>string</code> | 

<a name="Rule+parseCSS"></a>

### rule.parseCSS(rule) ⇒ <code>[Rule](#Rule)</code>
Parses a

**Kind**: instance method of <code>[Rule](#Rule)</code>  

| Param |
| --- |
| rule | 

<a name="Rule+addMeta"></a>

### rule.addMeta()
Adds meta key to this.
Meta contains processed information about the this.rules.

**Kind**: instance method of <code>[Rule](#Rule)</code>  
<a name="Rule+addGridArea"></a>

### rule.addGridArea()
Parses "grid-area".
Adds "colSpan" and "rowSpan" to meta.

**Kind**: instance method of <code>[Rule](#Rule)</code>  
<a name="Rule+addColumns"></a>

### rule.addColumns()
Parses "grid-template-columns".
Adds "columns" to meta.

**Kind**: instance method of <code>[Rule](#Rule)</code>  
<a name="Rule+addGap"></a>

### rule.addGap(property)
Parses "grid-column-gap", "grid-row-gap" and "grid-gap".
Adds "colGap" and "rowGap" to meta.

**Kind**: instance method of <code>[Rule](#Rule)</code>  

| Param | Type |
| --- | --- |
| property | <code>string</code> | 

<a name="Rule+addSpan"></a>

### rule.addSpan(property)
Parses "grid-column" and "grid-row".
Adds "colSpan" and "rowSpan" to meta.

**Kind**: instance method of <code>[Rule](#Rule)</code>  

| Param | Type |
| --- | --- |
| property | <code>string</code> | 

<a name="Rule+isDisplayGrid"></a>

### rule.isDisplayGrid() ⇒ <code>boolean</code>
Returns whether this rule is a display: grid; statement.
This can be used to filter the grid container/parent.

**Kind**: instance method of <code>[Rule](#Rule)</code>  
<a name="Rule+isGridRelated"></a>

### rule.isGridRelated() ⇒ <code>boolean</code>
Returns whether this rule describes CSS grid behaviour.

**Kind**: instance method of <code>[Rule](#Rule)</code>  
