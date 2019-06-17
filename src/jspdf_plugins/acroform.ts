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
export default function setRadioAppearance(doc: any): any {
    let oldAppearanceFuncition: Function = doc.AcroFormAppearance.RadioButton.Circle.YesNormal;
    doc.AcroFormAppearance.RadioButton.Circle.YesNormal = function (formObject: any) {
        let xobj: any = oldAppearanceFuncition(formObject);
        let stream: string[] = xobj.stream.split('\n');
        let encodeColor: string = doc.__private__.encodeColorString(formObject.color);
        stream[0] = stream[0] + '\n' + encodeColor + '\n' + encodeColor.toUpperCase();
        xobj.stream = stream.join('\n');
        return xobj;
    }
}