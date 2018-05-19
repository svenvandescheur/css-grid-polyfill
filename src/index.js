import enquire from 'enquire.js';
import jsonQuotes from 'json-quotes';
import sortSpecificity from 'sort-specificity';

/**
 * Main polyfill class.
 * @class
 */
class Polyfill {
    /**
     * Constructor method.
     */
    constructor() {
        /** {CSSStyleSheet} */
        this.stylesheet = document.styleSheets[0];

        /** {AST|null} */
        this.ast = null;

        this.bindEvents();
        this.update();
    }

    /**
     * Binds events to callbacks.
     */
    bindEvents() {
        window.addEventListener('resize', this.update.bind(this));
    }

    /**
     * Updates the polyfill.
     * FIXME: Update not working correctly (resize vs refresh).
     */
    update() {
        this.ast = this.createAST();
        this.apply();
    }

    /**
     * Converts this.stylesheets to an abstract syntax tree like object.
     * Returned object is used by this.apply() to polyfill CSS grid behaviour.
     * @returns {AST}
     */
    createAST() {
        let rules = [].filter.call(this.stylesheet.rules, rule => !rule.parentRule && rule.type === CSSRule.STYLE_RULE)
            .map(css => new Rule(css))
            .filter(rule => rule.isGridRelated());

        [].filter.call(this.stylesheet.cssRules, rule => rule.type === 4)
            .forEach(mediaRule => {
                [].forEach.call(mediaRule.cssRules, css => {
                    rules.push(new Rule(css, mediaRule));
                });
            });

        rules.sort((a, b) => sortSpecificity([a.selector, b.selector]))
            // .reverse();

        return new AST(rules);
    }




