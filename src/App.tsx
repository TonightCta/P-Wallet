import './App.css';
import { useReducer, createContext } from 'react'
import { Context } from './utils/type';
import { HashRouter } from 'react-router-dom'
import { defaultContext, defaultState, defaultStateInit, initState } from './reducer';
import RouterConfig from './router';

export const PWallet = createContext<Context>(defaultContext);



function App() {
  const [state, dispatch] = useReducer(initState, defaultState, defaultStateInit);
  return (
    <HashRouter>
      <PWallet.Provider value={{ state, dispatch }}>
        <RouterConfig />
      </PWallet.Provider>
    </HashRouter>
  );
}

export default App;
