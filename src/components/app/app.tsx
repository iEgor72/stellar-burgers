import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  type Location,
} from 'react-router-dom';

import { loadIngredients } from '@services/slices/data';
import { checkUser } from '@services/slices/user';
import { useDispatch, useSelector } from '@services/store';

import { ProtectedRoute } from '../protected-route';

import '../../index.css';

import styles from './app.module.css';
const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = (location.state as { background?: Location } | null)?.background;
  const { items, isLoading, error } = useSelector((state) => state.ingredients);
  useEffect(() => {
    void dispatch(loadIngredients());
    void dispatch(checkUser());
  }, [dispatch]);
  const closeModal = (): void => {
    void navigate(-1);
  };
  return (
    <div className={styles.app}>
      <AppHeader />
      {isLoading && !items.length ? (
        <Preloader />
      ) : error && !items.length ? (
        <p role="alert" className={styles.message}>
          {error}
          <button
            onClick={() => {
              void dispatch(loadIngredients());
            }}
          >
            Повторить
          </button>
        </p>
      ) : (
        <>
          <Routes location={background ?? location}>
            <Route path="/" element={<ConstructorPage />} />
            <Route path="/feed" element={<Feed />} />
            <Route
              path="/ingredients/:id"
              element={
                <section className={styles.detailPageWrap}>
                  <h1 className={styles.detailHeader}>Детали ингредиента</h1>
                  <IngredientDetails />
                </section>
              }
            />
            <Route
              path="/feed/:number"
              element={
                <section className={styles.detailPageWrap}>
                  <OrderInfo />
                </section>
              }
            />
            <Route element={<ProtectedRoute onlyGuest />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/orders" element={<ProfileOrders />} />
              <Route
                path="/profile/orders/:number"
                element={
                  <section className={styles.detailPageWrap}>
                    <OrderInfo />
                  </section>
                }
              />
            </Route>
            <Route path="*" element={<NotFound404 />} />
          </Routes>
          {background && (
            <Routes>
              <Route
                path="/ingredients/:id"
                element={
                  <Modal title="Детали ингредиента" onClose={closeModal}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path="/feed/:number"
                element={
                  <Modal title="Информация о заказе" onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/profile/orders/:number"
                  element={
                    <Modal title="Информация о заказе" onClose={closeModal}>
                      <OrderInfo />
                    </Modal>
                  }
                />
              </Route>
            </Routes>
          )}
        </>
      )}
    </div>
  );
};
export default App;
