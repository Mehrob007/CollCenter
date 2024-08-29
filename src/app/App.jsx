import Router from './router/Router'
import '../components/styles.css'
import { ToastContainer,   } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function App() {
  return (<>
    <Router />
    <ToastContainer />
  </>)
}
// uri: '99200@192.168.1.118:5160',
// password: '66b2672475521157395738729e350015',
