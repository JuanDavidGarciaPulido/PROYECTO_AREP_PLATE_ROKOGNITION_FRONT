import './style/home.css';
import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate();

  function redirect() {
    navigate('/login');
  }
  
    return (
      <div className="container">
        <div className='content'>
            <h1>TrackPlate</h1>
            <p className='description'>Seguridad para tu comodidad y tranquilidad</p>
            <button onClick={() => redirect()}>Entrar</button>
        </div>
      </div>
    )
  }
  
export default Home
  