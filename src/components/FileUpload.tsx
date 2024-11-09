import React from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useTransactionStore } from "../store/transactionStore";
import { convertToUnderstandableData } from "../functions/convertToUnderstandableData";
import { Transaction } from "../schemas/transaction";

const { Dragger } = Upload;


export const FileUpload: React.FC = () => {
  const setTransactions = useTransactionStore((state) => state.setTransactions);

  const processExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      let jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log("jsonData", jsonData);
      const transactions:Transaction[] = []
      jsonData.map(da => {
        const a = convertToUnderstandableData(da)
        if (a) {
          transactions.push(a)
        }
      })

      setTransactions(transactions);
      message.success("File uploaded and validated successfully");

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
