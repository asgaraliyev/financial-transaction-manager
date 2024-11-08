import React from 'react';
import { Layout, Typography } from 'antd';
import { FileUpload } from './components/FileUpload';
import { TransactionList } from './components/TransactionList';
import { Database } from 'lucide-react';
import './styles/main.scss';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center gap-4 bg-white shadow-md">
        <Database className="text-blue-500" size={32} />
        <Title level={3} className="m-0 text-gray-800">
          Financial Transaction Manager
        </Title>
      </Header>
      <Content className="p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Title level={4} className="mb-6">
              Import Transactions
            </Title>
            <FileUpload />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Title level={4} className="mb-6">
              Transaction History
            </Title>
            <TransactionList />
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default App;