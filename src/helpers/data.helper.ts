export default class DataHelper {
    static objectParse(data: object): object {
        Object.keys(data).forEach((key) => {
            try {
                if (
                    //@ts-ignore
                    String(data[key]).toString()[0] == "{" ||
                    //@ts-ignore
                    String(data[key]).toString()[0] == "["
                ) {
                    //@ts-ignore
                    data[key] = JSON.parse(data[key].toString());
                }
            } catch (error) {}
        });

        return data;
    }
}
