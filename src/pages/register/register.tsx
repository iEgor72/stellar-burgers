import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

import { register } from '@services/slices/user';
import { useDispatch, useSelector } from '@services/store';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);
  const error = useSelector((state) =>
    state.user.errorAction === register.rejected.type ? state.user.error : null
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (isLoading) return;
    void dispatch(register({ email, password, name: userName }));
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
