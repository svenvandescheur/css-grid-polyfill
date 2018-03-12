/**
 * Main polyfill class.
 * @class
 */
class Polyfill {
    /**
     * Constructor method.
     */
    constructor() {
        this.stylesheet = document.styleSheets[0];
        this.ast = this.createAST();
        this.apply();
    }

    /**
     * Converts this.stylesheets to an abstract syntax tree like object.
     * Returned object is used by this.apply() to polyfill CSS grid behaviour.
     * @returns {AST}
     */
    createAST() {
        let rules = [].map.call(this.stylesheet.rules, (css => new Rule(css)))
            .filter(rule => rule.isGridRelated());
        return new AST(rules);
    }

    /**
     * Builds the grid based on this.ast.
     */
    apply() {
        console.log(this.ast);
        let containers = this.ast.tree;


        // Generates code based on AST branches.
        // This loop takes care of containers.
        containers.forEach(container => {
            let node = container.node;

            // Apply container styles.
            let position = node.style.position.toLowerCase();
            if (position === '' || position === 'static') {
                node.style.position = 'relative';
            }


            // Container specific variables.
            let containerColumns = container.rule.meta.columns;
            let containerColumnCount = container.rule.meta.columns.length;
            let containerTotalWidth = container.node.clientWidth;
            let containerGutterWidth = (parseInt(container.rule.meta.colGap) || 0);
            let containerGutterHeight = (parseInt(container.rule.meta.rowGap) || 0);
            let containerTotalGutterWidth = containerGutterWidth * (containerColumnCount - 1);
            let containerColumnWidth = (containerTotalWidth - containerTotalGutterWidth) / containerColumnCount;


            // Cursors.
            let columnCursor = 0;
            let rowCursor = 0;
            let rowIndex = 0;
            let rowSpans = [];
            let rows = [];


            // Generates code based on AST leaves.
            // This loop takes care of column placement.
            container.tree.forEach((item, index) => {
                // Item specific variables.
                let itemColumnObject = containerColumns[index] || {width: 'auto'};
                let itemColSpan = item.rule.meta.colSpan || 1;
                let itemWidth;


                // Calculate width.
                if (itemColumnObject.width === 'auto') {
                    let gutters = Math.max(itemColSpan - 1, 0) * containerGutterWidth;
                    itemWidth = containerColumnWidth * itemColSpan + gutters;
                } else {
                    itemWidth = parseInt(itemColumnObject.width);
                }


                // Check if we need to continue to the next row.
                let columnIndex = (rows[rowIndex]) ? rows[rowIndex].length : 0;
                let skipped = rowSpans.filter(rSpan => rSpan.index === columnIndex && rSpan.rowSpan > 0)[0];
                let skippedWidth = (skipped) ? skipped.itemWidth + containerGutterWidth : 0;
                let nextLeft = columnCursor - containerGutterWidth + itemWidth + skippedWidth;

                if (nextLeft > containerTotalWidth) {
                    let tallestColumn = this.getTallestRuleNode(rows[rowIndex]).node.clientHeight;
                    columnCursor = 0;
                    rowCursor += tallestColumn + containerGutterHeight;
                    rowIndex++;
                }
                if (skipped) {
                    skipped.rowSpan--;
                }


                // Add item to row
                if (!rows[rowIndex]) {
                    rows[rowIndex] = [];
                }
                rows[rowIndex].push(item);


                // Apply items styles.
                item.node.style.position = 'absolute';
                item.node.style.width = itemWidth + 'px';
                item.node.style.left = columnCursor + 'px';
                item.node.style.top = rowCursor + 'px';


                // Update cursors.
                columnCursor += item.node.clientWidth + containerGutterWidth;


                // Rowspan
                let rowSpan = Math.max(item.rule.meta.rowSpan - 1 || 0, 0);

                if (rowSpan) {
                    rowSpans.push({index, rowSpan, itemWidth});
                }
            });


            // Generates code based on generated rows.
            // This loop takes care of row span.
            rows.forEach((row, rowIndex) => {
                row.forEach((column) => {
                    let rowsToCheck = Math.max(column.rule.meta.rowSpan - 1 || 0, 0);

                    if (!rows[rowIndex + 1]) {
                        return;
                    }

                    let guttersHeight = rowsToCheck * parseInt(container.rule.meta.rowGap);
                    let clientHeight = column.node.clientHeight + guttersHeight;

                    for (let i = 1; i <= rowsToCheck; i++) {
                        let nextRow = rows[rowIndex + i];

                        if (nextRow) {
                            clientHeight += this.getTallestRuleNode(nextRow).node.clientHeight;
                        }
                    }
                    column.node.style.height = clientHeight + 'px';
                });


            });


            // Update the container height based on the contents.
            container.node.style.height = container.node.scrollHeight + 'px';
        });
    }

