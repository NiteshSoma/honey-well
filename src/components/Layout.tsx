import { Layout } from "antd";
import Image from "next/image";

const { Header, Footer, Content } = Layout;

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#001529", padding: "10px 20px", textAlign: "center" }}>
        <Image src="/logo.png" alt="Logo" width={120} height={40} />
      </Header>

      <Content style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
        {children}
      </Content>

      <Footer style={{ textAlign: "center", background: "#f0f2f5", padding: "10px 0" }}>
        © {new Date().getFullYear()} Your Company. All Rights Reserved.
      </Footer>
    </Layout>
  );
};

export default AppLayout;
