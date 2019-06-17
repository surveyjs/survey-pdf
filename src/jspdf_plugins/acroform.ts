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