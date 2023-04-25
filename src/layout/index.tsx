import React, { useState, Suspense } from "react";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  NonIndexRouteObject,
  useLocation,
} from "react-router-dom";
import { MenuProps } from "antd";
import { Layout, Menu, theme, Breadcrumb, Spin } from "antd";
import HeaderComp from "./components/Header";
import { useLoginStore } from "src/stores";
import Login from "./components/Login";
import { routes } from "src/config/router";
import { NoAuthPage } from "src/pages";
import "antd/dist/reset.css";

type RouteType = NonIndexRouteObject & {
  title: string;
  icon: React.ReactElement;
};

const { Header, Content, Footer, Sider } = Layout;

const BasicLayout: any = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { userInfo } = useLoginStore();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { isAdmin } = useLoaderData() as any;
  const getItems: any = (children: RouteType[]) => {
    return children.map((item) => {
      if (item.children) {
        return getItems(item.children);
      } else {
        return {
          key: item.index
            ? "/"
            : item.path?.startsWith("/")
            ? item.path
            : `/${item.path}`,
          icon: item.icon,
          label: item.title,
        };
      }
    });
  };

  const menuItems: MenuProps["items"] = getItems(
    routes[0].children[0].children.filter((item) => item.path !== "*")
  );

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(key);
  };

  if (!userInfo) {
    return <Login />;
  }
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
          }}
        />
        <Menu
          theme="dark"
          defaultSelectedKeys={[pathname]}
          mode="inline"
          items={menuItems}
          onClick={onMenuClick}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: "0 10px", background: colorBgContainer }}>
          <HeaderComp />
        </Header>
        {/* height：Header和Footer的默认高度是64 */}

        <Content
          style={{
            margin: "0 16px",
            overflow: "auto",
            height: `calc(100vh - 128px)`,
          }}
        >
          {isAdmin ? (
            <>
              <Breadcrumb
                style={{ margin: "16px 0" }}
                items={[
                  {
                    title: "Home",
                  },
                  {
                    title: <a href="">Application Center</a>,
                  },
                  {
                    title: <a href="">Application List</a>,
                  },
                  {
                    title: "An Application",
                  },
                ]}
              />
              <Suspense
                fallback={<Spin size="large" className="content_spin" />}
              >
                <Outlet />
              </Suspense>
            </>
          ) : (
            <NoAuthPage />
          )}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
