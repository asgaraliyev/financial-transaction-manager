import { ExcelRow, ExcelRowSchema } from "../schemas/ExcelRowSchema";

export  function convertToUnderstandableData(data:any):ExcelRow{
    let excelEpoch = new Date(1900, 0, 1).getTime(); // Jan 1, 1900 in milliseconds
    return ExcelRowSchema.parse({
        Date: new Date(excelEpoch + (data["Tarix"] - 2) * 86400000),
        Description: data["TÉyinat"],
        Amount: data["MÉblÉÄ"],
        Category:"Category",  
        Reference:"Reference"     
    })
}