import React, { useState, useEffect } from "react";
import { Layout, Menu, Typography, Button, Card, Spin } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  MonitorOutlined,
  PlusOutlined,
  DownOutlined,
  UpOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import Logo from "./logo-compal.png";
import "./Menu.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
const { Header, Sider, Content } = Layout;

// Definição dos tipos para os dados do menu
interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
  subItems?: { text: string; path: string }[];
}

// Funções de utilitário
const getUserRoleFromToken = (token: string | null): string => {
  return token === "administrator" ? "administrator" : "operator";
};

const getMenuItems = (userRole: string): MenuItem[] => {
  const allItems: MenuItem[] = [
    {
      text: "Controle",
      icon: <HomeOutlined />,
      path: "/dashboard",
      roles: ["administrator", "operator"],
      subItems: [
        { text: "Dashboard", path: "/dashboard" },
        { text: "Linhas", path: "/liners" },
        { text: "Estações", path: "/stations" },
        { text: "Ligar Estação e Linha", path: "/linkstationline" },
      ],
    },
    {
      text: "Operadores",
      icon: <UserOutlined />,
      path: "/users",
      roles: ["administrator"],
    },
    {
      text: "Jigs",
      icon: <SettingOutlined />,
      path: "/jigs",
      roles: ["operator", "administrator"],
    },
    {
      text: "Monitores",
      icon: <MonitorOutlined />,
      path: "/monitors",
      roles: ["operator", "administrator"],
    },
    {
      text: "Cadastrar",
      icon: <PlusOutlined />,
      path: "/register",
      roles: ["administrator"],
    },
  ];

  return allItems.filter((item) => item.roles.includes(userRole));
};

// Componente do MenuList
interface MenuListProps {
  menuItems: MenuItem[];
}

const MenuList: React.FC<MenuListProps> = ({ menuItems }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const location = useLocation();
  const currentPath = location.pathname;

  const handleItemClick = (itemText: string) => {
    setExpandedItem(expandedItem === itemText ? null : itemText);
  };

  const isSelected = (path: string) => currentPath === path;

  return (
    <Menu mode="inline" theme="dark" defaultSelectedKeys={[currentPath]}>
      {menuItems.map((item, index) => (
        <Menu.SubMenu
          key={item.path}
          title={
            <>
              {item.icon}
              <span>{item.text}</span>
            </>
          }
          icon={expandedItem === item.text ? <UpOutlined /> : <DownOutlined />}
        >
          {item.subItems &&
            item.subItems.map((subItem, subIndex) => (
              <Menu.Item key={subItem.path}>
                <Link to={subItem.path}>{subItem.text}</Link>
              </Menu.Item>
            ))}
        </Menu.SubMenu>
      ))}
    </Menu>
  );
};

// Componente principal Menu
interface MenuProps {
  componentToShow: React.ReactNode;
}

const MenuComponent: React.FC<MenuProps> = ({ componentToShow }) => {
  const token = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const userRole = getUserRoleFromToken(token);
  const menuItems = getMenuItems(userRole);
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false); // Estado para colapsar o Sider

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed}>
        <div className="collapse-button-container">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-button"
          />
        </div>
        <MenuList menuItems={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: "#001529", color: "#FFFFFF" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography.Title level={3} style={{ color: "#FFFFFF" }}>
            <img src={Logo} alt="" width="200px" style={{ marginTop: "13px", marginLeft:'-15px' }} />
            </Typography.Title>
            <div>
              <SearchOutlinedIcon
                style={{ marginRight: 25, color: "#FFFFFF" }}
              />
              <HelpOutlineOutlinedIcon
                style={{ marginRight: 30, color: "#FFFFFF" }}
              />

              <NotificationsNoneOutlinedIcon
                style={{ marginRight: 30, color: "#FFFFFF" }}
              />
              <Typography.Text style={{ marginRight: 16, color: "#FFFFFF" }}>
                {name}
              </Typography.Text>
              <TranslateOutlinedIcon
                style={{ marginRight: 1, color: "#FFFFFF" }}
              />
              {/* <Button
                icon={<LogoutOutlined />}
                type="primary"
                onClick={logout}
                href="/login"
              >
                Sair
              </Button> */}
            </div>
          </div>
        </Header>
        <Content style={{ margin: "16px" }}>
          <Card style={{ overflow: "auto", minHeight: "500px" }}>
            {isLoading ? (
              <div className="loading-spinner">
                <Spin size="large" />
              </div>
            ) : (
              componentToShow
            )}
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MenuComponent;
