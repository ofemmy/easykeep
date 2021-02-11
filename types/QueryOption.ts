import TransactionType from "./TransactionType"

type QueryOption = {
    filter: any;
    exclude?: string[];
    queryOptions: { limit?: number; skip: number; sort: any };
    withAggregate?: boolean;
}
export default QueryOption