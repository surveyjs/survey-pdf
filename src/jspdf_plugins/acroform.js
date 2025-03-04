/* global jsPDF */
/**
 * @license
 * Copyright (c) 2016 Alexander Weidt,
 * https://github.com/BiggA94
 * 
 * Licensed under the MIT License. http://opensource.org/licenses/mit-license
 */

/** 
* jsPDF AcroForm Plugin
* @module AcroForm
*/
import { jsPDF } from "jspdf";

(function (jsPDF, globalObj) {
    'use strict';

    var jsPDFAPI = jsPDF.API;
    var scope;
    var scaleFactor = 1;
    function toUnicode(str) {
        var unicodeString = '';
        for (var i = 0; i < str.length; i++) {
            var theUnicode = str.charCodeAt(i).toString(16).toUpperCase();
            while (theUnicode.length < 4) {
                theUnicode = '0' + theUnicode;
            };
            unicodeString += theUnicode;
        }
        return '<FEFF' + unicodeString + '>';
    }
    var pdfEscape = function (value) { return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)') };
    var pdfUnescape = function (value) { return value.replace(/\\\\/g, '\\').replace(/\\\(/g, '(').replace(/\\\)/g, ')'); };
    function arrayToPdfUnicodeArray(value) {
        var result = '[ ';
        for (var i = 0; i < value.length; i++) {
            result += toUnicode(value[i]);
        }
        result += ' ]'
        return result;
    }
    var f2 = function (number) {
        return number.toFixed(2); // Ie, %.2f
    };

    var f5 = function (number) {
        return number.toFixed(5); // Ie, %.2f
    };

    jsPDFAPI.__acroform__ = {};
    var inherit = function (child, parent) {
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
    };

    var scale = function (x) {
        return (x * scaleFactor);
    };
    var antiScale = function (x) {
        return (x / scaleFactor);
    };

    var createFormXObject = function (formObject) {
        var xobj = new AcroFormXObject();
        var height = AcroFormAppearance.internal.getHeight(formObject) || 0;
        var width = AcroFormAppearance.internal.getWidth(formObject) || 0;
        xobj.BBox = [0, 0, Number(f2(width)), Number(f2(height))];
        return xobj;
    };

    /**
    * Bit-Operations
    */
    var setBit = jsPDFAPI.__acroform__.setBit = function (number, bitPosition) {
        number = number || 0;
        bitPosition = bitPosition || 0;

        if (isNaN(number) || isNaN(bitPosition)) {
            throw new Error('Invalid arguments passed to jsPDF.API.__acroform__.setBit');
        }
        var bitMask = 1 << bitPosition;

        number |= bitMask;

        return number;
    };

    var clearBit = jsPDFAPI.__acroform__.clearBit = function (number, bitPosition) {
        number = number || 0;
        bitPosition = bitPosition || 0;

        if (isNaN(number) || isNaN(bitPosition)) {
            throw new Error('Invalid arguments passed to jsPDF.API.__acroform__.clearBit');
        }
        var bitMask = 1 << bitPosition;

        number &= ~bitMask;

        return number;
    };

    var getBit = jsPDFAPI.__acroform__.getBit = function (number, bitPosition) {
        if (isNaN(number) || isNaN(bitPosition)) {
            throw new Error('Invalid arguments passed to jsPDF.API.__acroform__.getBit');
        }
        return (number & (1 << bitPosition)) === 0 ? 0 : 1;
    };

    /*
    * Ff starts counting the bit position at 1 and not like javascript at 0
    */
    var getBitForPdf = jsPDFAPI.__acroform__.getBitForPdf = function (number, bitPosition) {
        if (isNaN(number) || isNaN(bitPosition)) {
            throw new Error('Invalid arguments passed to jsPDF.API.__acroform__.getBitForPdf');
        }
        return getBit(number, bitPosition - 1);
    };

    var setBitForPdf = jsPDFAPI.__acroform__.setBitForPdf = function (number, bitPosition) {
        if (isNaN(number) || isNaN(bitPosition)) {
            throw new Error('Invalid arguments passed to jsPDF.API.__acroform__.setBitForPdf');
        }
        return setBit(number, bitPosition - 1);
    };

    var clearBitForPdf = jsPDFAPI.__acroform__.clearBitForPdf = function (number, bitPosition) {
        if (isNaN(number) || isNaN(bitPosition)) {
            throw new Error('Invalid arguments passed to jsPDF.API.__acroform__.clearBitForPdf');
        }
        return clearBit(number, bitPosition - 1);
    };

    var calculateCoordinates = jsPDFAPI.__acroform__.calculateCoordinates = function (args) {
        var getHorizontalCoordinate = this.internal.getHorizontalCoordinate;
        var getVerticalCoordinate = this.internal.getVerticalCoordinate;
        var x = args[0];
        var y = args[1];
        var w = args[2];
        var h = args[3];

        var coordinates = {};

        coordinates.lowerLeft_X = getHorizontalCoordinate(x) || 0;
        coordinates.lowerLeft_Y = getVerticalCoordinate(y + h) || 0;
        coordinates.upperRight_X = getHorizontalCoordinate(x + w) || 0;
        coordinates.upperRight_Y = getVerticalCoordinate(y) || 0;

        return [Number(f2(coordinates.lowerLeft_X)), Number(f2(coordinates.lowerLeft_Y)), Number(f2(coordinates.upperRight_X)), Number(f2(coordinates.upperRight_Y))];
    };

    var calculateAppearanceStream = function (formObject) {
        if (formObject.appearanceStreamContent) {
            return formObject.appearanceStreamContent;
        }

        if (!formObject.V && !formObject.DV) {
            return;
        }

        // else calculate it

        var stream = [];
        var text = formObject.V || formObject.DV;
        var calcRes = calculateX(formObject, text);
        var fontKey = scope.internal.getFont(formObject.fontName, formObject.fontStyle).id;

        //PDF 32000-1:2008, page 444
        stream.push('/Tx BMC');
        stream.push('q');
        stream.push('BT'); // Begin Text
        stream.push(scope.__private__.encodeColorString(formObject.color));
        stream.push('/' + fontKey + ' ' + f2(calcRes.fontSize) + ' Tf');
        stream.push('1 0 0 1 0 0 Tm');// Transformation Matrix
        stream.push(calcRes.text);
        stream.push('ET'); // End Text    
        stream.push('Q');
        stream.push('EMC');

        var appearanceStreamContent = new createFormXObject(formObject);
        appearanceStreamContent.stream = stream.join("\n");
        return appearanceStreamContent;
    };

    var calculateX = function (formObject, text) {
        if (formObject.isUnicode) text = formObject.trueValue;
         var maxFontSize =
            formObject.fontSize === 0 ? formObject.maxFontSize : formObject.fontSize;
        var returnValue = {
            text: "",
            fontSize: ""
        };
        // Remove Brackets
        text = text.substr(0, 1) == "(" ? text.substr(1) : text;
        text =
            text.substr(text.length - 1) == ")"
            ? text.substr(0, text.length - 1)
            : text;
        // split into array of words
        var textSplit = text.split(" ");
        textSplit = textSplit.map(function (word) {
            return word.split("\n");
        });
        if (!formObject.multiline) {
            textSplit = textSplit.map(function (arr) {
                return [arr.join(" ")]
            });
        }

        var fontSize = maxFontSize; // The Starting fontSize (The Maximum)
        var lineSpacing = 2;
        var borderPadding = 2;

        var height = AcroFormAppearance.internal.getHeight(formObject) || 0;
        height = height < 0 ? -height : height;
        var width = AcroFormAppearance.internal.getWidth(formObject) || 0;
        width = width < 0 ? -width : width;

        var isSmallerThanWidth = function(i, lastLine, fontSize) {
            if (i + 1 < textSplit.length) {
            var tmp = lastLine + " " + textSplit[i + 1][0];
            var TextWidth = calculateFontSpace(tmp, formObject, fontSize).width;
            var FieldWidth = width - 2 * borderPadding;
            return TextWidth <= FieldWidth;
            } else {
            return false;
            }
        };

        fontSize++;
        FontSize: while (fontSize > 0) {
            text = "";
            fontSize--;
            var textHeight = calculateFontSpace("3", formObject, fontSize).height;
            var startY = formObject.multiline
            ? height - fontSize
            : (height - textHeight) / 2;
            startY += lineSpacing;
            var startX;

            var lastY = startY;
            var firstWordInLine = 0,
            lastWordInLine = 0;
            var lastLength;
            var currWord = 0;

            if (fontSize <= 0) {
            // In case, the Text doesn't fit at all
            fontSize = 12;
            text = "(...) Tj\n";
            text +=
                "% Width of Text: " +
                calculateFontSpace(text, formObject, fontSize).width +
                ", FieldWidth:" +
                width +
                "\n";
            break;
            }

            var lastLine = "";
            var lineCount = 0;
            Line: for (var i = 0; i < textSplit.length; i++) {
            if (textSplit.hasOwnProperty(i)) {
                var isWithNewLine = false;
                if (textSplit[i].length !== 1 && currWord !== textSplit[i].length - 1) {
                if (
                    (textHeight + lineSpacing) * (lineCount + 2) + lineSpacing >
                    height
                ) {
                    continue FontSize;
                }

                lastLine += textSplit[i][currWord];
                isWithNewLine = true;
                lastWordInLine = i;
                i--;
                } else {
                lastLine += textSplit[i][currWord] + " ";
                lastLine =
                    lastLine.substr(lastLine.length - 1) == " "
                    ? lastLine.substr(0, lastLine.length - 1)
                    : lastLine;
                var key = parseInt(i);
                var nextLineIsSmaller = isSmallerThanWidth(key, lastLine, fontSize);
                var isLastWord = i >= textSplit.length - 1;

                if (nextLineIsSmaller && !isLastWord) {
                    lastLine += " ";
                    currWord = 0;
                    continue; // Line
                } else if (!nextLineIsSmaller && !isLastWord) {
                    if (!formObject.multiline) {
                    continue FontSize;
                    } else {
                    if (
                        (textHeight + lineSpacing) * (lineCount + 2) + lineSpacing >
                        height
                    ) {
                        // If the Text is higher than the
                        // FieldObject
                        continue FontSize;
                    }
                    lastWordInLine = key;
                    // go on
                    }
                } else if (isLastWord) {
                    lastWordInLine = key;
                } else {
                    if (
                    formObject.multiline &&
                    (textHeight + lineSpacing) * (lineCount + 2) + lineSpacing >
                        height
                    ) {
                    // If the Text is higher than the FieldObject
                    continue FontSize;
                    }
                }
                }
                // Remove last blank

                var line = "";

                for (var x = firstWordInLine; x <= lastWordInLine; x++) {
                    var currLine = textSplit[x];
                    if (formObject.multiline) {
                        if (x === lastWordInLine) {
                        line += currLine[currWord] + " ";
                        currWord = (currWord + 1) % currLine.length;
                        continue;
                        }
                        if (x === firstWordInLine) {
                        line += currLine[currLine.length - 1] + " ";
                        continue;
                        }
                    }
                    line += currLine[0] + " ";
                }

                // Remove last blank
                line =
                line.substr(line.length - 1) == " "
                    ? line.substr(0, line.length - 1)
                    : line;
                // lastLength -= blankSpace.width;
                lastLength = calculateFontSpace(line, formObject, fontSize).width;

                // Calculate startX
                switch (formObject.textAlign) {
                case "right":
                    startX = width - lastLength - borderPadding;
                    break;
                case "center":
                    startX = (width - lastLength) / 2;
                    break;
                case "left":
                default:
                    startX = borderPadding;
                    break;
                }
                text += f2(startX) + " " + f2(lastY) + " Td\n";

                if (formObject.isUnicode) {
                    var fontList = {};
                    fontList[scope.internal.getFont().id] = scope.internal.getFont();
                    var payload = {
                        text: line,
                        x: null,
                        y: null,
                        options: {
                            lang: null
                        },
                        mutex: {
                            pdfEscape: pdfEscape,
                            activeFontKey: scope.internal.getFont().id,
                            fonts: fontList,
                            activeFontSize: formObject.fontSize
                        }
                    };
                    scope.internal.events.publish('postProcessText', payload);
                    text += '<' + payload.text + '> Tj\n';
                }
                else {
                    text += '(' + pdfEscape(line) + ') Tj\n';
                }
                // reset X in PDF
                text += -f2(startX) + " 0 Td\n";

                // After a Line, adjust y position
                lastY = -(fontSize + lineSpacing);

                // Reset for next iteration step
                lastLength = 0;
                firstWordInLine = isWithNewLine ? lastWordInLine : lastWordInLine + 1;
                lineCount++;

                lastLine = "";
                continue Line;
            }
            }
            break;
        }

        returnValue.text = text;
        returnValue.fontSize = fontSize;

        return returnValue;
    };

    /**
    * Small workaround for calculating the TextMetric approximately.
    * 
    * @param text
    * @param fontsize
    * @returns {TextMetrics} (Has Height and Width)
    */
    var calculateFontSpace = function (text, formObject, fontSize) {
        var font = scope.internal.getFont(formObject.fontName, formObject.fontStyle);
        var width = scope.getStringUnitWidth(text, { font: font, fontSize: parseFloat(fontSize), charSpace: 0 }) * parseFloat(fontSize);
        var height = scope.getStringUnitWidth("3", { font: font, fontSize: parseFloat(fontSize), charSpace: 0 }) * parseFloat(fontSize) * 1.5;
        return { height: height, width: width };
    };

    var acroformPluginTemplate = {
        fields: [],
        xForms: [],
        /**
        * acroFormDictionaryRoot contains information about the AcroForm
        * Dictionary 0: The Event-Token, the AcroFormDictionaryCallback has
        * 1: The Object ID of the Root
        */
        acroFormDictionaryRoot: null,
        /**
        * After the PDF gets evaluated, the reference to the root has to be
        * reset, this indicates, whether the root has already been printed
        * out
        */
        printedOut: false,
        internal: null,
        isInitialized: false
    };

    var annotReferenceCallback = function () {
        //set objId to undefined and force it to get a new objId on buildDocument
        scope.internal.acroformPlugin.acroFormDictionaryRoot.objId = undefined;
        var fields = scope.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
        for (var i in fields) {
            if (fields.hasOwnProperty(i)) {
                var formObject = fields[i];
                //set objId to undefined and force it to get a new objId on buildDocument
                formObject.objId = undefined;
                // add Annot Reference!
                if (formObject.hasAnnotation) {
                    // If theres an Annotation Widget in the Form Object, put the
                    // Reference in the /Annot array
                    createAnnotationReference.call(scope, formObject);
                }
            }
        }
    };

    var putForm = function (formObject) {
        if (scope.internal.acroformPlugin.printedOut) {
            scope.internal.acroformPlugin.printedOut = false;
            scope.internal.acroformPlugin.acroFormDictionaryRoot = null;
        }
        if (!scope.internal.acroformPlugin.acroFormDictionaryRoot) {
            initializeAcroForm.call(scope);
        }
        scope.internal.acroformPlugin.acroFormDictionaryRoot.Fields.push(formObject);
    };
    /**
    * Create the Reference to the widgetAnnotation, so that it gets referenced
    * in the Annot[] int the+ (Requires the Annotation Plugin)
    */
    var createAnnotationReference = function (object) {
        var options = {
            type: 'reference',
            object: object
        };
        var findEntry = function (entry) { return (entry.type === options.type && entry.object === options.object); };
        if (scope.internal.getPageInfo(object.page).pageContext.annotations.find(findEntry) === undefined) {
            scope.internal.getPageInfo(object.page).pageContext.annotations.push(options);
        }
    };

    // Callbacks

    var putCatalogCallback = function () {
        // Put reference to AcroForm to DocumentCatalog
        if (typeof scope.internal.acroformPlugin.acroFormDictionaryRoot != 'undefined') {
            // for safety, shouldn't normally be the case
            scope.internal.write('/AcroForm ' + scope.internal.acroformPlugin.acroFormDictionaryRoot.objId + ' ' + 0 + ' R');
        } else {
            throw new Error('putCatalogCallback: Root missing.');
        }
    };

    /**
    * Adds /Acroform X 0 R to Document Catalog, and creates the AcroForm
    * Dictionary
    */
    var AcroFormDictionaryCallback = function () {
        // Remove event
        scope.internal.events.unsubscribe(scope.internal.acroformPlugin.acroFormDictionaryRoot._eventID);
        delete scope.internal.acroformPlugin.acroFormDictionaryRoot._eventID;
        scope.internal.acroformPlugin.printedOut = true;
    };

    /**
    * Creates the single Fields and writes them into the Document
    * 
    * If fieldArray is set, use the fields that are inside it instead of the
    * fields from the AcroRoot (for the FormXObjects...)
    */
    var createFieldCallback = function (fieldArray) {
        var standardFields = (!fieldArray);

        if (!fieldArray) {
            // in case there is no fieldArray specified, we want to print out
            // the Fields of the AcroForm
            // Print out Root
            scope.internal.newObjectDeferredBegin(scope.internal.acroformPlugin.acroFormDictionaryRoot.objId, true);
            scope.internal.acroformPlugin.acroFormDictionaryRoot.putStream();
        }

        fieldArray = fieldArray || scope.internal.acroformPlugin.acroFormDictionaryRoot.Kids;

        for (var i in fieldArray) {
            if (fieldArray.hasOwnProperty(i)) {
                var fieldObject = fieldArray[i];
                var keyValueList = [];
                var oldRect = fieldObject.Rect;

                if (fieldObject.Rect) {
                    fieldObject.Rect = calculateCoordinates.call(this, fieldObject.Rect);
                }

                // Start Writing the Object
                scope.internal.newObjectDeferredBegin(fieldObject.objId, true);

                fieldObject.DA = AcroFormAppearance.createDefaultAppearanceStream(fieldObject);

                if (typeof fieldObject === "object" && typeof fieldObject.getKeyValueListForStream === "function") {
                    keyValueList = fieldObject.getKeyValueListForStream();
                }

                fieldObject.Rect = oldRect;

                if (fieldObject.hasAppearanceStream && !fieldObject.appearanceStreamContent) {
                    // Calculate Appearance
                    var appearance = calculateAppearanceStream.call(this, fieldObject);
                    keyValueList.push({ key: 'AP', value: "<</N " + appearance + ">>" });

                    scope.internal.acroformPlugin.xForms.push(appearance);
                }

                // Assume AppearanceStreamContent is a Array with N,R,D (at least
                // one of them!)
                if (fieldObject.appearanceStreamContent) {
                    var appearanceStreamString = "";
                    // Iterate over N,R and D
                    for (var k in fieldObject.appearanceStreamContent) {
                        if (fieldObject.appearanceStreamContent.hasOwnProperty(k)) {
                            var value = fieldObject.appearanceStreamContent[k];
                            appearanceStreamString += ("/" + k + " ");
                            appearanceStreamString += "<<";
                            if (Object.keys(value).length >= 1 || Array.isArray(value)) {
                                // appearanceStream is an Array or Object!
                                for (var i in value) {
                                    if (value.hasOwnProperty(i)) {
                                        var obj = value[i];
                                        if (typeof obj === 'function') {
                                            // if Function is referenced, call it in order
                                            // to get the FormXObject
                                            obj = obj.call(this, fieldObject);
                                        }
                                        appearanceStreamString += ("/" + i + " " + obj + " ");

                                        // In case the XForm is already used, e.g. OffState
                                        // of CheckBoxes, don't add it
                                        if (!(scope.internal.acroformPlugin.xForms.indexOf(obj) >= 0))
                                            scope.internal.acroformPlugin.xForms.push(obj);

                                    }
                                }
                            } else {
                                obj = value;
                                if (typeof obj === 'function') {
                                    // if Function is referenced, call it in order to
                                    // get the FormXObject
                                    obj = obj.call(this, fieldObject);
                                }
                                appearanceStreamString += ("/" + i + " " + obj);
                                if (!(scope.internal.acroformPlugin.xForms.indexOf(obj) >= 0))
                                    scope.internal.acroformPlugin.xForms.push(obj);
                            }
                            appearanceStreamString += ">>";
                        }
                    }

                    // appearance stream is a normal Object..
                    keyValueList.push({ key: 'AP', value: "<<\n" + appearanceStreamString + ">>" });
                }

                scope.internal.putStream({ additionalKeyValues: keyValueList });

                scope.internal.out("endobj");

            }
        }
        if (standardFields) {
            createXFormObjectCallback.call(this, scope.internal.acroformPlugin.xForms);
        }
    };

    var createXFormObjectCallback = function (fieldArray) {
        for (var i in fieldArray) {
            if (fieldArray.hasOwnProperty(i)) {
                var key = i;
                var fieldObject = fieldArray[i];
                // Start Writing the Object
                scope.internal.newObjectDeferredBegin(fieldObject && fieldObject.objId, true);

                if (typeof fieldObject === "object" && typeof fieldObject.putStream === "function") {
                    fieldObject.putStream();
                }
                delete fieldArray[key];
            }
        }
    };

    var initializeAcroForm = function () {
        if (this.internal !== undefined && (this.internal.acroformPlugin === undefined || this.internal.acroformPlugin.isInitialized === false)) {

            scope = this;

            AcroFormField.FieldNum = 0;
            this.internal.acroformPlugin = JSON.parse(JSON.stringify(acroformPluginTemplate));
            if (this.internal.acroformPlugin.acroFormDictionaryRoot) {
                throw new Error("Exception while creating AcroformDictionary");
            }
            scaleFactor = scope.internal.scaleFactor;
            // The Object Number of the AcroForm Dictionary
            scope.internal.acroformPlugin.acroFormDictionaryRoot = new AcroFormDictionary();

            // add Callback for creating the AcroForm Dictionary
            scope.internal.acroformPlugin.acroFormDictionaryRoot._eventID = scope.internal.events.subscribe('postPutResources', AcroFormDictionaryCallback);

            scope.internal.events.subscribe('buildDocument', annotReferenceCallback); // buildDocument

            // Register event, that is triggered when the DocumentCatalog is
            // written, in order to add /AcroForm
            scope.internal.events.subscribe('putCatalog', putCatalogCallback);

            // Register event, that creates all Fields
            scope.internal.events.subscribe('postPutPages', createFieldCallback);

            scope.internal.acroformPlugin.isInitialized = true;
        }
    };

    //PDF 32000-1:2008, page 26, 7.3.6
    var arrayToPdfArray = jsPDFAPI.__acroform__.arrayToPdfArray = function (array) {
        if (Array.isArray(array)) {
            var content = '[';
            for (var i = 0; i < array.length; i++) {
                if (i !== 0) {
                    content += ' ';
                }
                switch (typeof array[i]) {
                    case 'boolean':
                    case 'number':
                    case 'object':
                        content += array[i].toString();
                        break;
                    case 'string':
                        if (array[i].substr(0, 1) !== '/') {
                            content += '(' + pdfEscape(array[i].toString()) + ')';
                        } else {
                            content += array[i].toString();
                        }
                        break;
                }
            }
            content += ']';
            return content;
        }
        throw new Error('Invalid argument passed to jsPDF.__acroform__.arrayToPdfArray');
    };
    function getMatches(string, regex, index) {
        index || (index = 1); // default to the first capturing group
        var matches = [];
        var match;
        while (match = regex.exec(string)) {
            matches.push(match[index]);
        }
        return matches;
    }
    var pdfArrayToStringArray = function (array) {
        var result = [];
        if (typeof array === "string") {
            result = getMatches(array, /\((.*?)\)/g);
        }
        return result;
    };

    var toPdfString = function (string) {
        string = string || "";
        string.toString();
        string = '(' + pdfEscape(string) + ')';
        return string;
    };

    // ##########################
    // Classes
    // ##########################

    /**
    * @class AcroFormPDFObject
    * @classdesc A AcroFormPDFObject
    */
    var AcroFormPDFObject = function () {
        var _objId;

        /**
        * @name AcroFormPDFObject#objId
        * @type {any}
        */
        Object.defineProperty(this, 'objId', {
            configurable: true,
            get: function () {
                if (!_objId) {
                    _objId = scope.internal.newObjectDeferred();
                }
                return _objId
            },
            set: function (value) {
                _objId = value;
            }
        });
    };

    /**
    * @function AcroFormPDFObject.toString
    */
    AcroFormPDFObject.prototype.toString = function () {
        return this.objId + " 0 R";
    };

    AcroFormPDFObject.prototype.putStream = function () {
        var keyValueList = this.getKeyValueListForStream();
        scope.internal.putStream({ data: this.stream, additionalKeyValues: keyValueList });
        scope.internal.out("endobj");
    };

    /**
    * Returns an key-value-List of all non-configurable Variables from the Object
    * 
    * @name getKeyValueListForStream
    * @returns {string}
    */
    AcroFormPDFObject.prototype.getKeyValueListForStream = function () {
        var createKeyValueListFromFieldObject = function (fieldObject) {
            var keyValueList = [];
            var keys = Object.getOwnPropertyNames(fieldObject).filter(function (key) {
                return (key != 'content' && key != 'appearanceStreamContent' && key.substring(0, 1) != "_");
            });

            for (var i in keys) {
                var propertyDescriptor = Object.getOwnPropertyDescriptor(fieldObject, keys[i]);
                if (propertyDescriptor && propertyDescriptor.configurable === false) {
                    var key = keys[i];
                    var value = fieldObject[key];
                    if (value) {
                        if (Array.isArray(value)) {
                            keyValueList.push({ key: key, value: arrayToPdfArray(value) });
                        } else if (value instanceof AcroFormPDFObject) {
                            // In case it is a reference to another PDFObject,
                            // take the reference number
                            keyValueList.push({ key: key, value: value.objId + " 0 R" });
                        } else if (typeof value !== "function") {
                            keyValueList.push({ key: key, value: value });
                        }
                    }
                }
            }
            return keyValueList;
        };

        return createKeyValueListFromFieldObject(this);
    };

    var AcroFormXObject = function () {
        AcroFormPDFObject.call(this);


        Object.defineProperty(this, 'Type', {
            value: "/XObject",
            configurable: false,
            writeable: true
        });

        Object.defineProperty(this, 'Subtype', {
            value: "/Form",
            configurable: false,
            writeable: true
        });

        Object.defineProperty(this, 'FormType', {
            value: 1,
            configurable: false,
            writeable: true
        });

        var _BBox = [];
        Object.defineProperty(this, 'BBox', {
            configurable: false,
            writeable: true,
            get: function () {
                return _BBox;
            },
            set: function (value) {
                _BBox = value;
            }
        });

        Object.defineProperty(this, 'Resources', {
            value: "2 0 R",
            configurable: false,
            writeable: true
        });

        var _stream;
        Object.defineProperty(this, 'stream', {
            enumerable: false,
            configurable: true,
            set: function (value) {
                _stream = value.trim();
            },
            get: function () {
                if (_stream) {
                    return _stream;
                } else {
                    return null;
                }
            }
        });
    };

    inherit(AcroFormXObject, AcroFormPDFObject);

    var AcroFormDictionary = function () {
        AcroFormPDFObject.call(this);

        var _Kids = [];

        Object.defineProperty(this, 'Kids', {
            enumerable: false,
            configurable: true,
            get: function () {
                if (_Kids.length > 0) {
                    return _Kids;
                } else {
                    return undefined;
                }
            }
        });
        Object.defineProperty(this, 'Fields', {
            enumerable: false,
            configurable: false,
            get: function () {
                return _Kids;
            }
        });

        // Default Appearance
        var _DA;
        Object.defineProperty(this, 'DA', {
            enumerable: false,
            configurable: false,
            get: function () {
                if (!_DA) {
                    return undefined;
                }
                return '(' + _DA + ')'
            },
            set: function (value) {
                _DA = value;
            }
        });
    };

    inherit(AcroFormDictionary, AcroFormPDFObject);

    /**
    * The Field Object contains the Variables, that every Field needs
    * 
    * @class AcroFormField
    * @classdesc An AcroForm FieldObject
    */
    var AcroFormField = function () {
        AcroFormPDFObject.call(this);

        //Annotation-Flag See Table 165
        var _F = 4;
        this.isUnicode = false;
        this.trueValue = '';
        Object.defineProperty(this, 'F', {
            enumerable: false,
            configurable: false,
            get: function () {
                return _F;
            },
            set: function (value) {
                if (!isNaN(value)) {
                    _F = value;
                } else {
                    throw new Error('Invalid value "' + value + '" for attribute F supplied.');
                }
            }
        });

        /**
        * (PDF 1.2) If set, print the annotation when the page is printed. If clear, never print the annotation, regardless of wether is is displayed on the screen. 
        * NOTE 2 This can be useful for annotations representing interactive pushbuttons, which would serve no meaningful purpose on the printed page.
        *
        * @name AcroFormField#showWhenPrinted
        * @default true
        * @type {boolean}
        */
        Object.defineProperty(this, 'showWhenPrinted', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(_F, 3));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.F = setBitForPdf(_F, 3);
                } else {
                    this.F = clearBitForPdf(_F, 3);
                }
            }
        });

        var _Ff = 0;
        Object.defineProperty(this, 'Ff', {
            enumerable: false,
            configurable: false,
            get: function () {
                return _Ff;
            },
            set: function (value) {
                if (!isNaN(value)) {
                    _Ff = value;
                } else {
                    throw new Error('Invalid value "' + value + '" for attribute Ff supplied.');
                }
            }
        });

        var _Rect = [];
        Object.defineProperty(this, 'Rect', {
            enumerable: false,
            configurable: false,
            get: function () {
                if (_Rect.length === 0) {
                    return undefined;
                }
                return _Rect;
            },
            set: function (value) {
                if (typeof value !== "undefined") {
                    _Rect = value;
                } else {
                    _Rect = [];
                }
            }
        });

        /**
        * The x-position of the field.
        *
        * @name AcroFormField#x
        * @default null
        * @type {number}
        */
        Object.defineProperty(this, 'x', {
            enumerable: true,
            configurable: true,
            get: function () {
                if (!_Rect || isNaN(_Rect[0])) {
                    return 0;
                }
                return antiScale(_Rect[0]);
            },
            set: function (value) {
                _Rect[0] = scale(value);
            }
        });

        /**
        * The y-position of the field.
        *
        * @name AcroFormField#y
        * @default null
        * @type {number}
        */
        Object.defineProperty(this, 'y', {
            enumerable: true,
            configurable: true,
            get: function () {
                if (!_Rect || isNaN(_Rect[1])) {
                    return 0;
                }
                return antiScale(_Rect[1]);
            },
            set: function (value) {
                _Rect[1] = scale(value);
            }
        });

        /**
        * The width of the field.
        *
        * @name AcroFormField#width
        * @default null
        * @type {number}
        */
        Object.defineProperty(this, 'width', {
            enumerable: true,
            configurable: true,
            get: function () {
                if (!_Rect || isNaN(_Rect[2])) {
                    return 0;
                }
                return antiScale(_Rect[2]);
            },
            set: function (value) {
                _Rect[2] = scale(value);
            }
        });

        /**
        * The height of the field.
        *
        * @name AcroFormField#height
        * @default null
        * @type {number}
        */
        Object.defineProperty(this, 'height', {
            enumerable: true,
            configurable: true,
            get: function () {
                if (!_Rect || isNaN(_Rect[3])) {
                    return 0;
                }
                return antiScale(_Rect[3]);
            },
            set: function (value) {
                _Rect[3] = scale(value);
            }
        });

        var _FT = "";
        Object.defineProperty(this, 'FT', {
            enumerable: true,
            configurable: false,
            get: function () {
                return _FT
            },
            set: function (value) {
                switch (value) {
                    case '/Btn':
                    case '/Tx':
                    case '/Ch':
                    case '/Sig':
                        _FT = value;
                        break;
                    default:
                        throw new Error('Invalid value "' + value + '" for attribute FT supplied.');
                }
            }
        });

        var _T = null;

        Object.defineProperty(this, 'T', {
            enumerable: true,
            configurable: false,
            get: function () {
                if (!_T || _T.length < 1) {
                    // In case of a Child from a Radio´Group, you don't need a FieldName
                    if (this instanceof AcroFormChildClass) {
                        return undefined;
                    }
                    _T = "FieldObject" + (AcroFormField.FieldNum++);
                }
                return '(' + pdfEscape(_T) + ')';
            },
            set: function (value) {
                _T = value.toString();
            }
        });

        /**
        * (Optional) The partial field name (see 12.7.3.2, “Field Names”).
        *
        * @name AcroFormField#fieldName
        * @default null
        * @type {string}
        */
        Object.defineProperty(this, 'fieldName', {
            configurable: true,
            enumerable: true,
            get: function () {
                return _T;
            },
            set: function (value) {
                _T = value;
            }
        });

        var _fontName = 'helvetica';
        /**
        * The fontName of the font to be used.
        *
        * @name AcroFormField#fontName
        * @default 'helvetica'
        * @type {string}
        */
        Object.defineProperty(this, 'fontName', {
            enumerable: true,
            configurable: true,
            get: function () {
                return _fontName;
            },
            set: function (value) {
                _fontName = value;
            }
        });

        var _fontStyle = 'normal';
        /**
        * The fontStyle of the font to be used.
        *
        * @name AcroFormField#fontStyle
        * @default 'normal'
        * @type {string}
        */
        Object.defineProperty(this, 'fontStyle', {
            enumerable: true,
            configurable: true,
            get: function () {
                return _fontStyle;
            },
            set: function (value) {
                _fontStyle = value;
            }
        });

        var _fontSize = 0;
        /**
        * The fontSize of the font to be used.
        *
        * @name AcroFormField#fontSize
        * @default 0 (for auto)
        * @type {number}
        */
        Object.defineProperty(this, 'fontSize', {
            enumerable: true,
            configurable: true,
            get: function () {
                return antiScale(_fontSize);
            },
            set: function (value) {
                _fontSize = scale(value);
            }
        });

        var _maxFontSize = 50;
        /**
        * The maximum fontSize of the font to be used.
        *
        * @name AcroFormField#maxFontSize
        * @default 0 (for auto)
        * @type {number}
        */
        Object.defineProperty(this, 'maxFontSize', {
            enumerable: true,
            configurable: true,
            get: function () {
                return antiScale(_maxFontSize);
            },
            set: function (value) {
                _maxFontSize = scale(value);
            }
        });

        var _color = 'black';
        /**
        * The color of the text
        *
        * @name AcroFormField#color
        * @default 'black'
        * @type {string|rgba}
        */
        Object.defineProperty(this, 'color', {
            enumerable: true,
            configurable: true,
            get: function () {
                return _color;
            },
            set: function (value) {
                _color = value;
            }
        });

        var _DA = '/F1 0 Tf 0 g';
        // Defines the default appearance (Needed for variable Text)
        Object.defineProperty(this, 'DA', {
            enumerable: true,
            configurable: false,
            get: function () {
                if (!_DA
                    || this instanceof AcroFormChildClass
                    || this instanceof AcroFormTextField) {
                    return undefined;
                }
                return toPdfString(_DA);
            },
            set: function (value) {
                value = value.toString();
                _DA = value;
            }
        });


        var _DV = null;
        Object.defineProperty(this, 'DV', {
            enumerable: false,
            configurable: false,
            get: function () {
                if (!_DV) {
                    return undefined;
                }
                if ((this instanceof AcroFormButton === false)) {
                    return toPdfString(_DV);
                }
                return _DV;
            },
            set: function (value) {
                value = value.toString();
                if ((this instanceof AcroFormButton === false)) {
                    if (value.substr(0, 1) === '(') {
                        _DV = pdfUnescape(value.substr(1, value.length - 2));
                    } else {
                        _DV = pdfUnescape(value);
                    }
                } else {
                    _DV = value;
                }
            }
        });

        /**
        * (Optional; inheritable) The default value to which the field reverts when a reset-form action is executed (see 12.7.5.3, “Reset-Form Action”). The format of this value is the same as that of value. 
        *
        * @name AcroFormField#defaultValue
        * @default null
        * @type {any}
        */
        Object.defineProperty(this, 'defaultValue', {
            enumerable: true,
            configurable: true,
            get: function () {
                if ((this instanceof AcroFormButton === true)) {
                    return pdfUnescape(_DV.substr(1, _DV.length - 1));
                } else {
                    return _DV;
                }
            },
            set: function (value) {
                value = value.toString();
                if ((this instanceof AcroFormButton === true)) {
                    _DV = '/' + value;
                } else {
                    _DV = value;
                }
            }
        });

        var _V = null;
        Object.defineProperty(this, 'V', {
            enumerable: false,
            configurable: false,
            get: function () {
                if (this.isUnicode) {
                    return _V;
                }
                if (!_V) {
                    return undefined;
                }
                if ((this instanceof AcroFormButton === false)) {
                    return toPdfString(_V);
                }
                return _V;
            },
            set: function (value) {
                value = value.toString();
                if (this.isUnicode) {
                    _V = toUnicode(value);
                    this.trueValue = value;
                }
                else {
                    if ((this instanceof AcroFormButton === false)) {
                        if (value.substr(0, 1) === '(') {
                            _V = pdfUnescape(value.substr(1, value.length - 2));
                        } else {
                            _V = pdfUnescape(value);
                        }
                    } else {
                        _V = value;
                    }
                }
            }
        });

        /**
        * (Optional; inheritable) The field’s value, whose format varies depending on the field type. See the descriptions of individual field types for further information. 
        *
        * @name AcroFormField#value
        * @default null
        * @type {any}
        */
        Object.defineProperty(this, 'value', {
            enumerable: true,
            configurable: true,
            get: function () {
                if ((this instanceof AcroFormButton === true)) {
                    return pdfUnescape(_V.substr(1, _V.length - 1));
                } else {
                    return _V;
                }
            },
            set: function (value) {
                value = value.toString();
                if ((this instanceof AcroFormButton === true)) {
                    _V = '/' + value;
                } else {
                    _V = value;
                }
            }
        });

        /**
        * Check if field has annotations
        *
        * @name AcroFormField#hasAnnotation
        * @readonly
        * @type {boolean}
        */
        Object.defineProperty(this, 'hasAnnotation', {
            enumerable: true,
            configurable: true,
            get: function () {
                return (this.Rect);
            }
        });

        Object.defineProperty(this, 'Type', {
            enumerable: true,
            configurable: false,
            get: function () {
                return (this.hasAnnotation) ? "/Annot" : null;
            }
        });

        Object.defineProperty(this, 'Subtype', {
            enumerable: true,
            configurable: false,
            get: function () {
                return (this.hasAnnotation) ? "/Widget" : null;
            }
        });

        var _hasAppearanceStream = false;
        /**
        * true if field has an appearanceStream
        *
        * @name AcroFormField#hasAppearanceStream
        * @readonly
        * @type {boolean}
        */
        Object.defineProperty(this, 'hasAppearanceStream', {
            enumerable: true,
            configurable: true,
            writeable: true,
            get: function () {
                return _hasAppearanceStream;
            },
            set: function (value) {
                value = Boolean(value);
                _hasAppearanceStream = value;
            }
        });

        /**
        * The page on which the AcroFormField is placed
        *
        * @name AcroFormField#page
        * @type {number}
        */
        var _page;
        Object.defineProperty(this, 'page', {
            enumerable: true,
            configurable: true,
            writeable: true,
            get: function () {
                if (!_page) {
                    return undefined;
                }
                return _page
            },
            set: function (value) {
                _page = value;
            }
        });

        /**
        * If set, the user may not change the value of the field. Any associated widget annotations will not interact with the user; that is, they will not respond to mouse clicks or change their appearance in response to mouse motions. This flag is useful for fields whose values are computed or imported from a database. 
        *
        * @name AcroFormField#readOnly
        * @default false
        * @type {boolean}
        */
        Object.defineProperty(this, 'readOnly', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 1));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 1);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 1);
                }
            }
        });

        /**
        * If set, the field shall have a value at the time it is exported by a submitform action (see 12.7.5.2, “Submit-Form Action”). 
        *
        * @name AcroFormField#required
        * @default false
        * @type {boolean}
        */
        Object.defineProperty(this, 'required', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 2));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 2);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 2);
                }
            }
        });

        /**
        * If set, the field shall not be exported by a submit-form action (see 12.7.5.2, “Submit-Form Action”)
        *
        * @name AcroFormField#noExport
        * @default false
        * @type {boolean}
        */
        Object.defineProperty(this, 'noExport', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 3));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 3);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 3);
                }
            }
        });


        var _Q = null;
        Object.defineProperty(this, 'Q', {
            enumerable: true,
            configurable: false,
            get: function () {
                if (_Q === null) {
                    return undefined;
                }
                return _Q;
            },
            set: function (value) {
                if ([0, 1, 2].indexOf(value) !== -1) {
                    _Q = value;
                } else {
                    throw new Error('Invalid value "' + value + '" for attribute Q supplied.');
                }
            }
        });

        /**
        * (Optional; inheritable) A code specifying the form of quadding (justification) that shall be used in displaying the text:
        * 'left', 'center', 'right'
        *
        * @name AcroFormField#textAlign
        * @default 'left'
        * @type {string}
        */
        Object.defineProperty(this, 'textAlign', {
            get: function () {
                var result;
                switch (_Q) {
                    case 0:
                    default:
                        result = 'left';
                        break;
                    case 1:
                        result = 'center';
                        break;
                    case 2:
                        result = 'right';
                        break;
                }
                return result;
            },
            configurable: true,
            enumerable: true,
            set: function (value) {
                switch (value) {
                    case 'right':
                    case 2:
                        _Q = 2;
                        break;
                    case 'center':
                    case 1:
                        _Q = 1;
                        break;
                    case 'left':
                    case 0:
                    default:
                        _Q = 0;
                }
            }
        });

    };

    inherit(AcroFormField, AcroFormPDFObject);

    /**
    * @class AcroFormChoiceField
    * @extends AcroFormField
    */
    var AcroFormChoiceField = function () {
        AcroFormField.call(this);
        // Field Type = Choice Field
        this.FT = "/Ch";
        // options
        this.V = '()';

        this.fontName = 'zapfdingbats';
        // Top Index
        var _TI = 0;

        Object.defineProperty(this, 'TI', {
            enumerable: true,
            configurable: false,
            get: function () {
                return _TI;
            },
            set: function (value) {
                _TI = value;
            }
        });

        // MK fix for Acrobat
        var _MK = '<< /BG [ 0.975 0.975 0.975 ]  >>';
        Object.defineProperty(this, 'MK', {
            enumerable: true,
            configurable: false,
            get: function () {
                return _MK;
            },
            set: function (value) {
                _MK = value;
            }
        });

        /**
        * (Optional) For scrollable list boxes, the top index (the index in the Opt array of the first option visible in the list). Default value: 0.
        * 
        * @name AcroFormChoiceField#topIndex
        * @default 0
        * @type {number}
        */
        Object.defineProperty(this, 'topIndex', {
            enumerable: true,
            configurable: true,
            get: function () {
                return _TI;
            },
            set: function (value) {
                _TI = value;
            }
        });

        var _Opt = [];
        Object.defineProperty(this, 'Opt', {
            enumerable: true,
            configurable: false,
            get: function () {
                if (this.isUnicode) {
                    return arrayToPdfUnicodeArray(_Opt);
                }
                return arrayToPdfArray(_Opt);
            },
            set: function (value) {
                _Opt = pdfArrayToStringArray(value);
            }
        });


        /**
        * @memberof AcroFormChoiceField
        * @name getOptions
        * @function
        * @instance
        * @returns {array} array of Options
        */
        this.getOptions = function () {
            return _Opt;
        }

        /**
        * @memberof AcroFormChoiceField
        * @name setOptions
        * @function
        * @instance
        * @param {array} value
        */
        this.setOptions = function (value) {
            _Opt = value;
            if (this.sort) {
                _Opt.sort();
            }
        }

        /**
        * @memberof AcroFormChoiceField
        * @name addOption
        * @function
        * @instance
        * @param {string} value
        */
        this.addOption = function (value) {
            value = value || "";
            value = value.toString();
            _Opt.push(value);
            if (this.sort) {
                _Opt.sort();
            }
        }

        /**
        * @memberof AcroFormChoiceField
        * @name removeOption
        * @function
        * @instance
        * @param {string} value
        * @param {boolean} allEntries (default: false)
        */
        this.removeOption = function (value, allEntries) {
            allEntries = allEntries || false
            value = value || "";
            value = value.toString();

            while (_Opt.indexOf(value) !== -1) {
                _Opt.splice(_Opt.indexOf(value), 1);
                if (allEntries === false) {
                    break;
                }
            }
        };

        /**
        * If set, the field is a combo box; if clear, the field is a list box. 
        *
        * @name AcroFormChoiceField#combo
        * @default false
        * @type {boolean}
        */
        Object.defineProperty(this, 'combo', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 18));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 18);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 18);
                }
            }
        });

        /**
        * If set, the combo box shall include an editable text box as well as a drop-down list; if clear, it shall include only a drop-down list. This flag shall be used only if the Combo flag is set. 
        *
        * @name AcroFormChoiceField#edit
        * @default false
        * @type {boolean}
        */
        Object.defineProperty(this, 'edit', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 19));
            },
            set: function (value) {
                //PDF 32000-1:2008, page 444
                if (this.combo === true) {
                    if (Boolean(value) === true) {
                        this.Ff = setBitForPdf(this.Ff, 19);
                    } else {
                        this.Ff = clearBitForPdf(this.Ff, 19);
                    }
                }
            }
        });

        /**
        * If set, the field’s option items shall be sorted alphabetically. This flag is intended for use by writers, not by readers. Conforming readers shall display the options in the order in which they occur in the Opt array (see Table 231). 
        *
        * @name AcroFormChoiceField#sort
        * @default false
        * @type {boolean}
        */
        Object.defineProperty(this, 'sort', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 20));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 20);
                    _Opt.sort();
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 20);
                }
            }
        });

        /**
        * (PDF 1.4) If set, more than one of the field’s option items may be selected simultaneously; if clear, at most one item shall be selected 
        *
        * @name AcroFormChoiceField#multiSelect
        * @default false
        * @type {boolean}
        */
        Object.defineProperty(this, 'multiSelect', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 22));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 22);

                } else {
                    this.Ff = clearBitForPdf(this.Ff, 22);
                }
            }
        });

        /**
        * (PDF 1.4) If set, text entered in the field shall not be spellchecked. This flag shall not be used unless the Combo and Edit flags are both set. 
        *
        * @name AcroFormChoiceField#doNotSpellCheck
        * @default false
        * @type {boolean}
        */
        Object.defineProperty(this, 'doNotSpellCheck', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 23));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 23);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 23);
                }
            }
        });

        /**
        * (PDF 1.5) If set, the new value shall be committed as soon as a selection is made (commonly with the pointing device). In this case, supplying a value for a field involves three actions: selecting the field for fill-in, selecting a choice for the fill-in value, and leaving that field, which finalizes or “commits” the data choice and triggers any actions associated with the entry or changing of this data. If this flag is on, then processing does not wait for leaving the field action to occur, but immediately proceeds to the third step.
        * This option enables applications to perform an action once a selection is made, without requiring the user to exit the field. If clear, the new value is not committed until the user exits the field.
        *
        * @name AcroFormChoiceField#commitOnSelChange
        * @default false
        * @type {boolean}
        */
        Object.defineProperty(this, 'commitOnSelChange', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 27));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 27);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 27);
                }
            }
        });


        this.hasAppearanceStream = false;
    };
    inherit(AcroFormChoiceField, AcroFormField);

    /**
    * @class AcroFormListBox
    * @extends AcroFormChoiceField
    * @extends AcroFormField
    */
    var AcroFormListBox = function () {
        AcroFormChoiceField.call(this);
        this.fontName = 'helvetica';

        //PDF 32000-1:2008, page 444
        this.combo = false;
    };
    inherit(AcroFormListBox, AcroFormChoiceField);

    /**
    * @class AcroFormComboBox 
    * @extends AcroFormListBox
    * @extends AcroFormChoiceField
    * @extends AcroFormField
    */
    var AcroFormComboBox = function () {
        AcroFormListBox.call(this);
        this.combo = true;
    };
    inherit(AcroFormComboBox, AcroFormListBox);

    /**
    * @class AcroFormEditBox 
    * @extends AcroFormComboBox
    * @extends AcroFormListBox
    * @extends AcroFormChoiceField
    * @extends AcroFormField
    */
    var AcroFormEditBox = function () {
        AcroFormComboBox.call(this);
        this.edit = true;
    };
    inherit(AcroFormEditBox, AcroFormComboBox);

    /**
    * @class AcroFormButton
    * @extends AcroFormField
    */
    var AcroFormButton = function () {
        AcroFormField.call(this);
        this.FT = "/Btn";

        /**
        * (Radio buttons only) If set, exactly one radio button shall be selected at all times; selecting the currently selected button has no effect. If clear, clicking the selected button deselects it, leaving no button selected.
        * 
        * @name AcroFormButton#noToggleToOff
        * @type {boolean}
        */
        Object.defineProperty(this, 'noToggleToOff', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 15));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 15);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 15);
                }
            }
        });

        /**
        * If set, the field is a set of radio buttons; if clear, the field is a checkbox. This flag may be set only if the Pushbutton flag is clear. 
        * 
        * @name AcroFormButton#radio
        * @type {boolean}
        */
        Object.defineProperty(this, 'radio', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 16));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 16);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 16);
                }
            }
        });

        /**
        * If set, the field is a pushbutton that does not retain a permanent value. 
        *
        * @name AcroFormButton#pushButton
        * @type {boolean}
        */
        Object.defineProperty(this, 'pushButton', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 17));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 17);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 17);
                }
            }
        });

        /**
        * (PDF 1.5) If set, a group of radio buttons within a radio button field that use the same value for the on state will turn on and off in unison; that is if one is checked, they are all checked. If clear, the buttons are mutually exclusive (the same behavior as HTML radio buttons).
        *
        * @name AcroFormButton#radioIsUnison
        * @type {boolean}
        */
        Object.defineProperty(this, 'radioIsUnison', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 26));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 26);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 26);
                }
            }
        });

        var _MK = {};
        Object.defineProperty(this, 'MK', {
            enumerable: false,
            configurable: false,
            get: function () {
                if (Object.keys(_MK).length !== 0) {
                    var result = [];
                    result.push('<<');
                    var key;
                    for (key in _MK) {
                        result.push('/' + key + ' (' + _MK[key] + ')');
                    }
                    result.push('>>');
                    return result.join('\n');
                }
                return undefined;
            },
            set: function (value) {
                if (typeof value === "object") {
                    _MK = value
                }
            }
        });

        /**
        * From the PDF reference:
        * (Optional, button fields only) The widget annotation's normal caption which shall be displayed when it is not interacting with the user. 
        * Unlike the remaining entries listed in this Table which apply only to widget annotations associated with pushbutton fields (see Pushbuttons in 12.7.4.2, "Button Fields"), the CA entry may be used with any type of button field, including check boxes (see Check Boxes in 12.7.4.2, "Button Fields") and radio buttons (Radio Buttons in 12.7.4.2, "Button Fields").
        *
        * - '8' = Cross, 
        * - 'l' =  Circle,
        * - '' = nothing
        * @name AcroFormButton#caption
        * @type {string}
        */
        Object.defineProperty(this, 'caption', {
            enumerable: true,
            configurable: true,
            get: function () {
                return _MK.CA || '';
            },
            set: function (value) {
                if (typeof value === "string") {
                    _MK.CA = value;
                }
            }
        });

        var _AS;
        Object.defineProperty(this, 'AS', {
            enumerable: false,
            configurable: false,
            get: function () {
                return _AS;
            },
            set: function (value) {
                _AS = value;
            }
        });


        /**
        * (Required if the appearance dictionary AP contains one or more subdictionaries; PDF 1.2) The annotation's appearance state, which selects the applicable appearance stream from an appearance subdictionary (see Section 12.5.5, "Appearance Streams")
        *
        * @name AcroFormButton#appearanceState
        * @type {any}
        */
        Object.defineProperty(this, 'appearanceState', {
            enumerable: true,
            configurable: true,
            get: function () {
                return _AS.substr(1, _AS.length - 1);
            },
            set: function (value) {
                _AS = '/' + value;
            }
        });

    };
    inherit(AcroFormButton, AcroFormField);

    /**
    * @class AcroFormPushButton
    * @extends AcroFormButton
    * @extends AcroFormField
    */
    var AcroFormPushButton = function () {
        AcroFormButton.call(this);
        this.pushButton = true;
    };
    inherit(AcroFormPushButton, AcroFormButton);

    /**
    * @class AcroFormRadioButton
    * @extends AcroFormButton
    * @extends AcroFormField
    */
    var AcroFormRadioButton = function () {
        AcroFormButton.call(this);
        this.radio = true;
        this.pushButton = false;

        var _Kids = [];
        Object.defineProperty(this, 'Kids', {
            enumerable: true,
            configurable: false,
            get: function () {
                return _Kids;
            },
            set: function (value) {
                if (typeof value !== "undefined") {
                    _Kids = value;
                } else {
                    _Kids = [];
                }
            }
        });
    };
    inherit(AcroFormRadioButton, AcroFormButton);

    /**
    * The Child class of a RadioButton (the radioGroup) -> The single Buttons
    * 
    * @class AcroFormChildClass
    * @extends AcroFormField
    * @ignore
    */
    var AcroFormChildClass = function () {
        AcroFormField.call(this);

        var _parent;
        Object.defineProperty(this, 'Parent', {
            enumerable: false,
            configurable: false,
            get: function () {
                return _parent;
            },
            set: function (value) {
                _parent = value;
            }
        });

        var _optionName;
        Object.defineProperty(this, 'optionName', {
            enumerable: false,
            configurable: true,
            get: function () {
                return _optionName;
            },
            set: function (value) {
                _optionName = value;
            }
        });

        var _MK = {};
        Object.defineProperty(this, 'MK', {
            enumerable: false,
            configurable: false,
            get: function () {
                var result = [];
                result.push('<<');
                var key;
                for (key in _MK) {
                    result.push('/' + key + ' (' + _MK[key] + ')');
                }
                result.push('>>');
                return result.join('\n');
            },
            set: function (value) {
                if (typeof value === "object") {
                    _MK = value
                }
            }
        });

        /**
        * From the PDF reference:
        * (Optional, button fields only) The widget annotation's normal caption which shall be displayed when it is not interacting with the user. 
        * Unlike the remaining entries listed in this Table which apply only to widget annotations associated with pushbutton fields (see Pushbuttons in 12.7.4.2, "Button Fields"), the CA entry may be used with any type of button field, including check boxes (see Check Boxes in 12.7.4.2, "Button Fields") and radio buttons (Radio Buttons in 12.7.4.2, "Button Fields").
        *
        * - '8' = Cross, 
        * - 'l' =  Circle,
        * - '' = nothing
        * @name AcroFormButton#caption
        * @type {string}
        */
        Object.defineProperty(this, 'caption', {
            enumerable: true,
            configurable: true,
            get: function () {
                return _MK.CA || '';
            },
            set: function (value) {
                if (typeof value === "string") {
                    _MK.CA = value;
                }
            }
        });

        var _AS;
        Object.defineProperty(this, 'AS', {
            enumerable: false,
            configurable: false,
            get: function () {
                return _AS;
            },
            set: function (value) {
                _AS = value;
            }
        });

        /**
        * (Required if the appearance dictionary AP contains one or more subdictionaries; PDF 1.2) The annotation's appearance state, which selects the applicable appearance stream from an appearance subdictionary (see Section 12.5.5, "Appearance Streams")
        *
        * @name AcroFormButton#appearanceState
        * @type {any}
        */
        Object.defineProperty(this, 'appearanceState', {
            enumerable: true,
            configurable: true,
            get: function () {
                return _AS.substr(1, _AS.length - 1);
            },
            set: function (value) {
                _AS = '/' + value;
            }
        });
        this.caption = 'l';
        this.appearanceState = 'Off';
        // todo: set AppearanceType as variable that can be set from the
        // outside...
        this._AppearanceType = AcroFormAppearance.RadioButton.Circle;
        // The Default appearanceType is the Circle
        this.appearanceStreamContent = this._AppearanceType.createAppearanceStream(this.optionName);
    };
    inherit(AcroFormChildClass, AcroFormField);

    AcroFormRadioButton.prototype.setAppearance = function (appearance) {
        if (!('createAppearanceStream' in appearance && 'getCA' in appearance)) {
            throw new Error("Couldn't assign Appearance to RadioButton. Appearance was Invalid!");
        }
        for (var objId in this.Kids) {
            if (this.Kids.hasOwnProperty(objId)) {
                var child = this.Kids[objId];
                child.appearanceStreamContent = appearance.createAppearanceStream(child.optionName);
                child.caption = appearance.getCA();
            }
        }
    };

    AcroFormRadioButton.prototype.createOption = function (name) {
        // Create new Child for RadioGroup
        var child = new AcroFormChildClass();
        child.Parent = this;
        child.optionName = name;
        // Add to Parent
        this.Kids.push(child);

        addField.call(this, child);

        return child;
    };

    /**
    * @class AcroFormCheckBox
    * @extends AcroFormButton
    * @extends AcroFormField
    */
    var AcroFormCheckBox = function () {
        AcroFormButton.call(this);

        this.fontName = 'zapfdingbats';
        this.caption = '3';
        this.appearanceState = 'On';
        this.value = "On";
        this.textAlign = 'center';
        this.appearanceStreamContent = AcroFormAppearance.CheckBox.createAppearanceStream();
    };
    inherit(AcroFormCheckBox, AcroFormButton);

    /**
    * @class AcroFormTextField
    * @extends AcroFormField
    */
    var AcroFormTextField = function () {
        AcroFormField.call(this);
        this.FT = '/Tx';

        /**
        * If set, the field may contain multiple lines of text; if clear, the field’s text shall be restricted to a single line. 
        *
        * @name AcroFormTextField#multiline
        * @type {boolean}
        */
        Object.defineProperty(this, 'multiline', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 13));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 13);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 13);
                }
            }
        });

        /**
        * (PDF 1.4) If set, the text entered in the field represents the pathname of a file whose contents shall be submitted as the value of the field. 
        * 
        * @name AcroFormTextField#fileSelect
        * @type {boolean}
        */
        Object.defineProperty(this, 'fileSelect', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 21));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 21);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 21);
                }
            }
        });

        /**
        * (PDF 1.4) If set, text entered in the field shall not be spell-checked. 
        *
        * @name AcroFormTextField#doNotSpellCheck
        * @type {boolean}
        */
        Object.defineProperty(this, 'doNotSpellCheck', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 23));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 23);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 23);
                }
            }
        });

        /**
        * (PDF 1.4) If set, the field shall not scroll (horizontally for single-line fields, vertically for multiple-line fields) to accommodate more text than fits within its annotation rectangle. Once the field is full, no further text shall be accepted for interactive form filling; for noninteractive form filling, the filler should take care not to add more character than will visibly fit in the defined area. 
        * 
        * @name AcroFormTextField#doNotScroll
        * @type {boolean}
        */
        Object.defineProperty(this, 'doNotScroll', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 24));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 24);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 24);
                }
            }
        });

        /**
        * (PDF 1.5) May be set only if the MaxLen entry is present in the text field dictionary (see Table 229) and if the Multiline, Password, and FileSelect flags are clear. If set, the field shall be automatically divided into as many equally spaced positions, or combs, as the value of MaxLen, and the text is laid out into those combs.
        * 
        * @name AcroFormTextField#comb
        * @type {boolean}
        */
        Object.defineProperty(this, 'comb', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 25));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 25);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 25);
                }
            }
        });

        /**
        * (PDF 1.5) If set, the value of this field shall be a rich text string (see 12.7.3.4, “Rich Text Strings”). If the field has a value, the RV entry of the field dictionary (Table 222) shall specify the rich text string.
        * 
        * @name AcroFormTextField#richText
        * @type {boolean}
        */
        Object.defineProperty(this, 'richText', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 26));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 26);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 26);
                }
            }
        });

        var _MaxLen = null;
        Object.defineProperty(this, 'MaxLen', {
            enumerable: true,
            configurable: false,
            get: function () {
                return _MaxLen;
            },
            set: function (value) {
                _MaxLen = value;
            }
        });

        /**
        * (Optional; inheritable) The maximum length of the field’s text, in characters. 
        *
        * @name AcroFormTextField#maxLength
        * @type {number}
        */
        Object.defineProperty(this, 'maxLength', {
            enumerable: true,
            configurable: true,
            get: function () {
                return _MaxLen;
            },
            set: function (value) {
                if (Number.isInteger(value)) {
                    _MaxLen = value;
                }
            }
        });


        Object.defineProperty(this, 'hasAppearanceStream', {
            enumerable: true,
            configurable: true,
            get: function () {
                return (this.V || this.DV);
            }
        });

    };
    inherit(AcroFormTextField, AcroFormField);

    /**
    * @class AcroFormPasswordField
    * @extends AcroFormTextField
    * @extends AcroFormField
    */
    var AcroFormPasswordField = function () {
        AcroFormTextField.call(this);

        /**
        * If set, the field is intended for entering a secure password that should not be echoed visibly to the screen. Characters typed from the keyboard shall instead be echoed in some unreadable form, such as asterisks or bullet characters.
        * NOTE To protect password confidentiality, readers should never store the value of the text field in the PDF file if this flag is set. 
        *
        * @name AcroFormTextField#password
        * @type {boolean}
        */
        Object.defineProperty(this, 'password', {
            enumerable: true,
            configurable: true,
            get: function () {
                return Boolean(getBitForPdf(this.Ff, 14));
            },
            set: function (value) {
                if (Boolean(value) === true) {
                    this.Ff = setBitForPdf(this.Ff, 14);
                } else {
                    this.Ff = clearBitForPdf(this.Ff, 14);
                }
            }
        });
        this.password = true;
    };
    inherit(AcroFormPasswordField, AcroFormTextField);


    // Contains Methods for creating standard appearances
    var AcroFormAppearance = {
        CheckBox: {
            createAppearanceStream: function () {
                var appearance = {
                    N: {
                        On: AcroFormAppearance.CheckBox.YesNormal
                    },
                    D: {
                        On: AcroFormAppearance.CheckBox.YesPushDown,
                        Off: AcroFormAppearance.CheckBox.OffPushDown
                    }
                };

                return appearance;
            },
            /**
              * Returns the standard On Appearance for a CheckBox
              * 
              * @returns {AcroFormXObject}
              */
            YesPushDown: function (formObject) {
                var xobj = new createFormXObject(formObject);
                var stream = [];
                var fontKey = scope.internal.getFont(formObject.fontName, formObject.fontStyle).id;
                var encodedColor = scope.__private__.encodeColorString(formObject.color);
                var calcRes = calculateX(formObject, formObject.caption);
                stream.push("0.749023 g");
                stream.push("0 0 " + f2(AcroFormAppearance.internal.getWidth(formObject)) + " " + f2(AcroFormAppearance.internal.getHeight(formObject)) + " re");
                stream.push("f");
                stream.push("BMC");
                stream.push("q");
                stream.push("0 0 1 rg");
                stream.push("/" + fontKey + " " + f2(calcRes.fontSize) + " Tf " + encodedColor);
                stream.push("BT");
                stream.push(calcRes.text);
                stream.push("ET");
                stream.push("Q");
                stream.push("EMC");
                xobj.stream = stream.join("\n");
                return xobj;
            },

            YesNormal: function (formObject) {
                var xobj = new createFormXObject(formObject);
                var fontKey = scope.internal.getFont(formObject.fontName, formObject.fontStyle).id;
                var encodedColor = scope.__private__.encodeColorString(formObject.color);
                var stream = [];
                var height = AcroFormAppearance.internal.getHeight(formObject);
                var width = AcroFormAppearance.internal.getWidth(formObject);
                var calcRes = calculateX(formObject, formObject.caption);
                stream.push("1 g");
                stream.push("0 0 " + f2(width) + " " + f2(height) + " re");
                stream.push("f");
                stream.push("q");
                stream.push("0 0 1 rg");
                stream.push("0 0 " + f2(width - 1) + " " + f2(height - 1) + " re");
                stream.push("W");
                stream.push("n");
                stream.push("0 g");
                stream.push("BT");
                stream.push("/" + fontKey + " " + f2(calcRes.fontSize) + " Tf " + encodedColor);
                stream.push(calcRes.text);
                stream.push("ET");
                stream.push("Q");
                xobj.stream = stream.join("\n");
                return xobj;
            },

            /**
              * Returns the standard Off Appearance for a CheckBox
              * 
              * @returns {AcroFormXObject}
              */
            OffPushDown: function (formObject) {
                var xobj = new createFormXObject(formObject);
                var stream = [];
                stream.push("0.749023 g");
                stream.push("0 0 " + f2(AcroFormAppearance.internal.getWidth(formObject)) + " " + f2(AcroFormAppearance.internal.getHeight(formObject)) + " re");
                stream.push("f");
                xobj.stream = stream.join("\n");
                return xobj;
            }
        },

        RadioButton: {
            Circle: {
                createAppearanceStream: function (name) {
                    var appearanceStreamContent = {
                        D: {
                            'Off': AcroFormAppearance.RadioButton.Circle.OffPushDown
                        },
                        N: {}
                    };
                    appearanceStreamContent.N[name] = AcroFormAppearance.RadioButton.Circle.YesNormal;
                    appearanceStreamContent.D[name] = AcroFormAppearance.RadioButton.Circle.YesPushDown;
                    return appearanceStreamContent;
                },
                getCA: function () {
                    return 'l';
                },

                YesNormal: function (formObject) {
                    var xobj = new createFormXObject(formObject);
                    var stream = [];
                    // Make the Radius of the Circle relative to min(height, width) of formObject
                    var DotRadius = (AcroFormAppearance.internal.getWidth(formObject) <= AcroFormAppearance.internal.getHeight(formObject)) ? AcroFormAppearance.internal.getWidth(formObject) / 4 : AcroFormAppearance.internal.getHeight(formObject) / 4;
                    // The Borderpadding...
                    DotRadius = Number((DotRadius * 0.9).toFixed(5));
                    var c = AcroFormAppearance.internal.Bezier_C;
                    var DotRadiusBezier = Number((DotRadius * c).toFixed(5));
                    /*
                      * The Following is a Circle created with Bezier-Curves.
                      */
                    stream.push("q");
                    stream.push("1 0 0 1 " + f5(AcroFormAppearance.internal.getWidth(formObject) / 2) + " " + f5(AcroFormAppearance.internal.getHeight(formObject) / 2) + " cm");
                    stream.push(DotRadius + " 0 m");
                    stream.push(DotRadius + " " + DotRadiusBezier + " " + DotRadiusBezier + " " + DotRadius + " 0 " + DotRadius + " c");
                    stream.push("-" + DotRadiusBezier + " " + DotRadius + " -" + DotRadius + " " + DotRadiusBezier + " -" + DotRadius + " 0 c");
                    stream.push("-" + DotRadius + " -" + DotRadiusBezier + " -" + DotRadiusBezier + " -" + DotRadius + " 0 -" + DotRadius + " c");
                    stream.push(DotRadiusBezier + " -" + DotRadius + " " + DotRadius + " -" + DotRadiusBezier + " " + DotRadius + " 0 c");
                    stream.push("f");
                    stream.push("Q");
                    xobj.stream = stream.join("\n");
                    return xobj;
                },
                YesPushDown: function (formObject) {
                    var xobj = new createFormXObject(formObject);
                    var stream = [];
                    var DotRadius = (AcroFormAppearance.internal.getWidth(formObject) <= AcroFormAppearance.internal.getHeight(formObject)) ?
                        AcroFormAppearance.internal.getWidth(formObject) / 4 : AcroFormAppearance.internal.getHeight(formObject) / 4;
                    // The Borderpadding...
                    var DotRadius = Number((DotRadius * 0.9).toFixed(5));
                    // Save results for later use; no need to waste
                    // processor ticks on doing math
                    var k = Number((DotRadius * 2).toFixed(5));
                    var kc = Number((k * AcroFormAppearance.internal.Bezier_C).toFixed(5));
                    var dc = Number((DotRadius * AcroFormAppearance.internal.Bezier_C).toFixed(5));

                    stream.push("0.749023 g");
                    stream.push("q");
                    stream.push("1 0 0 1 " + f5(AcroFormAppearance.internal.getWidth(formObject) / 2) + " " + f5(AcroFormAppearance.internal.getHeight(formObject) / 2) + " cm");
                    stream.push(k + " 0 m");
                    stream.push(k + " " + kc + " " + kc + " " + k + " 0 " + k + " c");
                    stream.push("-" + kc + " " + k + " -" + k + " " + kc + " -" + k + " 0 c");
                    stream.push("-" + k + " -" + kc + " -" + kc + " -" + k + " 0 -" + k + " c");
                    stream.push(kc + " -" + k + " " + k + " -" + kc + " " + k + " 0 c");
                    stream.push("f");
                    stream.push("Q");
                    stream.push("0 g");
                    stream.push("q");
                    stream.push("1 0 0 1 " + f5(AcroFormAppearance.internal.getWidth(formObject) / 2) + " " + f5(AcroFormAppearance.internal.getHeight(formObject) / 2) + " cm");
                    stream.push(DotRadius + " 0 m");
                    stream.push("" + DotRadius + " " + dc + " " + dc + " " + DotRadius + " 0 " + DotRadius + " c");
                    stream.push("-" + dc + " " + DotRadius + " -" + DotRadius + " " + dc + " -" + DotRadius + " 0 c");
                    stream.push("-" + DotRadius + " -" + dc + " -" + dc + " -" + DotRadius + " 0 -" + DotRadius + " c");
                    stream.push(dc + " -" + DotRadius + " " + DotRadius + " -" + dc + " " + DotRadius + " 0 c");
                    stream.push("f");
                    stream.push("Q");
                    xobj.stream = stream.join("\n");
                    return xobj;
                },
                OffPushDown: function (formObject) {
                    var xobj = new createFormXObject(formObject);
                    var stream = [];
                    var DotRadius = (AcroFormAppearance.internal.getWidth(formObject) <= AcroFormAppearance.internal.getHeight(formObject)) ?
                        AcroFormAppearance.internal.getWidth(formObject) / 4 : AcroFormAppearance.internal.getHeight(formObject) / 4;
                    // The Borderpadding...
                    DotRadius = Number((DotRadius * 0.9).toFixed(5));
                    // Save results for later use; no need to waste
                    // processor ticks on doing math
                    var k = Number((DotRadius * 2).toFixed(5));
                    var kc = Number((k * AcroFormAppearance.internal.Bezier_C).toFixed(5));

                    stream.push("0.749023 g");
                    stream.push("q");
                    stream.push("1 0 0 1 " + f5(AcroFormAppearance.internal.getWidth(formObject) / 2) + " " + f5(AcroFormAppearance.internal.getHeight(formObject) / 2) + " cm");
                    stream.push(k + " 0 m");
                    stream.push(k + " " + kc + " " + kc + " " + k + " 0 " + k + " c");
                    stream.push("-" + kc + " " + k + " -" + k + " " + kc + " -" + k + " 0 c");
                    stream.push("-" + k + " -" + kc + " -" + kc + " -" + k + " 0 -" + k + " c");
                    stream.push(kc + " -" + k + " " + k + " -" + kc + " " + k + " 0 c");
                    stream.push("f");
                    stream.push("Q");
                    xobj.stream = stream.join("\n");
                    return xobj;
                },
            },

            Cross: {
                /**
                  * Creates the Actual AppearanceDictionary-References
                  * 
                  * @param {string} name
                  * @returns {Object}
                  * @ignore
                  */
                createAppearanceStream: function (name) {
                    var appearanceStreamContent = {
                        D: {
                            'Off': AcroFormAppearance.RadioButton.Cross.OffPushDown
                        },
                        N: {}
                    };
                    appearanceStreamContent.N[name] = AcroFormAppearance.RadioButton.Cross.YesNormal;
                    appearanceStreamContent.D[name] = AcroFormAppearance.RadioButton.Cross.YesPushDown;
                    return appearanceStreamContent;
                },
                getCA: function () {
                    return '8'
                },


                YesNormal: function (formObject) {
                    var xobj = new createFormXObject(formObject);
                    var stream = [];
                    var cross = AcroFormAppearance.internal.calculateCross(formObject);
                    stream.push("q");
                    stream.push("1 1 " + f2(AcroFormAppearance.internal.getWidth(formObject) - 2) + " " + f2(AcroFormAppearance.internal.getHeight(formObject) - 2) + " re");
                    stream.push("W");
                    stream.push("n");
                    stream.push(f2(cross.x1.x) + " " + f2(cross.x1.y) + " m");
                    stream.push(f2(cross.x2.x) + " " + f2(cross.x2.y) + " l");
                    stream.push(f2(cross.x4.x) + " " + f2(cross.x4.y) + " m");
                    stream.push(f2(cross.x3.x) + " " + f2(cross.x3.y) + " l");
                    stream.push("s");
                    stream.push("Q");
                    xobj.stream = stream.join("\n");
                    return xobj;
                },
                YesPushDown: function (formObject) {
                    var xobj = new createFormXObject(formObject);
                    var cross = AcroFormAppearance.internal.calculateCross(formObject);
                    var stream = [];
                    stream.push("0.749023 g");
                    stream.push("0 0 " + f2(AcroFormAppearance.internal.getWidth(formObject)) + " " + f2(AcroFormAppearance.internal.getHeight(formObject)) + " re");
                    stream.push("f");
                    stream.push("q");
                    stream.push("1 1 " + f2(AcroFormAppearance.internal.getWidth(formObject) - 2) + " " + f2(AcroFormAppearance.internal.getHeight(formObject) - 2) + " re");
                    stream.push("W");
                    stream.push("n");
                    stream.push(f2(cross.x1.x) + " " + f2(cross.x1.y) + " m");
                    stream.push(f2(cross.x2.x) + " " + f2(cross.x2.y) + " l");
                    stream.push(f2(cross.x4.x) + " " + f2(cross.x4.y) + " m");
                    stream.push(f2(cross.x3.x) + " " + f2(cross.x3.y) + " l");
                    stream.push("s");
                    stream.push("Q");
                    xobj.stream = stream.join("\n");
                    return xobj;
                },
                OffPushDown: function (formObject) {
                    var xobj = new createFormXObject(formObject);
                    var stream = [];
                    stream.push("0.749023 g");
                    stream.push("0 0 " + f2(AcroFormAppearance.internal.getWidth(formObject)) + " " + f2(AcroFormAppearance.internal.getHeight(formObject)) + " re");
                    stream.push("f");
                    xobj.stream = stream.join("\n");
                    return xobj;
                }
            },
        },

        /**
          * Returns the standard Appearance
          * 
          * @returns {AcroFormXObject}
          */
        createDefaultAppearanceStream: function (formObject) {
            // Set Helvetica to Standard Font (size: auto)
            // Color: Black
            var fontKey = scope.internal.getFont(formObject.fontName, formObject.fontStyle).id;
            var encodedColor = scope.__private__.encodeColorString(formObject.color);
            var fontSize = formObject.fontSize;
            var result = '/' + fontKey + ' ' + fontSize + ' Tf ' + encodedColor;
            return result;
        }
    };

    AcroFormAppearance.internal = {
        Bezier_C: 0.551915024494,

        calculateCross: function (formObject) {

            var width = AcroFormAppearance.internal.getWidth(formObject);
            var height = AcroFormAppearance.internal.getHeight(formObject);
            var a = Math.min(width, height);

            var cross = {
                x1: { // upperLeft
                    x: (width - a) / 2,
                    y: ((height - a) / 2) + a,// height - borderPadding
                },
                x2: { // lowerRight
                    x: ((width - a) / 2) + a,
                    y: ((height - a) / 2)// borderPadding
                },
                x3: { // lowerLeft
                    x: (width - a) / 2,
                    y: ((height - a) / 2)// borderPadding
                },
                x4: { // upperRight
                    x: ((width - a) / 2) + a,
                    y: ((height - a) / 2) + a,// height - borderPadding
                }
            };

            return cross;
        },
    };
    AcroFormAppearance.internal.getWidth = function (formObject) {
        var result = 0;
        if (typeof formObject === "object") {
            result = scale(formObject.Rect[2]);
        }
        return result;
    };
    AcroFormAppearance.internal.getHeight = function (formObject) {
        var result = 0;
        if (typeof formObject === "object") {
            result = scale(formObject.Rect[3]);
        }
        return result;
    };

    // Public:

    /**
    * Add an AcroForm-Field to the jsPDF-instance
    *
    * @name addField
    * @function 
    * @instance
    * @param {Object} fieldObject
    * @returns {jsPDF}
    */
    var addField = jsPDFAPI.addField = function (fieldObject) {
        initializeAcroForm.call(this);

        if (fieldObject instanceof AcroFormField) {
            putForm.call(this, fieldObject);
        } else {
            throw new Error('Invalid argument passed to jsPDF.addField.');
        }
        fieldObject.page = scope.internal.getCurrentPageInfo().pageNumber;
        return this;
    };

    /**
    * @name addButton
    * @function
    * @instance
    * @param {AcroFormButton} options
    * @returns {jsPDF}
    * @deprecated
    */
    jsPDFAPI.addButton = function (button) {
        if (button instanceof AcroFormButton === false) {
            throw new Error('Invalid argument passed to jsPDF.addButton.');
        }
        return addField.call(this, button);
    };

    /**
    * @name addTextField
    * @function
    * @instance
    * @param {AcroFormTextField} textField
    * @returns {jsPDF}
    * @deprecated
    */
    jsPDFAPI.addTextField = function (textField) {
        if (textField instanceof AcroFormTextField === false) {
            throw new Error('Invalid argument passed to jsPDF.addTextField.');
        }
        return addField.call(this, textField);
    };

    /**
    * @name addChoiceField
    * @function
    * @instance
    * @param {AcroFormChoiceField} 
    * @returns {jsPDF}
    * @deprecated
    */
    jsPDFAPI.addChoiceField = function (choiceField) {
        if (choiceField instanceof AcroFormChoiceField === false) {
            throw new Error('Invalid argument passed to jsPDF.addChoiceField.');
        }
        return addField.call(this, choiceField);
    };

    if (typeof globalObj == "object" &&
        typeof (globalObj["ChoiceField"]) === "undefined" &&
        typeof (globalObj["ListBox"]) === "undefined" &&
        typeof (globalObj["ComboBox"]) === "undefined" &&
        typeof (globalObj["EditBox"]) === "undefined" &&
        typeof (globalObj["Button"]) === "undefined" &&
        typeof (globalObj["PushButton"]) === "undefined" &&
        typeof (globalObj["RadioButton"]) === "undefined" &&
        typeof (globalObj["CheckBox"]) === "undefined" &&
        typeof (globalObj["TextField"]) === "undefined" &&
        typeof (globalObj["PasswordField"]) === "undefined"
    ) {
        globalObj["ChoiceField"] = AcroFormChoiceField;
        globalObj["ListBox"] = AcroFormListBox;
        globalObj["ComboBox"] = AcroFormComboBox;
        globalObj["EditBox"] = AcroFormEditBox;
        globalObj["Button"] = AcroFormButton;
        globalObj["PushButton"] = AcroFormPushButton;
        globalObj["RadioButton"] = AcroFormRadioButton;
        globalObj["CheckBox"] = AcroFormCheckBox;
        globalObj["TextField"] = AcroFormTextField;
        globalObj["PasswordField"] = AcroFormPasswordField;

        // backwardsCompatibility
        globalObj["AcroForm"] = { Appearance: AcroFormAppearance };
    } else {
        // eslint-disable-next-line no-console
        // console.warn("AcroForm-Classes are not populated into global-namespace, because the class-Names exist already. This avoids conflicts with the already used framework.");
    }

    jsPDFAPI.AcroFormChoiceField = AcroFormChoiceField;
    jsPDFAPI.AcroFormListBox = AcroFormListBox;
    jsPDFAPI.AcroFormComboBox = AcroFormComboBox;
    jsPDFAPI.AcroFormEditBox = AcroFormEditBox;
    jsPDFAPI.AcroFormButton = AcroFormButton;
    jsPDFAPI.AcroFormPushButton = AcroFormPushButton;
    jsPDFAPI.AcroFormRadioButton = AcroFormRadioButton;
    jsPDFAPI.AcroFormCheckBox = AcroFormCheckBox;
    jsPDFAPI.AcroFormTextField = AcroFormTextField;
    jsPDFAPI.AcroFormPasswordField = AcroFormPasswordField;
    jsPDFAPI.AcroFormAppearance = AcroFormAppearance;

    jsPDFAPI.AcroForm = {
        ChoiceField: AcroFormChoiceField,
        ListBox: AcroFormListBox,
        ComboBox: AcroFormComboBox,
        EditBox: AcroFormEditBox,
        Button: AcroFormButton,
        PushButton: AcroFormPushButton,
        RadioButton: AcroFormRadioButton,
        CheckBox: AcroFormCheckBox,
        TextField: AcroFormTextField,
        PasswordField: AcroFormPasswordField,
        Appearance: AcroFormAppearance
    };

    jsPDF.AcroForm = {
        ChoiceField: AcroFormChoiceField,
        ListBox: AcroFormListBox,
        ComboBox: AcroFormComboBox,
        EditBox: AcroFormEditBox,
        Button: AcroFormButton,
        PushButton: AcroFormPushButton,
        RadioButton: AcroFormRadioButton,
        CheckBox: AcroFormCheckBox,
        TextField: AcroFormTextField,
        PasswordField: AcroFormPasswordField,
        Appearance: AcroFormAppearance
    };
})(jsPDF, (typeof window !== 'undefined' && window || typeof global !== 'undefined' && global));