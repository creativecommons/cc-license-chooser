var html2dom = {

    result: new String(),

    getDOM: function (html, appendTo)
    {
        if (html.length = 0) {
            this.result = "";
            return this.result;
        }

        var root_name = "kindarandomandhopefullyunique" +
                        Math.round((Math.random() * 99999)+10000);

        html = "<" + root_name + ">" +
               html +
               "</" + root_name + ">";

        var doc;
        // code for IE
        if (window.ActiveXObject) {
            doc=new ActiveXObject("Microsoft.XMLDOM");
            doc.async="false";
            doc.loadXML(html);
        // code for Mozilla, Firefox, Opera, etc.
        } else {
            var parser=new DOMParser();
            doc=parser.parseFromString(html,"text/xml");
        }
        var root = doc.documentElement;

        if (root.hasChildNodes()) {

            if (appendTo) {
                if (typeof(appendTo) == "object") {
                    this.result = "var html2dom_root = " + appendTo + ";";
                } else if (typeof(appendTo) == "string") {
                    this.result = 'var html2dom_root = document.getElementById("' + appendTo + '");';
                }
            } else {
                this.result = "var html2dom_root = document.createElement('div');";
            }
            this.result += "\n";
            this.traverse(root, "html2dom_root");
        }
    },

    traverse: function (el, variable)
    {
        var children = el.childNodes;
        var max = children.length;
        for (var i = 0; i < max; i++) {

            var nodeval = this.escape(children[i].nodeValue);

            var newvar = variable + '_' + (i + 1);

            switch (children[i].nodeType) {
                case 1: // element
                    newvar += '_' + children[i].nodeName;
                    this.result += newvar
                                + ' = document.createElement("'
                                + children[i].nodeName
                                +'");\n';
                    if (children[i].attributes) {
                        for (var j = 0, a; a = children[i].attributes[j]; j++) {
                            this.result += newvar
                                        +  '.setAttribute("'
                                        + a['nodeName']
                                        +'", "'
                                        + this.escape(a['nodeValue'])
                                        +'");\n';
                        }
                    }
                    break;
                case 3: // text
                    newvar += '_text';
                    this.result += newvar + ' = document.createTextNode("'+ nodeval +'");\n';
                    break;
                case 8: //comment
                    newvar += '_comment';
                    this.result += newvar + ' = document.createComment("'+ nodeval +'");\n';
                    break;

            }

            if (children[i].hasChildNodes()) {
                this.traverse(children[i], newvar);
            }


            this.result += variable + '.appendChild('+ newvar + ');\n';
        }

    },

    escape: function (str) {
        if (!str) return null;
        str = str.replace(/\\/g,'\\\\');
        str = str.replace(/\"/g,'\\\"');
        str = str.replace(/\n/g,'\\n');
        str = str.replace(/\r/g,'\\r');
        return str;
    }
}