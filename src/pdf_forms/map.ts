export default class FormsMap {
    private res: any = {};
    constructor(private map: any) { }
    private mapDataRecursive(data: any, map: any) {
        if(data === undefined || data === null) return;
        // The map covers only the fields the PDF has: data without a map entry is skipped.
        if(map === undefined || map === null) return;
        if (typeof(data) !== 'object') {
            if(Array.isArray(map)) {
                map.forEach((m) => {
                    this.mapDataRecursive(data, m);
                });
                return;
            }
            if (typeof(map) !== 'object') {
                this.res[map] = data;
            } else {
                const entry = map[data];
                // Skip a value without a { field, value } entry, including inherited names such as "toString".
                if(!entry || typeof entry !== 'object' || entry.field === undefined) return;
                this.res[entry.field] = entry.value;
            }
            return;
        }
        if (Array.isArray(data)) {
            data.forEach((d, i) => {
                this.mapDataRecursive(d, Array.isArray(map) ? map[i] : map);
            });
            return;
        }
        Object.keys(data).forEach(key => {
            this.mapDataRecursive(data[key], map[key]);
        });
    }
    mapData(data: any) {
        this.res = {};
        this.mapDataRecursive(data, this.map);
        return this.res;
    }
}