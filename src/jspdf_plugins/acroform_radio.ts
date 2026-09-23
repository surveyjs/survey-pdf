export function getPatchedAcroFormRadioButton(doc: any) {
    return class extends doc.AcroFormRadioButton {
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
    };
}