    getTallestRuleNode(ruleNodes) {
        return ruleNodes.reduce((acc, val) => {
            return (acc.node.clientHeight > val.node.clientHeight) ? acc : val;
        }, ruleNodes[0]);
    }
}


/**
 * Represents the Abstract Syntax Tree
 */
class AST {
    /**
     * Constructor method.
     * @param {Rule} rules
     */
    constructor(rules) {
        /** {Rules[]} */
        this.rules = rules;

        /** {RuleNode[] */
        this.ruleNodes = [...this.getRuleNodes(this.getContainerRules()), ...this.getRuleNodes(this.getItemRules())];

        this.tree = this.buildTree();


    }

    /**
     * Returns the rules that describe grid containers (display: grid;).
     * @returns {Rule[]}
     */
    getContainerRules() {
        return this.rules.filter(rule => rule.isDisplayGrid());
    }

    /**
     * Returns the rules that describe grid containers (display: grid;).
     * @returns {Rule[]}
     */
    getContainerRuleNodes() {
        return this.ruleNodes.filter(ruleNode => ruleNode.rule.isDisplayGrid());
    }

    /**
     * Returns the rules that describe grid items.
     * @returns {Rule[]}
     */
    getItemRules() {
        return this.rules.filter(rule => !rule.isDisplayGrid());
    }

    /**
     * Returns the rules that describe grid containers (display: grid;).
     * @returns {Rule[]}
     */
    getItemRuleNodes() {
        return this.ruleNodes.filter(ruleNode => !ruleNode.rule.isDisplayGrid());
    }

    /**
     * Converts all nodes in all rules to RuleNode instances.
     * @returns {RuleNode[]}
     */
    getRuleNodes(rules) {
        let ruleNodes = [];

        rules.forEach(rule => {
            let nodes = rule.nodes;
            let rNodes = [];

            [].forEach.call(nodes, node => {
                let rNode = new RuleNode(rule, node);
                let existing = ruleNodes.filter(rn => rn.node === node)[0];
                if (existing) {
                    for (let key in rNode.rule.meta) {
                        existing.rule.meta[key] = rNode.rule.meta[key];
                    }
                } else {
                    ruleNodes.push(rNode);
                }
            });

            rNodes.forEach(ruleNode => ruleNodes.push(ruleNode));
        });
        return ruleNodes;
    }

    /**
     * Returns a nested tree of RuleNode instances.
     */
    buildTree() {
        let items = this.getItemRuleNodes();
        let containers = this.getContainerRuleNodes();

        containers.forEach(container => {
            container.tree = items.filter(item => {
                return [].indexOf.call(container.node.children, item.node) > -1;
            });
        });

        return containers;
    }
}


/**
 * Combines a single (cloned) Rule matched to a single Node
 * @class
 */
class RuleNode {
    /**
     * Constructor method.
     * @param {Rule} rule
     * @param {HTMLElement} node
     */
    constructor(rule, node) {
        /** {Rule} */
        this.rule = new Rule(rule.css);

        /** {HTMLElement} */
        this.node = node;
    }
}


