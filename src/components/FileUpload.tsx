import React from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useTransactionStore } from "../store/transactionStore";
import { v4 as uuidv4 } from "uuid";
import { TransactionSchema } from "../schemas/transaction";
import { z } from "zod";
import { ExcelRowSchema } from "../schemas/ExcelRowSchema";
import { convertToUnderstandableData } from "../functions/convertToUnderstandableData";

const { Dragger } = Upload;


export const FileUpload: React.FC = () => {
  const setTransactions = useTransactionStore((state) => state.setTransactions);

  const processExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        // console.log("jsonData", jsonData);
        const validatedData = z.array(ExcelRowSchema).parse(jsonData);

        const transactions = validatedData.map((row) => {
          const convertedRow=convertToUnderstandableData(row)
          console.log("convertedRow", convertedRow)
          const transaction = {
            id: uuidv4(),
            date: convertedRow.Date,
            description: convertedRow.Description,
            amount: convertedRow.Amount,
            type: convertedRow.Amount >= 0 ? "credit" : "debit",
            category: convertedRow.Category || "Uncategorized",
            reference: convertedRow.Reference || "",
          };

          return TransactionSchema.parse(transaction);
        });

        setTransactions(transactions);
        message.success("File uploaded and validated successfully");
      } catch (error) {
        if (error instanceof z.ZodError) {
          message.error(
            "Invalid file format: Please check your Excel file structure"
          );
          console.error("Validation error:", error.errors);
        } else {
          message.error("Error processing file");
          console.error("Processing error:", error);
        }
      }
    };
    reader.readAsBinaryString(file);
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: ".xlsx,.xls,.csv",
    beforeUpload: (file: File) => {
      processExcelFile(file);
      return false;
    },
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Dragger {...uploadProps} className="bg-white shadow-lg rounded-lg">
        <p className="ant-upload-drag-icon">
          <InboxOutlined className="text-4xl text-blue-500" />
        </p>
        <p className="ant-upload-text text-lg font-semibold">
          Click or drag file to upload
        </p>
        <p className="ant-upload-hint text-gray-500">
          Support for Excel (.xlsx, .xls) and CSV files
        </p>
      </Dragger>
    </div>
  );
};
