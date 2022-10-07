import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import Notification from './components/UI/Notification';
import { sendCartData, fetchCartData } from './store/cart-actions';

// 외부에 변수로 설정해서 리렌더링 될 때 초기화되지 않도록 한다.
let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector(state => state.ui.cartIsVisible);
  const cart = useSelector(state => state.cart);
  const notification = useSelector(state => state.ui.notification);

  // 가져오기
  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  // 보내기
  useEffect(() => {
    // useEffect가 첫 마운트시에는 동작하지 않도록 막기.
    if (isInitial) {
      isInitial = false;
      return;
    }

    // fetch할 때는 데이터 전송을 하지 않도록 리듀서의 이니셜객체에 changed: false를 추가해 놓고 값이 true가 되었을 때만 (항목 추가/삭제 시) 데이터를 보내도록 했다.
    if (cart.changed) {
      dispatch(sendCartData(cart));
    }
  }, [cart, dispatch]);

  return (
    <>
      {notification && <Notification {...notification} />}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