/**
 * A parsed rule.
 * @class
 */
class Rule {
    /**
     * Constructor method.
     * @param {string} css
     */
    constructor(css) {
        let data = this.parseCSS(css);
        this.css = css;
        this.selector = data.selector;
        this.nodes = document.querySelectorAll(this.selector);
        this.rules = data.rules;
        this.addMeta();
    }

    /**
     * Parses a
     * @param rule
     * @returns {Rule}
     */
    parseCSS(rule) {
        let split = rule.cssText.split('{');
        let selector = split[0].trim();
        let rules = split[1]
            .replace(/([^:;]+)/g, '"$1"')
            .replace(/;/g, ',')
            .replace(/\s*?"\s+?/g, '"')
            .replace(/,"}"$/g, '}');

        rules = JSON.parse('{' + rules);

        return {
            selector,
            rules
        };
    }

    /**
     * Adds meta key to this.
     * Meta contains processed information about the this.rules.
     */
    addMeta() {
        this.meta = {};
        this.addColumns();
        this.addGridArea();
        this.addGap('grid-gap');
        this.addGap('grid-column-gap');
        this.addGap('grid-row-gap');
        this.addSpan('grid-column');
        this.addSpan('grid-row');
    }

    /**
     * Parses "grid-area".
     * Adds "colSpan" and "rowSpan" to meta.
     */
    addGridArea() {
        let cssText = this.rules['grid-area'];
        if (cssText) {
            let split = cssText.match(/span\s+?\d+/g);

            if (split[0]) {
                this.meta.rowSpan = parseInt(split[0].match(/\d+/));
            }
            if (split[1]) {
                this.meta.colSpan = parseInt(split[1].match(/\d+/));
            }
        }
    }

    /**
     * Parses "grid-template-columns".
     * Adds "columns" to meta.
     */
    addColumns() {
        let cssText = this.rules['grid-template-columns'];
        if (cssText) {
            let columns = cssText
                .replace(/\[.+?\]/g, '')
                .trim()
                .split(/\s+/);

            this.meta.columns = [];
            for (let i = 0; i < columns.length; i++) {
                this.meta.columns.push({width: columns[i]});
            }
        }
    }

    /**
     * Parses "grid-column-gap", "grid-row-gap" and "grid-gap".
     * Adds "colGap" and "rowGap" to meta.
     * @param {string} property
     */
    addGap(property) {
        let cssText = this.rules[property];

        if (property === 'grid-gap' && cssText) {
            let split = cssText.split(/\s+/);

            if (split[0]) {
                this.meta.rowGap = split[0];
            }
            if (split[1]) {
                this.meta.colGap = split[1];
            }
        }

        else if (cssText) {
            let key = (property.match('column') ? 'colGap' : 'rowGap');
            this.meta[key] = cssText;
        }
    }

    /**
     * Parses "grid-column" and "grid-row".
     * Adds "colSpan" and "rowSpan" to meta.
     * @param {string} property
     */
    addSpan(property) {
        let cssText = this.rules[property];
        if (cssText) {
            let span = cssText.match(/span\s+?\d+/g);
            if (span) {
                let key = (property.match('column') ? 'colSpan' : 'rowSpan');
                this.meta[key] = span[0].match(/\d+/)[0];
            }
        }
    }

    /**
     * Returns whether this rule is a display: grid; statement.
     * This can be used to filter the grid container/parent.
     * @returns {boolean}
     */
    isDisplayGrid() {
        let keys = Object.keys(this.rules)
            .filter(key => key.toLowerCase().match(/grid-template/));
        return keys.length > 0;
    }

    /**
     * Returns whether this rule describes CSS grid behaviour.
     * @returns {boolean}
     */
    isGridRelated() {
        return this.isDisplayGrid() || !!Object.keys(this.rules)
            .filter(key => key.match(/^grid/)).length;
    }
}


// if(navigator.userAgent.toLowerCase().match('trident')) {
new Polyfill();
// }
