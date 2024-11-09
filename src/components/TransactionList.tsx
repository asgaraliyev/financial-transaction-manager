import React, { useState } from 'react';
import { Table, Tag, Input, Select, DatePicker, Typography } from 'antd';
import { useTransactionStore } from '../store/transactionStore';
import type { Transaction } from '../schemas/transaction';
import type { Dayjs } from 'dayjs';

const { Search } = Input;
const { RangePicker } = DatePicker;

export const TransactionList: React.FC = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchText.toLowerCase());
    
    
    const matchesDateRange = 
      !dateRange[0] || !dateRange[1] 
        ? true 
        : new Date(transaction.date) >= dateRange[0].toDate() && 
          new Date(transaction.date) <= dateRange[1].toDate();

    return matchesSearch &&  matchesDateRange;
  });

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Transaction, b: Transaction) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className={amount >= 0 ? 'text-green-600' : 'text-red-600'}>
          {Math.abs(amount).toFixed(2)} AZN
        </span>
      ),
      sorter: (a: Transaction, b: Transaction) => a.amount - b.amount,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'amount',
      render: (type: string,{amount}:Transaction) => (
        <Tag color={amount > 0 ? 'green' : 'red'}>
          {amount>0?"Mədaxil":"Məxaric"}
        </Tag>
      ),
    },
    {
      title: 'Əks hesab',
      dataIndex: 'to',
      key: 'to',
      render: (to: string) => (
        <Typography.Text>{to}</Typography.Text>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Search
          placeholder="Search transactions..."
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-md"
        />

        <RangePicker
          onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
          className="w-auto"
        />
      </div>
      <Table
        dataSource={filteredTransactions}
        columns={columns}
        rowKey="id"
        className="bg-white rounded-lg shadow-lg"
        pagination={{ pageSize: 10 }}
        summary={(pageData) => {
          const total = pageData.reduce((sum, transaction) => sum + transaction.amount, 0);
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2}>
                <strong>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <strong className={total >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(total).toFixed(2)} AZN
                </strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} colSpan={2} />
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
};