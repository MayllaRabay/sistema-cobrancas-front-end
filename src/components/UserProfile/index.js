import {
  Alert,
  Snackbar
} from '@mui/material';
import {
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { useHistory } from 'react-router-dom';
import editIcon from '../../assets/edit-icon.svg';
import logoutIcon from '../../assets/logout-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import AuthContext from '../../contexts/AuthContext';
import EditUserProfile from '../EditUserProfile';
import NavbarItem from '../NavbarItem';
import styles from './styles.module.scss';

function UserProfile() {
  const [editProfile, setEditProfile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [requestResult, setRequestResult] = useState();

  const history = useHistory();

  const {
    token, setToken,
    removeTokenLS
  } = useContext(AuthContext);

  const user = useRef();

  useEffect(() => {
    async function getProfile() {
      try {
        setRequestResult();

        const response = await fetch('https://academy-bills.herokuapp.com/profile', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const requestData = await response.json();

        if (!response.ok) {
          throw new Error(requestData);
        };

        user.current = requestData;
      } catch (error) {
        setRequestResult(error.message);
      };
    };

    getProfile();
  }, [token, setRequestResult, isVisible]);

  function handleIsVisible() {
    setIsVisible(!isVisible);
    setEditProfile(false);
  };

  function handleEditProfile() {
    setEditProfile(!editProfile);
    setIsVisible(!isVisible);
  };

  function handleLogout() {
    user.current = '';
    setToken('');
    removeTokenLS();
    history.push('/');
  };

  function handleAlertClose() {
    setRequestResult();
  };

  return (
    <div className={styles.content__wrapper}>
      <button onClick={handleIsVisible}>
        <img src={userIcon} alt='User Avatar' />
      </button>
      {isVisible &&
        <div className={styles.menuProfile}>
          <NavbarItem
            key='Menu_1'
            image={editIcon}
            title='Editar'
            onClick={handleEditProfile}
          />
          <NavbarItem
            key='Menu_2'
            image={logoutIcon}
            title='Deslogar'
            onClick={handleLogout}
          />
        </div>
      }
      {editProfile && <EditUserProfile user={user} />}
      <Snackbar
        className={styles.snackbar}
        open={!!requestResult}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert severity='error'>
          {requestResult}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserProfile;