import { NotFilter } from "./notFilter.pipe";
import { QuotaRow } from "../types/quotaRow";
import { Quota } from "../types/quota";

describe('NotFilter Tests', () => {
    let pipe: NotFilter;

    let list2Levels: Array<QuotaRow> = [];
    let list2LevelsAux: Array<QuotaRow> = [];
    let quota1: Quota = new Quota();
    let quota2: Quota = new Quota();
    let quota3: Quota = new Quota();

    beforeEach(() => {
        pipe = new NotFilter();

        quota1.name = "quota1";
        quota2.name = "quota2";
        quota3.name = "quota1";

        list2Levels.push(new QuotaRow(quota1, "ABC", false));
        list2Levels.push(new QuotaRow(quota2, "ABC", false));
        list2Levels.push(new QuotaRow(quota3, "ABC", false));

        // same as list2Levels but without the quotas whose name is "quota1"
        list2LevelsAux.push(new QuotaRow(quota2, "ABC", false));
    });

    it('Should NotFilter list values by attribute', () => {
        var result = pipe.transform(list2Levels, "quota.name", "quota1", false);
        expect(result).toEqual(list2LevelsAux);
    });

});
