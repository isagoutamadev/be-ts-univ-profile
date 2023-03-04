export interface Paging<T> {
    datas: Array<T>,
    paging: {
        totalData: number,
        totalPage: number,
        currentPage: number,
        limit: number
    }
}

export class Pagination<T> {
    private datas: Array<T>;
    private total: number;
    private page: number;
    private limit: number;

    constructor(datas: Array<T>, total: number, page: number, limit: number) {
        this.datas = datas;
        this.total = total;
        this.page = page;
        this.limit = limit;
    }

    public getPaging = (): Paging<T> => {
        return {
            paging: {
                totalData: this.total,
                currentPage: this.page,
                limit: this.limit,
                totalPage: Math.ceil(this.total / this.limit)
            },
            datas: this.datas
        }
    }
}