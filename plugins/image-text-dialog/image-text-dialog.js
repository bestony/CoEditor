/*!
 * Insert A Image With Text Plugin for Editor.md
 *
 * @file        image-text-dialog.js
 * @author      Bestony
 * @version     1.0.0
 * @updateTime  2017-01-25
 * {@link       https://github.com/pandao/editor.md}
 * @license     MIT
 */

(function() {

    var factory = function(exports) {

        var $ = jQuery;
        var pluginName = "image-text-dialog";
        exports.fn.imageTextDialog = function() {

            var _this = this;
            var cm = this.cm;
            var lang = this.lang;
            var editor = this.editor;
            var settings = this.settings;
            var cursor = cm.getCursor();
            var selection = cm.getSelection();
            var dialogLang = lang.dialog.imageText;
            var classPrefix = this.classPrefix;
            var dialogName = classPrefix + pluginName,
                dialog;

            cm.focus();

            if (editor.find("." + dialogName).length < 1) {
                console.log(cursor)
                var dialogHTML = "<div class=\"" + classPrefix + "form\">" +
                    "<label>" + dialogLang.imageUrl + "</label>" +
                    "<input type=\"text\" value=\"http://\" data-url />" +
                    "<br/>" +
                    "<label>" + dialogLang.imageAlt + "</label>" +
                    "<input type=\"text\" value=\"" + selection + "\" data-alt />" +
                    "<br/>" +
                    "</div>";
                dialog = this.createDialog({
                    name: dialogName,
                    title: dialogLang.title,
                    width: 380,
                    height: 196,
                    content: dialogHTML,
                    mask: settings.dialogShowMask,
                    drag: settings.dialogDraggable,
                    lockScreen: settings.dialogLockScreen,
                    maskStyle: {
                        opacity: settings.dialogMaskOpacity,
                        backgroundColor: settings.dialogMaskBgColor
                    },
                    buttons: {
                        enter: [lang.buttons.enter, function() {
                            var url = this.find("[data-url]").val();
                            var title = this.find("[data-alt]").val();

                            if (title === "") {
                                alert(dialogLang.nameEmpty);
                                return false;
                            }
                            if (url === "http://" || url === "") {
                                alert(dialogLang.urlEmpty);
                                return false;
                            }
                            cm.setValue(cm.getValue() + '\n\n<center><img src="' + url + '"  alt="' + title + '" /><p>' + title + '</p></center>')
                            this.hide().lockScreen(false).hideMask();
                            return false;
                        }],
                        cancel: [lang.buttons.cancel, function() {
                            this.hide().lockScreen(false).hideMask();
                            return false;
                        }]
                    }
                });
            }

            dialog = editor.find("." + dialogName);
            dialog.find("[data-url-id]").val("");
            dialog.find("[data-url]").val("http://");
            dialog.find("[data-title]").val(selection);
            this.dialogShowMask(dialog);
            this.dialogLockScreen();
            dialog.show();

        };
    };

    // CommonJS/Node.js
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        module.exports = factory;
    } else if (typeof define === "function") // AMD/CMD/Sea.js
    {
        if (define.amd) { // for Require.js

            define(["editormd"], function(editormd) {
                factory(editormd);
            });

        } else { // for Sea.js
            define(function(require) {
                var editormd = require("./../../editormd");
                factory(editormd);
            });
        }
    } else {
        factory(window.editormd);
    }

})();