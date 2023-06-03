import './App.css';
import RouterPage from './components/RouterPage';
import any from './images/any.jpg'
import {Container} from 'react-bootstrap'

function App() {
    return (
        <Container className="App">
            <img src={any} width="100%"/>
            <RouterPage/>
        </Container>
    );
}

export default App;