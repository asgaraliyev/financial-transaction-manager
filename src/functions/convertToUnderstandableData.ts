import { z } from "zod";
import dayjs from "dayjs";
import {v4 as uuid} from "uuid"
import { Transaction, TransactionSchema } from "../schemas/transaction";

export  function convertToUnderstandableData(data:any):Transaction|undefined{
    const isTransactionRow=z.number().safeParse(data["Hesabdan çıxarış / Account statement"])
    if (!isTransactionRow.success)return undefined
    const transaction:Transaction = {
        id:uuid(),
        date: new Date(new Date(1900, 0, 1).getTime() + (data["__EMPTY"] - 2) * 86400000),
        description: data["__EMPTY_7"],
        amount: data["__EMPTY_6"],
        to: data["__EMPTY_2"],
    }

    console.log("transaction",transaction)
    return TransactionSchema.parse(transaction)
}