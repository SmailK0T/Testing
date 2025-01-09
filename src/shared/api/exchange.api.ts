import { api } from "./config"
import { CalcRequest, CalcResponse } from "./types"

export const exchangeApi = {
    postCalcPair: async (props: CalcRequest) => {
        const { data } = await api.post<CalcResponse>('/change/user/pair/calc', {...props})
        return data;
    }
}