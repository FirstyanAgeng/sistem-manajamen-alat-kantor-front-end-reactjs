import NavigationBar from "./Navbar";
// import Footer from "./Footer";
import { Container } from "react-bootstrap";
const Layout = ({ children }) => {
  return (
    <>
      <NavigationBar />
      <Container>{children}</Container>
    </>
  );
};

export default Layout;
