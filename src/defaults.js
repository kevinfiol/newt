export const defaults = {
    "editMode": true,
    "options": {
        "color": "#2a2a2a",
        "bgColor": "#dadada",
        "fontFamily": "monospace",
        "customCss": ".content img { width: 100%; }\n.content a { color: #236780; }\n\n/* Uncomment the line below to remove default margins */\n/* .content > * { margin: 0; } */"
    },
    "boxMap": {
        "box-1": {
            "id": "box-1",
            "x": 37.5,
            "y": 37.5,
            "width": 412.5,
            "height": 212.5,
            "content": "# Welcome to newt\n\n`newt` is a Firefox Add-On that transforms your `about:newtab` into a customizable, Markdown-powered dashboard.\n\nTo start, right-click this box and select `Edit`. Or, right-click anywhere in the blank space and create a `New Box`."
        },
        "box-2": {
            "id": "box-2",
            "x": 475,
            "y": 212.5,
            "width": 400,
            "height": 425,
            "content": "![haggle artwork](https://raw.githubusercontent.com/kevinfiol/newt/master/demo.jpg \"artwork by twitter.com/haggle\")"
        },
        "box-3": {
            "id": "box-3",
            "x": 475,
            "y": 112.5,
            "width": 400,
            "height": 87.5,
            "content": "*Unfamiliar with Markdown?*\n\nClick [here](https://learnxinyminutes.com/docs/markdown/) for a Markdown Cheatsheet."
        },
        "box-4": {
            "id": "box-4",
            "x": 37.5,
            "y": 262.5,
            "width": 412.5,
            "height": 312.5,
            "content": "## Some Tips\n\n* Changes are saved **automatically**.\n* Fonts, Colors, and even CSS can be modified in the `Options` menu.\n* Enable `View Mode` to view your content as plain HTML.\n* You can scroll around your dashboard by holding `Ctrl` and clicking and dragging anywhere in the blank space.\n* Your config can be exported as JSON in the `Options` menu. **Local Images are not exported**."
        },
        "box-5": {
            "id": "box-5",
            "x": 900,
            "y": 237.5,
            "width": 200,
            "height": 62.5,
            "content": "artwork by [twitter.com/haggle](https://twitter.com/haggle)"
        },
        "box-6": {
            "id": "box-6",
            "x": 900,
            "y": 325,
            "width": 200,
            "height": 62.5,
            "content": "source code at [github.com/kevinfiol/newt](https://github.com/kevinfiol/newt)"
        },
        "box-7": {
            "id": "box-7",
            "x": 900,
            "y": 412.5,
            "width": 200,
            "height": 100,
            "content": "newt was built with\n* [mithril.js](https://mithril.js.org) \n* [codemirror](https://codemirror.net/)"
        }
    },
    "scroll": {
        "x": 0,
        "y": 0,
        "lock": false
    },
    "boxStackOrder": ['d5a0f39c3741fd00', 'ae3cf5e2e4c26000', 'ae3cf5e2e4c26001', 'ae3cf5e2e4c26002', 'b7df8b428d8af2700', 'b7df8b428d8af2701', 'b7df8b428d8af2702']
};