    /**
     * Builds the grid based on this.ast.
     */
    apply() {
        console.log('GENERATED AST', this.ast);
        let containers = this.ast.tree;


        //
        // Process each grid container.
        //

        containers.forEach(container => {
            let node = container.node;


            //
            // Build abstract grid
            //

            let columns = container.rule.meta.columns.length;
            let item = container.tree[0];
            let pregrid = [[]];
            let pregridRow = 0;


            //
            // Step 1: Start building grid.
            //
            // Adds columns to two-dimensional array representing grid layout.
            // Every item with a colspan > 1 adds "false" cells to pregrid.
            // These tell the renderer to skip a grid position.
            //
            container.tree.forEach(item => {
                let empty = false;
                let colSpan = parseInt(item.rule.meta.colSpan) || 1;

                // Add empty "false" cells.
                while (colSpan) {
                    pregrid[pregridRow].push(empty ? false : item);
                    colSpan--;
                    empty = true;
                }

                // Create neext row.
                if (pregrid[pregridRow].length >= columns) {
                    pregridRow++;
                    pregrid[pregridRow] = [];
                }
            });

            //
            // Step 2: Deal with rowspan.
            //
            // Inserts "false" cells on colspan position on rows affected by rowspan starting on the correct column index.
            // Overflowing cells are moved to the next row.
            //
            pregrid.forEach((row, rowIndex) => {
                row.forEach((column, colIndex) => {
                    if (column === false) { return; }
                    let rowSpan = parseInt(column.rule.meta.rowSpan) || 1;
                    if (rowSpan <= 1) { return };

                    for (let i=1; i<rowSpan; i++) {
                        let processingRow = pregrid[rowIndex + i];
                        if (!processingRow) { return };

                        //  Inserts "false" cells on colspan position on rows affected by rowspan starting on the correct column index.
                        let colSpan = parseInt(column.rule.meta.colSpan) || 1;
                        for (let i=1; i<=colSpan; i++) {
                            processingRow.splice(colIndex, 0, false);
                        }

                        // Overflowing cells are moved to the next row.
                        let moved = processingRow.splice(-1 * colSpan);
                        if (moved.length) {
                            // Find or create next row.
                            let nextProcessingRow = pregrid[rowIndex + i + 1];
                            if (!nextProcessingRow) {
                                pregrid.push([]);
                                nextProcessingRow = pregrid[rowIndex + i + 1];
                            }

                            // Add overflowing cells to next row.
                            nextProcessingRow.unshift(...moved);
                        }
                    }
                });

                //
                // Step 3: Final cleanup.
                //
                // Preforms another overflow check ov the entire pregrid.
                //
                pregrid.forEach((processingRow, rowIndex) => {
                    let over = columns - processingRow.length;

                    if (over) {
                        let moved = processingRow.splice(-1 * over + 1);

                        if (moved.length) {
                            let nextProcessingRow = pregrid[rowIndex + 1];

                            if (!nextProcessingRow) {
                                pregrid.push([]);
                                nextProcessingRow = pregrid[rowIndex + 1];
                            }

                            nextProcessingRow.unshift(...moved);
                        }
                    }
                });
            });


            //
            // Apply container styles.
            //

            // Update container width if nost set.
            let position = node.style.position.toLowerCase();
            if (position === '' || position === 'static') {
                node.style.position = 'relative';
            }
            node.style.display = 'block';

            // Update the container height based on the contents.
            container.node.style.height = container.node.scrollHeight + 'px';


            //
            // Apply items styles.
            //

            let containerWidth = container.node.clientWidth;
            let colGap = parseInt(container.rule.meta.colGap) || 0;
            let colGapSum = (columns - 1) * colGap
            let rowGap = parseInt(container.rule.meta.rowGap) || 0;
            let columnWidth = (containerWidth - colGapSum) / columns;
            let top = 0;


            //
            // Step 1: Render grid items.
            //
            // Start with rendering the columns on rows with colspan taken into account.
            // The result should be a grid with cells positioned properly but with a non calculated height.
            //

            pregrid.forEach((row, rowIndex) => {
                // Columns
                row.forEach((column, columnIndex) => {
                    if (column === false) {
                        return;
                    }

                    let colSpan = parseInt(column.rule.meta.colSpan) || 1;
                    let left = columnIndex * columnWidth + columnIndex * colGap;
                    let width =  colSpan * columnWidth + (colSpan - 1) * colGap;
                    console.log(column)
                    column.node.style.position = 'absolute';
                    column.node.style.top = top + 'px';
                    column.node.style.left = left + 'px';
                    column.node.style.width = width + 'px';
                });

                // Rows
                row.height = row.reduce((acc, val) => Math.max(acc, val ? val.node.clientHeight : 0), 0);
                top += row.height + rowGap;
            });


            //
            // Step 2: Set cell heights.
            //
            // The height of cells is dependent on the colspan and the height of these rows.
            // The latter is unknown at the time of the initial render.
            // An additonal update is therefore requied.
            //

            pregrid.forEach((row, rowIndex) => {
                // Columns
                row.forEach((column, columnIndex) => {
                    if (column === false) {
                        return;
                    }

                    let height = 0;
                    let rowSpan = parseInt(column.rule.meta.rowSpan) || 1;

                    for (let i=0; i<rowSpan; i++) {
                        let processingRow = pregrid[rowIndex + i];
                        height += processingRow.height + rowGap;
                    };
                    height -= rowGap;

                    column.node.style.height = column.node.style.height || height + 'px';
                });
            });
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
        console.log(rules.map(rule => rule.selector))
        /** {Rules[]} */
        this.rules = rules.filter(rule => rule.isApplicable());

        /** {RuleNode[] */
        this.ruleNodes = [...this.getRuleNodes(this.getContainerRules()), ...this.getRuleNodes(this.getItemRules())];

        /** {RuleNode[] */
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
        return this.ruleNodes.filter(ruleNode => !ruleNode.rule.isDisplayGrid() && ruleNode.rule.isGridRelated());
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
                        if (rNode.rule.meta[key]) {
                            existing.rule.meta[key] = rNode.rule.meta[key];
                        }
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
        this.rule = new Rule(rule.css, rule.mediaRule);

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
     * @param {CSSStyleRule} css The CSSStyleRule containing parsable CSS.
     * @param {CSSMediaRule} mediaRule CSSMediaRule allowing to determine when to activate this rule.
     */
    constructor(css, mediaRule) {
        let data = this.parseCSS(css);
        this.css = css;
        this.mediaRule = mediaRule;
        this.selector = data.selector;
        this.nodes = document.querySelectorAll(this.selector);
        this.rules = data.rules;
        this.addMeta();
    }

    /**
     * Parses a
     * @param {CSSStyleRule} css
     * @returns {Rule}
     */
    parseCSS(rule) {
        let rules = {};
        let split = rule.cssText.split('{');
        let selector = split[0].trim();
        let cssRules = split[1]
            .split(';')
            .forEach(rule => {
                let [key, value] = rule.split(':')
                if (!value) {
                    return;
                }

                value = value.trim();
                rules[key.trim()] = value;
            });

        let result = {
            selector,
            rules
        };
        return result;
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
     * rs "grid-column" and "grid-row".
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

    /**
     * Returns whether this rule is applicable to the current state of the browser.
     * This takes media queries into account.
     * @returns {boolean}
     */
    isApplicable() {
        if (this.mediaRule) {
            return this.evaluateMediaRule();
        }
        return true;
    }

    /**
     * Evaluates this.mediaRule using enquire.js.
     * @returns {boolean}
     */
    evaluateMediaRule() {
        let result = null;
        let mq = this.mediaRule.cssText.match(/media.+(?=\s+{)/g);
        if (mq[0]) {
            mq = mq[0].replace('media ', '');
            enquire.register(mq, {
                match: () => result = true,
                unmatch: () => result = false
            });
            return result;
        }
    }
}


// Start!
if(navigator.userAgent.toLowerCase().match('trident')) {
    new Polyfill();
}
