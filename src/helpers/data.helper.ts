export default class DataHelper {
    static objectParse(data: object): object {
        Object.keys(data).forEach(key => {
            try {
                //@ts-ignore
                if (data[key][0] == '{' || data[key][0] == '[') {
                    //@ts-ignore
                    data[key] = JSON.parse(data[key]);
                }
            } catch (error) {
                
            }
        });

        return data;
    }
}
