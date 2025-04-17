import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./Navbar";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Post from "./components/Post";
import ProfileDashboard from "./components/ProfileDashboard";
import AllChats from "./components/AllChats";
import ChatApp from "./components/ChatApp";
import GroupChat from "./components/GroupChat";
// import Appp from "./ecommerce/src/components/Appp";
import SellerDashboard from "./ecommerce/src/components/SellerDashboard";
import SellerRegister from "./ecommerce/src/components/SellerRegister";
import AdminDashboard from "./ecommerce/src/components/AdminDashboard";
import BuyerDashboard from "./ecommerce/src/components/BuyerDashboard";
import RegisterBuyer from "./ecommerce/src/components/BuyerRegister";
import ProductDetails from "./ecommerce/src/components/ProductDetails";
import Cart from "./ecommerce/src/components/Cart";
import Checkout from "./ecommerce/src/components/Checkout";
import CategoryProducts from "./ecommerce/src/components/CategoryProduct";
import PaymentSuccess from "./ecommerce/src/components/PaymentSucess";
import EcomHome from "./ecommerce/src/components/EcomHome";
import Llm from "./components/Llm";
import ChannelPage from "./components/ChannelPage";

const CLIENT_ID = "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";

function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Post />} />
          <Route path="/profile-dashboard" element={<ProfileDashboard />} />
          <Route path="/chat" element={<AllChats />} />
          <Route path="/chat/:chatUserId" element={<ChatApp />} />
          <Route path="/group/:communicationId" element={<GroupChat />} />
              <Route path="/ecomHome" element={<EcomHome />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/seller/register" element={<SellerRegister />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
              <Route path="/buyer/register" element={<RegisterBuyer />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/category/:category" element={<CategoryProducts />} />
              <Route path="/paymentsuccess" element={<PaymentSuccess />} />
          <Route path="/llm" element={<Llm/>}/>
          <Route path="/channel/:communicationId" element={<ChannelPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
