function pdfEscape (value: string) { return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)'); }
function toPDFString(string: string) {
    string = string || '';
    string.toString();
    string = '(' + pdfEscape(string) + ')';
    return string;
}

export function getPatchedAcroFormTextField(doc: any) {
    class PatchedAcroformTextField extends doc.AcroFormTextField {
        getKeyValueListForStream() {
            const res = super.getKeyValueListForStream();
            res.push({ key: 'DA', value: toPDFString(doc.AcroFormAppearance.createDefaultAppearanceStream(this)) });
            return res;
        }
    }
    return PatchedAcroformTextField;
}

export function getPatchedAcroFormRadioButton(doc: any) {
    class PatchedAcroFormCheckBox extends doc.AcroFormRadioButton {
        constructor() {
            super();
        }
        setAppearance(appearance: any) {
            super.setAppearance(appearance);
            const oldAppearanceFuncition = appearance.YesNormal;
            for (const objId in this.Kids) {
                if (this.Kids.hasOwnProperty(objId)) {
                    const child = this.Kids[objId];
                    child.appearanceStreamContent.N[child.optionName] = function(formObject: any) {
                        const xobj: any = oldAppearanceFuncition(formObject);
                        const stream: string[] = xobj.stream.split('\n');
                        const encodeColor: string = doc.__private__.encodeColorString(formObject.color);
                        stream[0] = stream[0] + '\n' + encodeColor + '\n' + encodeColor.toUpperCase();
                        xobj.stream = stream.join('\n');
                        return xobj;
                    };
                }
            }
        }
    }
    return PatchedAcroFormCheckBox;
}

export function getPatchedAcroFormCheckBox(doc: any) {
    class PatchedAcroFormCheckBox extends doc.AcroFormCheckBox {
        constructor() {
            super();
            const oldYerNormalAppearanceStream = this.appearanceStreamContent.N.On;
            this.appearanceStreamContent.N.On = function(formObject: any) {
                const xobj: any = oldYerNormalAppearanceStream(formObject);
                let stream: string[] = xobj.stream.split('\n');
                stream = stream.slice(3);
                xobj.stream = stream.join('\n');
                return xobj;
            };
        }
    }
    return PatchedAcroFormCheckBox;
}

export function getPatchedAcroFormComboBox(doc: any) {
    class PatchedAcroformTextField extends doc.AcroFormComboBox {
        constructor() {
            super();
        }
        set backgroundColor(val: string) {
            if(val) {
                let color = doc.__private__.encodeColorString(val).replace(/\s+RG/i, '');
                if(color.includes('g')) {
                    color = color.replace('g', '').repeat(3);
                }
                this.MK = `<< /BG [ ${color} ]  >>`;
            }
        }
    }
    return PatchedAcroformTextField;
}