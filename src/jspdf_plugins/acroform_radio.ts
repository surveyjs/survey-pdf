export default function setRadioAppearance(doc: any): any {
    const oldAppearanceFuncition: Function = doc.AcroFormAppearance.RadioButton.Circle.YesNormal;
    doc.AcroFormAppearance.RadioButton.Circle.YesNormal = function(formObject: any) {
        const xobj: any = oldAppearanceFuncition(formObject);
        const stream: string[] = xobj.stream.split('\n');
        const encodeColor: string = doc.__private__.encodeColorString(formObject.color);
        stream[0] = stream[0] + '\n' + encodeColor + '\n' + encodeColor.toUpperCase();
        xobj.stream = stream.join('\n');
        return xobj;
    };
}